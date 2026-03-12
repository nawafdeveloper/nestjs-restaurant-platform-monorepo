import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VariantsService } from './variants.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { CreateVariantOptionDto } from './dto/create-variant-option.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Variants')
@Controller('products/:productId/variants')
export class VariantsController {
    constructor(private variantsService: VariantsService) { }

    @ApiOperation({ summary: 'Create variant' })
    @Post()
    @UseGuards(AuthGuard('jwt'))
    create(@Param('productId') productId: string, @Body() dto: CreateVariantDto) {
        return this.variantsService.createVariant(productId, dto);
    }

    @ApiOperation({ summary: 'List product variants' })
    @Get()
    findAll(@Param('productId') productId: string) {
        return this.variantsService.findByProduct(productId);
    }

    @ApiOperation({ summary: 'Add variant option' })
    @Post(':variantId/options')
    @UseGuards(AuthGuard('jwt'))
    addOption(@Param('variantId') variantId: string, @Body() dto: CreateVariantOptionDto) {
        return this.variantsService.addOption(variantId, dto);
    }

    @ApiOperation({ summary: 'List variant options' })
    @Get(':variantId/options')
    findOptions(@Param('variantId') variantId: string) {
        return this.variantsService.findOptions(variantId);
    }

    @ApiOperation({ summary: 'Delete variant' })
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    remove(@Param('id') id: string) {
        return this.variantsService.removeVariant(id);
    }

    @ApiOperation({ summary: 'Delete variant option' })
    @Delete(':variantId/options/:optionId')
    @UseGuards(AuthGuard('jwt'))
    removeOption(@Param('optionId') optionId: string) {
        return this.variantsService.removeOption(optionId);
    }
}
