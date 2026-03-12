import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('stores/:storeId/products')
export class ProductsController {
    constructor(private productsService: ProductsService) { }

    @ApiOperation({ summary: 'Create product' })
    @Post()
    @UseGuards(AuthGuard('jwt'))
    create(@Param('storeId') storeId: string, @Body() dto: CreateProductDto) {
        return this.productsService.create(storeId, dto);
    }

    @ApiOperation({ summary: 'List store products' })
    @Get()
    findAll(@Param('storeId') storeId: string) {
        return this.productsService.findByStore(storeId);
    }

    @ApiOperation({ summary: 'List products by category' })
    @Get('category/:categoryId')
    findByCategory(@Param('storeId') storeId: string, @Param('categoryId') categoryId: string) {
        return this.productsService.findByCategory(storeId, categoryId);
    }

    @ApiOperation({ summary: 'Get product by id' })
    @Get(':id')
    findOne(@Param('id') id: string, @Param('storeId') storeId: string) {
        return this.productsService.findOne(id, storeId);
    }

    @ApiOperation({ summary: 'Update product' })
    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    update(@Param('id') id: string, @Param('storeId') storeId: string, @Body() dto: UpdateProductDto) {
        return this.productsService.update(id, storeId, dto);
    }

    @ApiOperation({ summary: 'Delete product' })
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    remove(@Param('id') id: string, @Param('storeId') storeId: string) {
        return this.productsService.remove(id, storeId);
    }
}
