import { ProductsDbService } from "@db/products/products-db.service";
import { CreateProductDto, CreateProductResponseDto, ProductDetail, ProductListApiResponseDto, ProductListQueryDto, ProductListResponseDto, UpdateProductDto, UpdateProductResponseDto } from "./dto/products.dto";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class ProductsService {
    constructor(private readonly productsDbService: ProductsDbService) {}

    async createProduct(createProductDto: CreateProductDto): Promise<CreateProductResponseDto> {
        const {product, categories} = await this.productsDbService.createProduct(createProductDto);

        return {
            product: {
                id: product.id,
                product_name: product.product_name,
                stock: product.stock,
                rating: product.rating,
                price_cent: product.price_cent
            },
            categories: categories.map((cat) => ({
                id: cat.id,
                category_name: cat.category_name
            }))
        }
    }

    async updateProduct(updateProductDto: UpdateProductDto, id: string): Promise<UpdateProductResponseDto> {
        if(!id){
            throw new BadRequestException('Product id is required');
        }
        const { product, categories } = await this.productsDbService.updateProduct(updateProductDto, id);
        return {
            product: {
                id: product.id,
                product_name: product.product_name,
                stock: product.stock,
                rating: product.rating,
                price_cent: product.price_cent
            },
            categories: categories.map((cat) => ({
                id: cat.id,
                category_name: cat.category_name
            }))
        }
    }

    async getAllProducts(query: ProductListQueryDto): Promise<ProductListResponseDto> {
        const { products, total } = await this.productsDbService.getAllProducts(query);
        const mappedProducts = products.map(product => ({
            product: {
                id: product.id,
                product_name: product.product_name,
                stock: product.stock,
                rating: product.rating,
                price_cent: product.price_cent
            },
            categories: product.product_categories.map(pc => ({
                id: pc.category.id,
                category_name: pc.category.category_name
            }))
        }));

        return {
            products: mappedProducts,
            total,
            page: query.page || 1,
            limit: query.limit || 10
        };
    }
}