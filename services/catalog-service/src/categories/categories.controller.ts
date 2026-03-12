import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('stores/:storeId/categories')
export class CategoriesController {
    constructor(private categoriesService: CategoriesService) { }

    @ApiOperation({ summary: 'Create category' })
    @Post()
    @UseGuards(AuthGuard('jwt'))
    create(@Param('storeId') storeId: string, @Body() dto: CreateCategoryDto) {
        return this.categoriesService.create(storeId, dto);
    }

    @ApiOperation({ summary: 'List store categories' })
    @Get()
    findAll(@Param('storeId') storeId: string) {
        return this.categoriesService.findByStore(storeId);
    }

    @ApiOperation({ summary: 'Update category' })
    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    update(@Param('id') id: string, @Param('storeId') storeId: string, @Body() dto: UpdateCategoryDto) {
        return this.categoriesService.update(id, storeId, dto);
    }

    @ApiOperation({ summary: 'Delete category' })
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    remove(@Param('id') id: string, @Param('storeId') storeId: string) {
        return this.categoriesService.remove(id, storeId);
    }
}
