import { ProductsDbService } from "@db/products/products-db.service";
import { CreateProductDto, CreateProductResponseDto } from "./dto/create-product.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductsService {
    constructor(private readonly productsDbService: ProductsDbService) {}

    async createProduct(createProductDto: CreateProductDto): Promise<CreateProductResponseDto> {
        return this.productsDbService.createProduct(createProductDto);
    }
}