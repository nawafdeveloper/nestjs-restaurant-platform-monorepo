import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ModifiersService } from './modifiers.service';
import { CreateModifierDto } from './dto/create-modifier.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Modifiers')
@Controller('products/:productId/modifiers')
export class ModifiersController {
    constructor(private modifiersService: ModifiersService) { }

    @ApiOperation({ summary: 'Create modifier' })
    @Post()
    @UseGuards(AuthGuard('jwt'))
    create(@Param('productId') productId: string, @Body() dto: CreateModifierDto) {
        return this.modifiersService.create(productId, dto);
    }

    @ApiOperation({ summary: 'List product modifiers' })
    @Get()
    findAll(@Param('productId') productId: string) {
        return this.modifiersService.findByProduct(productId);
    }

    @ApiOperation({ summary: 'Delete modifier' })
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    remove(@Param('id') id: string) {
        return this.modifiersService.remove(id);
    }
}
