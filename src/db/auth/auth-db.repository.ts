import { DBService } from "@db/db.service";
import { UserSignUpDto, UserDto } from "api/auth/dto/auth.dto";
import { first } from "rxjs";

import { Injectable } from "@nestjs/common";

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
        return {
            id:user.id,
            first_name:user.first_name,
            last_name:user.last_name,
            email:user.email,
            role:user.role
        }
     }

     async findUserByEmail(email:string):Promise<UserDto | null>{
        const user = await this.db.users.findUnique({
            where:{
                email:email
            }
        })
        if (!user) return null;
        return {
            id:user.id,
            first_name:user.first_name,
            last_name:user.last_name,
            email:user.email,
            role:user.role
        };
     }
    
}    