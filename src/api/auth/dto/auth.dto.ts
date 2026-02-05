import { ApiResponse } from "@common/dto/api-response"
import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class UserSignUpDto {

    @ApiProperty({example:"Jhon"})
    @IsString()
    @IsNotEmpty()
    first_name:string

    @ApiProperty({example:"Doe"})
    @IsString()
    @IsNotEmpty()
    last_name:string

    @ApiProperty({example:"jhon.doe@gmail.com"})
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email:string

}

export class UserSignUpResponseDto {

    @ApiProperty({example:"12344jddb2"})
    @IsString()
    id:string

     @ApiProperty({example:"Jhon"})
    @IsString()
    first_name:string

    @ApiProperty({example:"Doe"})
    @IsString()
    last_name:string

    @ApiProperty({example:"jhon.doe@gmail.com"})
    @IsEmail()
    @IsString()
    email:string


    @ApiProperty({example:"user"})
    @IsString()
    role:string

}


export class UserSignUpApiResponseDto extends ApiResponse<UserSignUpResponseDto> {

    @ApiProperty({type: () => UserSignUpResponseDto})
    declare data?:UserSignUpResponseDto
}


