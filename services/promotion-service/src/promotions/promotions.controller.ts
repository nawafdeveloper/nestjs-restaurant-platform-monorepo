import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Promotions')
@Controller('stores/:storeId/promotions')
export class PromotionsController {
    constructor(private promotionsService: PromotionsService) { }

    @ApiOperation({ summary: 'Create promotion' })
    @Post()
    @UseGuards(AuthGuard('jwt'))
    create(@Param('storeId') storeId: string, @Body() dto: CreatePromotionDto) {
        return this.promotionsService.create(storeId, dto);
    }

    @ApiOperation({ summary: 'List store promotions' })
    @Get()
    @UseGuards(AuthGuard('jwt'))
    findAll(@Param('storeId') storeId: string) {
        return this.promotionsService.findByStore(storeId);
    }

    @ApiOperation({ summary: 'List active promotions' })
    @Get('active')
    findActive(@Param('storeId') storeId: string) {
        return this.promotionsService.findActiveForStore(storeId);
    }

    @ApiOperation({ summary: 'Update promotion' })
    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    update(@Param('id') id: string, @Param('storeId') storeId: string, @Body() dto: UpdatePromotionDto) {
        return this.promotionsService.update(id, storeId, dto);
    }

    @ApiOperation({ summary: 'Delete promotion' })
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    remove(@Param('id') id: string, @Param('storeId') storeId: string) {
        return this.promotionsService.remove(id, storeId);
    }
}
