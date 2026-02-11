import { DBService } from "@db/db.service";
import { Injectable } from "@nestjs/common";
import { CreateProductDto, CreateProductResponseDto } from "api/products/dto/create-product.dto";

@Injectable()
export class ProductsDbRepository {
    constructor(private readonly db:DBService) {}

    async createProduct(product: CreateProductDto): Promise<CreateProductResponseDto> {
        const createdProduct = await this.db.products.create({ data: {
            product_name: product.product_name,
            product_image: product.product_image,
            stock: product.stock,
            rating: product.rating,
            price_cent: product.price*100,
        } });
        return {
           id: createdProduct.id,
           product_name: createdProduct.product_name,
           product_image: createdProduct.product_image,
           stock: createdProduct.stock,
           rating: createdProduct.rating,
           price: createdProduct.price_cent,

        }
    }
}