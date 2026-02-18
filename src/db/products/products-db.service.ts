import { Injectable } from "@nestjs/common";
import { ProductsDbRepository } from "./products-db.repository";
import { CreateProductDto, ProductListQueryDto, UpdateProductDto } from "api/products/dto/products.dto";

@Injectable()
export class ProductsDbService {
    constructor(private readonly productsRepository: ProductsDbRepository) { }

    async createProduct(product: CreateProductDto) {
        return this.productsRepository.createProduct(product);
    }
    async updateProduct(product: UpdateProductDto, productId: string) {
        return this.productsRepository.updateProduct(product, productId);
    }

    async getAllProducts(query: ProductListQueryDto) {
        return this.productsRepository.getAllProducts(query);
    }
}