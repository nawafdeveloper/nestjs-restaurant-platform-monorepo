import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PromoCodesService } from './promo-codes.service';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import { ValidatePromoCodeDto } from './dto/validate-promo-code.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Promo Codes')
@Controller('stores/:storeId/promo-codes')
export class PromoCodesController {
    constructor(private promoCodesService: PromoCodesService) { }

    @ApiOperation({ summary: 'Create promo code' })
    @Post()
    @UseGuards(AuthGuard('jwt'))
    create(@Param('storeId') storeId: string, @Body() dto: CreatePromoCodeDto) {
        return this.promoCodesService.create(storeId, dto);
    }

    @ApiOperation({ summary: 'List store promo codes' })
    @Get()
    @UseGuards(AuthGuard('jwt'))
    findAll(@Param('storeId') storeId: string) {
        return this.promoCodesService.findByStore(storeId);
    }

    @ApiOperation({ summary: 'Validate promo code' })
    @Post('validate')
    validate(@Body() dto: ValidatePromoCodeDto) {
        return this.promoCodesService.validate(dto);
    }

    @ApiOperation({ summary: 'Delete promo code' })
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    remove(@Param('id') id: string, @Param('storeId') storeId: string) {
        return this.promoCodesService.remove(id, storeId);
    }
}
