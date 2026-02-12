import { DBService } from "@db/db.service";
import { UserSignUpDto, UserDto } from "api/auth/dto/auth.dto";


import { Injectable } from "@nestjs/common";
import { getEnv } from "@common/getEnv";

@Injectable()
export class AuthDbRepository {
    constructor(private readonly db: DBService) {}

     async createUser(data:UserSignUpDto):Promise<UserDto>{
        const user = await this.db.users.create({
            data:{
                first_name:data.first_name,
                last_name:data.last_name,
                email:data.email,
            }
        })

        // make a helper function that give the constant from .env file

        const userRole = await this.db.user_roles.create({
            data:{
                user_id:user.id,
                role_id: getEnv("customer_role_id")
            },
            include:{
                role:{
                    select:{
                        role_name:true
                    }
                }
            }
        })
        if (!userRole) throw new Error("Failed to create user role");
       
        return {
            id:user.id,
            first_name:user.first_name,
            last_name:user.last_name,
            email:user.email,
            role:userRole.role.role_name
        }
     }

     async findUserByEmail(email:string):Promise<UserDto | null>{
        const user = await this.db.users.findUnique({
            where:{
                email:email
            }, 
            include:{
                user_roles:{
                    select:{
                        role:{
                            select:{
                                role_name:true
                            }
                        }
                    }
                }
            }
        })
        if (!user) return null;
        return {
            id:user.id,
            first_name:user.first_name,
            last_name:user.last_name,
            email:user.email,
            role:user.user_roles[0].role.role_name
        };
     }



     async getUserPermissions(userId: string): Promise<Set<string>> {
        const user = await this.db.users.findUnique({
            where: { id: userId },
            select: {
                user_roles: {
                    select: {
                        role: {
                            select: {
                                role_permissions: {
                                    select: {
                                        permission: {
                                            select: {
                                                permission_name: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                user_permissions: {
                    select: {
                        permission: {
                            select: {
                                permission_name: true
                            }
                        }
                    }
                }
            }
        });

        if (!user) return new Set();

        const permissions = new Set<string>();

        // Add role-based permissions
        user.user_roles.forEach(ur => {
            ur.role.role_permissions.forEach(rp => {
                permissions.add(rp.permission.permission_name);
            });
        });

        // Add direct permissions
        user.user_permissions.forEach(up => {
            permissions.add(up.permission.permission_name);
        });

        return permissions;
     }
    
}    