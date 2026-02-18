import { DBService } from "@db/db.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateProductDto, ProductListQueryDto, UpdateProductDto } from "api/products/dto/products.dto";

@Injectable()
export class ProductsDbRepository {
    constructor(private readonly db: DBService) { }

    // also check the category_id is valid or not, and make sure you link product with all the categories that are coming in the array if any is not valid then throw an erro
    async createProduct(productDto: CreateProductDto) {
        const categoryIds = productDto.categories_ids || [];

        if (categoryIds.length > 0) {
            const validCategoriesCount = await this.db.categories.count({
                where: {
                    id: { in: categoryIds }
                }
            });

            if (validCategoriesCount !== categoryIds.length) {
                throw new BadRequestException("One or more category IDs are invalid.");
            }
        }

        const createdResult = await this.db.$transaction(async (tx) => {
            const product = await tx.products.create({
                data: {
                    product_name: productDto.product_name,
                    stock: productDto.stock,
                    rating: productDto.rating,
                    price_cent: productDto.price * 100,
                }
            })

            let linkedCategories = [];
            if (categoryIds.length > 0) {
                await tx.product_categories.createMany({
                    data: categoryIds.map(catId => ({
                        product_id: product.id,
                        category_id: catId,
                    }))
                });

                linkedCategories = await tx.categories.findMany({
                    where: {
                        id: { in: categoryIds }
                    },
                    select: {
                        id: true,
                        category_name: true
                    }
                });
            }

            return {
                product: {
                    ...product
                },
                categories: linkedCategories
            }
        })
        return createdResult;
    }

    async updateProduct(productDto: UpdateProductDto, productId: string) {
        const updatedResult = await this.db.$transaction(async (tx) => {
            const product = await tx.products.update({
                where: {
                    id: productId,
                    deleted_at: null
                },
                data: {
                    product_name: productDto.product_name,
                    stock: productDto.stock,
                    rating: productDto.rating,
                    price_cent: productDto.price * 100,
                }
            })

            let linkedCategories = [];
            if (productDto.categories_ids?.length > 0) {
                await tx.product_categories.deleteMany({
                    where: {
                        product_id: productId
                    }
                });

                await tx.product_categories.createMany({
                    data: productDto.categories_ids.map(catId => ({
                        product_id: productId,
                        category_id: catId,
                    }))
                });

                linkedCategories = await tx.categories.findMany({
                    where: {
                        id: { in: productDto.categories_ids }
                    },
                    select: {
                        id: true,
                        category_name: true
                    }
                });
            }

            return {
                product: {
                    ...product
                },
                categories: linkedCategories
            }
        })
        return updatedResult;
    }

    async getAllProducts(query: ProductListQueryDto) {
        const { search, category_id, page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;

        const where: any = {
            deleted_at: null
        };

        if (search) {
            where.product_name = {
                contains: search,
                mode: 'insensitive'
            };
        }

        if (category_id && category_id.length > 0) {
            where.product_categories = {
                some: {
                    category_id: {
                        in: category_id
                    }
                }
            };
        }

        const [products, total] = await Promise.all([
            this.db.products.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    created_at: 'desc'
                },
                include: {
                    product_categories: {
                        select: {
                            category: {
                                select: {
                                    id: true,
                                    category_name: true
                                }
                            }
                        }
                    }
                }
            }),
            this.db.products.count({ where })
        ]);

        return { products, total };
    }
}

// I want to display the all category name and the ctaegory Id products linked with 