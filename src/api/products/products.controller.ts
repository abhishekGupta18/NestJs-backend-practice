import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductApiResponseDto, CreateProductDto, ProductListApiResponseDto, ProductListQueryDto, UpdateProductApiResponseDto, UpdateProductDto } from "./dto/products.dto";
import { JwtAuthGuard } from "api/auth/guard/jwt-auth.guard";
import { PermissionsGuard } from "api/auth/guard/permissions.guard";
import { RequirePermission } from "api/auth/decorator/permissions.decorator";
import { ResponseUtil } from "@common/helpers/response.utils";
import { CreateProductSwagger, ProductListSwagger, UpdateProductSwagger } from "./swagger/products.swagger";

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()        
    @CreateProductSwagger()
    @UseGuards(PermissionsGuard)
    @RequirePermission('add_products')
    async createProduct(@Body() createProductDto: CreateProductDto): Promise<CreateProductApiResponseDto> {
        const product = await  this.productsService.createProduct(createProductDto);
        return ResponseUtil.success(product, 'Product created successfully', HttpStatus.OK);
    }

    @Patch(':id')
    @UpdateProductSwagger()
    @UseGuards(PermissionsGuard)
    @RequirePermission('update_products')
    async updateProduct(@Body() updateProductDto: UpdateProductDto, @Param('id') id: string): Promise<UpdateProductApiResponseDto> {
        const product = await this.productsService.updateProduct(updateProductDto, id);
        return ResponseUtil.success(product, 'Product updated successfully', HttpStatus.OK);
    }

    @Get()
    @ProductListSwagger()
    async getAllProducts(@Query() query: ProductListQueryDto ): Promise<ProductListApiResponseDto> {
        const result = await this.productsService.getAllProducts(query);
        return ResponseUtil.success(result, 'Products fetched successfully', HttpStatus.OK);
    }

    
}

