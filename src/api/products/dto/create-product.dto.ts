import { ApiResponse } from "@common/dto/api-response";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateProductDto {

    @ApiProperty({example: "macbook pro"})
    @IsString()
    product_name: string;

    @ApiProperty({example: "https://example.com/product-image.jpg"})
    @IsString()
    product_image?: string;

    @ApiProperty({example: "10"})
    @IsNumber()
    stock: number;

    @ApiProperty({example: "5"})
    @IsNumber()
    rating?: number;

    @ApiProperty({example: "10000"})
    @IsNumber()
    price: number;
}


export class CreateProductResponseDto {
    @ApiProperty({example: "1"})
    @IsNumber()
    id: string;

    @ApiProperty({example: "macbook pro"})
    @IsString()
    product_name: string;

    @ApiProperty({example: "https://example.com/product-image.jpg"})
    @IsString()
    product_image?: string;

    @ApiProperty({example: "10"})
    @IsNumber()
    stock: number;

    @ApiProperty({example: "5"})
    @IsNumber()
    rating?: number;

    @ApiProperty({example: "10000"})
    @IsNumber()
    price: number;
}

 export class CreateProductApiResponseDto extends ApiResponse<CreateProductResponseDto> {
    @ApiProperty({type: () => CreateProductResponseDto})
    declare data?: CreateProductResponseDto;
}
