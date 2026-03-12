import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CurrentUser } from '@restaurant/shared';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Addresses')
@Controller('customers/me/:storeId/addresses')
export class AddressesController {
    constructor(private addressesService: AddressesService) { }

    @ApiOperation({ summary: 'Create address' })
    @Post()
    @UseGuards(AuthGuard('jwt'))
    create(
        @CurrentUser() user: any,
        @Param('storeId') storeId: string,
        @Body() dto: CreateAddressDto,
    ) {
        return this.addressesService.create(user.id, storeId, dto);
    }

    @ApiOperation({ summary: 'List my addresses' })
    @Get()
    @UseGuards(AuthGuard('jwt'))
    findAll(@CurrentUser() user: any, @Param('storeId') storeId: string) {
        return this.addressesService.findByCustomer(user.id, storeId);
    }

    @ApiOperation({ summary: 'Update address' })
    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    update(
        @Param('id') id: string,
        @CurrentUser() user: any,
        @Param('storeId') storeId: string,
        @Body() dto: UpdateAddressDto,
    ) {
        return this.addressesService.update(id, user.id, storeId, dto);
    }

    @ApiOperation({ summary: 'Set default address' })
    @Put(':id/default')
    @UseGuards(AuthGuard('jwt'))
    setDefault(
        @Param('id') id: string,
        @CurrentUser() user: any,
        @Param('storeId') storeId: string,
    ) {
        return this.addressesService.setDefault(id, user.id, storeId);
    }

    @ApiOperation({ summary: 'Delete address' })
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    remove(@Param('id') id: string, @CurrentUser() user: any) {
        return this.addressesService.remove(id, user.id);
    }
}
