import { ApiResponse } from "@common/dto/api-response";
import { ApiProperty } from "@nestjs/swagger";
import { OrderStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";



export class orderItemsDto{

    @ApiProperty({example:"68272765sbvsbsh8njs2233"})
    @IsNotEmpty()
    @IsString()
    productId: string;

    @ApiProperty({example:"Product 1"})
    @IsOptional()
    @IsString()
    productName?: string;

    @ApiProperty({example:2})
    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}

export class CreateOrderDto{
    @ApiProperty({type:[orderItemsDto]})
    @IsArray()
    @ArrayMinSize(1)
    @Type(() => orderItemsDto)
    @ValidateNested({ each: true })
    orderItems: orderItemsDto[];
}

export class CreatedOrderResponseDto{
    @ApiProperty({example:"68272765sbvsbsh8njs2233"})
    @IsNotEmpty()
    @IsString()
    orderId: string;

    @ApiProperty({example:"68272765sbvsbsh8njs2233"})
    @IsNotEmpty()
    @IsString()
    userId: string;


    @ApiProperty({example:"2026-02-19T10:55:38+05:30"})
    @IsNotEmpty()
    @IsString()
    orderDate: string;

    @ApiProperty({example:200})
    @IsNotEmpty()
    @IsNumber()
    total_amount_cents: number;

    @ApiProperty({example:"PENDING"})
    @IsNotEmpty()
    @IsString()
    orderStatus: string;

    @ApiProperty({type:[orderItemsDto]})
    @IsNotEmpty()
    @Type(() => orderItemsDto)
    @ValidateNested({ each: true })
    orderItems: orderItemsDto[];

    
}

export class UpdateOrderStatusDto{
    @ApiProperty({example:"PENDING"})
    @IsNotEmpty()
    @IsEnum(OrderStatus)
    orderStatus: OrderStatus;
}

export class UpdatedOrderResponseDto{
    @ApiProperty({example:"68272765sbvsbsh8njs2233"})
    @IsNotEmpty()
    @IsString()
    orderId: string;

    @ApiProperty({example:"PENDING"})
    @IsNotEmpty()
    @IsString()
    orderStatus: string;
    
}

export class FilterOrdersListDto {
    @ApiProperty({example:"PENDING"})
    @IsOptional()
    @IsEnum(OrderStatus)
    orderStatus?:OrderStatus;

    @ApiProperty({example:"68272765sbvsbsh8njs2233"})
    @IsOptional()
    @IsString()
    userId?:string;

    @ApiProperty({example:"2026-02-19T10:55:38+05:30"})
    @IsOptional()
    @IsString()
    orderStartDate?:string;

    @ApiProperty({example:"2026-02-19T10:55:38+05:30"})
    @IsOptional()
    @IsString()
    orderEndDate?:string;

    

}


export class GetOrderResponseDto extends CreatedOrderResponseDto{
    
}


export class UpdatedOrderApiResponseDto extends ApiResponse<UpdatedOrderResponseDto> {
    @ApiProperty({ type: () => UpdatedOrderResponseDto })
    declare data?: UpdatedOrderResponseDto;
}

export class CreatedOrderApiResponseDto extends ApiResponse<CreatedOrderResponseDto> {
    @ApiProperty({ type: () => CreatedOrderResponseDto })
    declare data?: CreatedOrderResponseDto;
}

export class GetAllOrdersApiResponseDto extends ApiResponse<GetOrderResponseDto[]> {
    @ApiProperty({ type: () => [GetOrderResponseDto] })
    declare data?: GetOrderResponseDto[];
}
export class GetOrdersApiResponseDto extends ApiResponse<GetOrderResponseDto>{
    @ApiProperty({ type: () => [GetOrderResponseDto] })
    declare data?: GetOrderResponseDto;
}