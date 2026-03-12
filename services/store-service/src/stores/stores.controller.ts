import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { CurrentUser } from '@restaurant/shared';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Stores')
@Controller('stores')
export class StoresController {
    constructor(private storesService: StoresService) { }

    @ApiOperation({ summary: 'Create store' })
    @Post()
    @UseGuards(AuthGuard('jwt'))
    create(@CurrentUser() user: any, @Body() dto: CreateStoreDto) {
        return this.storesService.create(user.id, dto);
    }

    @ApiOperation({ summary: 'List my stores' })
    @Get()
    @UseGuards(AuthGuard('jwt'))
    findAll(@CurrentUser() user: any) {
        return this.storesService.findByMerchant(user.id);
    }

    @ApiOperation({ summary: 'Get store by slug' })
    @Get('slug/:slug')
    findBySlug(@Param('slug') slug: string) {
        return this.storesService.findBySlug(slug);
    }

    @ApiOperation({ summary: 'Get store by id' })
    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    findOne(@Param('id') id: string, @CurrentUser() user: any) {
        return this.storesService.findOne(id, user.id);
    }

    @ApiOperation({ summary: 'Update store' })
    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    update(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: UpdateStoreDto) {
        return this.storesService.update(id, user.id, dto);
    }

    @ApiOperation({ summary: 'Delete store' })
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    remove(@Param('id') id: string, @CurrentUser() user: any) {
        return this.storesService.remove(id, user.id);
    }
}
