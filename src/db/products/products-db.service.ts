import { Injectable } from "@nestjs/common";
import { ProductsDbRepository } from "./products-db.repository";
import { CreateProductDto, CreateProductResponseDto } from "api/products/dto/create-product.dto";

@Injectable()
export class ProductsDbService {
    constructor(private readonly productsRepository: ProductsDbRepository) {}

    async createProduct(product: CreateProductDto): Promise<CreateProductResponseDto> {
        return this.productsRepository.createProduct(product);
    }
}