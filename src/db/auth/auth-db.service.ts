import { UserSignUpDto, UserDto } from "api/auth/dto/auth.dto";
import { AuthDbRepository } from "./auth-db.repository";

import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthDbService {
    constructor(private readonly authDbRepository:AuthDbRepository) {}

    async createUser(data:UserSignUpDto):Promise<UserDto>{
        return this.authDbRepository.createUser(data)
    }
    async findUserByEmail(email:string):Promise<UserDto | null>{
        return this.authDbRepository.findUserByEmail(email)
    }

    async checkPermission(userId: string, permissionName: string): Promise<boolean> {
        return this.authDbRepository.checkUserPermission(userId, permissionName);
    }
    
}