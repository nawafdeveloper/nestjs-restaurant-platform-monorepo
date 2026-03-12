import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Branches')
@Controller('stores/:storeId/branches')
export class BranchesController {
    constructor(private branchesService: BranchesService) { }

    @ApiOperation({ summary: 'Create branch' })
    @Post()
    @UseGuards(AuthGuard('jwt'))
    create(@Param('storeId') storeId: string, @Body() dto: CreateBranchDto) {
        return this.branchesService.create(storeId, dto);
    }

    @ApiOperation({ summary: 'List store branches' })
    @Get()
    findAll(@Param('storeId') storeId: string) {
        return this.branchesService.findByStore(storeId);
    }

    @ApiOperation({ summary: 'Get branch by id' })
    @Get(':id')
    findOne(@Param('id') id: string, @Param('storeId') storeId: string) {
        return this.branchesService.findOne(id, storeId);
    }

    @ApiOperation({ summary: 'Update branch' })
    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    update(
        @Param('id') id: string,
        @Param('storeId') storeId: string,
        @Body() dto: UpdateBranchDto,
    ) {
        return this.branchesService.update(id, storeId, dto);
    }

    @ApiOperation({ summary: 'Delete branch' })
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    remove(@Param('id') id: string, @Param('storeId') storeId: string) {
        return this.branchesService.remove(id, storeId);
    }
}
