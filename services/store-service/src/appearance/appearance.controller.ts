import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppearanceService } from './appearance.service';
import { UpdateAppearanceDto } from './dto/update-appearance.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Appearance')
@Controller('stores/:storeId/appearance')
export class AppearanceController {
    constructor(private appearanceService: AppearanceService) { }

    @ApiOperation({ summary: 'Update store appearance' })
    @Put()
    @UseGuards(AuthGuard('jwt'))
    update(@Param('storeId') storeId: string, @Body() dto: UpdateAppearanceDto) {
        return this.appearanceService.update(storeId, dto);
    }

    @ApiOperation({ summary: 'Get store appearance' })
    @Get()
    findOne(@Param('storeId') storeId: string) {
        return this.appearanceService.findByStore(storeId);
    }
}
