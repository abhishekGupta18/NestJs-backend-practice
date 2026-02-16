import { ApiResponse } from "@common/dto/api-response";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CategoryDto {

    @ApiProperty({ example: "Electronics" })
    @IsString()
    name: string;
}

export class CategoryResponseDto {

    @ApiProperty({ example: "uuid" })
    @IsString()
    id: string;

    @ApiProperty({ example: "Electronics" })
    @IsString()
    name: string;

    
}

export class CategoryApiResponseDto extends ApiResponse<CategoryResponseDto>{
    @ApiProperty({type: () => CategoryResponseDto})
  declare data?: CategoryResponseDto;    
}


export class GetAllCategoriesApiResponseDto extends ApiResponse<CategoryResponseDto[]>{
    @ApiProperty({type: () => CategoryResponseDto})
  declare data?: CategoryResponseDto[];    
}
