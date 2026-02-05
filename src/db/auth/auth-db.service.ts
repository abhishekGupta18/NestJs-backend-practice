import { UserSignUpDto, UserSignUpResponseDto } from "api/auth/dto/auth.dto";
import { AuthDbRepository } from "./auth-db.repository";

import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthDbService {
    constructor(private readonly authDbRepository:AuthDbRepository) {}

    async createUser(data:UserSignUpDto):Promise<UserSignUpResponseDto>{
        return this.authDbRepository.createUser(data)
    }
    async findUserByEmail(email:string):Promise<UserSignUpResponseDto | null>{
        return this.authDbRepository.findUserByEmail(email)
    }
    
}