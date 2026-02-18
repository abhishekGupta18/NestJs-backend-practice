import { ApiResponse } from "@common/dto/api-response";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CategoryClass {
    @ApiProperty({ example: "uuid-1" })
    @IsString()
    id: string;

    @ApiProperty({ example: "macbook pro" })
    @IsString()
    category_name: string;
}

export class ProductDetail {
    @ApiProperty({ example: "uuid-product-1" })
    @IsString()
    id: string;

    @ApiProperty({ example: "macbook pro" })
    @IsString()
    product_name: string;

    @ApiProperty({ example: 10 })
    @IsNumber()
    stock: number;

    @ApiProperty({ example: 5, required: false })
    @IsOptional()
    @IsNumber()
    rating?: number;

    @ApiProperty({ example: 10000 })
    @IsNumber()
    price_cent: number;

}

export class CreateProductDto {
    @ApiProperty({ example: "macbook pro" })
    @IsString()
    product_name: string;

    @ApiProperty({ example: 10 })
    @IsNumber()
    stock: number;

    @ApiProperty({ example: 5, required: false })
    @IsOptional()
    @IsNumber()
    @Max(5)
    @Min(0)
    rating?: number;

    @ApiProperty({ example: 10000 })
    @IsNumber()
    price: number;

    @ApiProperty({ example: ["uuid-1", "uuid-2"], type: [String] })
    @IsArray()
    @IsString({ each: true })
    categories_ids: string[];
}

export class UpdateProductDto {
    @ApiProperty({ example: "macbook pro" })
    @IsString()
    product_name?: string;

    @ApiProperty({ example: 10 })
    @IsNumber()
    stock?: number;

    @ApiProperty({ example: 5, required: false })
    @IsOptional()
    @IsNumber()
    @Max(5)
    @Min(0)
    rating?: number;

    @ApiProperty({ example: 10000 })
    @IsOptional()
    @IsNumber()
    price?: number;

    @ApiProperty({ example: ["uuid-1", "uuid-2"], type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    categories_ids?: string[];
}

export class ProductListQueryDto {
    @ApiProperty({ example: "macbook pro" })
    @IsString()
    @IsOptional()
    search?: string;

   
    @ApiProperty({ example: ["uuid-1", "uuid-2"], type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) return parsed;
            } catch (e) {}
            return [value];
        }
        return Array.isArray(value) ? value : [value];
    })
    category_id?: string[];

    @ApiProperty({ example: 10 })
    @IsNumber()
    @IsOptional()
    page?: number;

    @ApiProperty({ example: 10 })
    @IsNumber()
    @IsOptional()
    limit?: number;
}

export class CreateProductResponseDto {
    @ApiProperty({ type: () => ProductDetail })
    product: ProductDetail;

    @ApiProperty({ type: [CategoryClass] })
    categories: CategoryClass[];
}

export class CreateProductApiResponseDto extends ApiResponse<CreateProductResponseDto> {
    @ApiProperty({ type: () => CreateProductResponseDto })
    declare data?: CreateProductResponseDto;
}

export class UpdateProductResponseDto {
    @ApiProperty({ type: () => ProductDetail })
    product: ProductDetail;

    @ApiProperty({ type: [CategoryClass] })
    categories: CategoryClass[];
}

export class UpdateProductApiResponseDto extends ApiResponse<UpdateProductResponseDto> {
    @ApiProperty({ type: () => UpdateProductResponseDto })
    declare data?: UpdateProductResponseDto;
}

export class ProductListResponseDto {
    @ApiProperty({ type: [CreateProductResponseDto] })
    products: CreateProductResponseDto[];

    @ApiProperty()
    total: number;

    @ApiProperty()
    page: number;

    @ApiProperty()
    limit: number;
}

export class ProductListApiResponseDto extends ApiResponse<ProductListResponseDto> {
    @ApiProperty({ type: ProductListResponseDto })
    declare data?: ProductListResponseDto;
}
