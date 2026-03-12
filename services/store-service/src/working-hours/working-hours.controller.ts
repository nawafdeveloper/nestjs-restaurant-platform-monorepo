import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WorkingHoursService } from './working-hours.service';
import { SetWorkingHoursDto } from './dto/set-working-hours.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Working Hours')
@Controller('branches/:branchId/working-hours')
export class WorkingHoursController {
    constructor(private workingHoursService: WorkingHoursService) { }

    @ApiOperation({ summary: 'Set working hours' })
    @Post()
    @UseGuards(AuthGuard('jwt'))
    set(@Param('branchId') branchId: string, @Body() dto: SetWorkingHoursDto) {
        return this.workingHoursService.set(branchId, dto);
    }

    @ApiOperation({ summary: 'List working hours' })
    @Get()
    findAll(@Param('branchId') branchId: string) {
        return this.workingHoursService.findByBranch(branchId);
    }
}
