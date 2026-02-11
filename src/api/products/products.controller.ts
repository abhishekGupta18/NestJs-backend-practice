import { Body, Controller, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductApiResponseDto, CreateProductDto } from "./dto/create-product.dto";
import { JwtAuthGuard } from "api/auth/guard/jwt-auth.guard";
import { PermissionsGuard } from "api/auth/guard/permissions.guard";
import { RequirePermission } from "api/auth/decorator/permissions.decorator";
import { ResponseUtil } from "@common/helpers/response.utils";

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post("/create")        
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermission("view_products")
    async createProduct(@Body() createProductDto: CreateProductDto): Promise<CreateProductApiResponseDto> {
        const product = await  this.productsService.createProduct(createProductDto);
        return ResponseUtil.success(product, 'Product created successfully', HttpStatus.OK);
    }
}


