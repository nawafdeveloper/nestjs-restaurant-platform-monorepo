import { Controller, Get, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomersService } from './customers.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from '@restaurant/shared';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
    constructor(private customersService: CustomersService) { }

    @ApiOperation({ summary: 'List store customers' })
    @Get('store/:storeId')
    @UseGuards(AuthGuard('jwt'))
    getStoreCustomers(@Param('storeId') storeId: string) {
        return this.customersService.getStoreCustomers(storeId);
    }

    @ApiOperation({ summary: 'Get my profile' })
    @Get('me/:storeId')
    @UseGuards(AuthGuard('jwt'))
    getMyProfile(@CurrentUser() user: any, @Param('storeId') storeId: string) {
        return this.customersService.getOrCreateProfile(user.id, storeId);
    }

    @ApiOperation({ summary: 'Get my profile with orders' })
    @Get('me/:storeId/orders')
    @UseGuards(AuthGuard('jwt'))
    getMyProfileWithOrders(
        @CurrentUser() user: any,
        @Param('storeId') storeId: string,
        @Req() req: any,
    ) {
        const token = req.headers.authorization?.split(' ')[1];
        return this.customersService.getCustomerWithOrders(user.id, storeId, token);
    }

    @ApiOperation({ summary: 'Update my profile' })
    @Put('me/:storeId')
    @UseGuards(AuthGuard('jwt'))
    updateMyProfile(
        @CurrentUser() user: any,
        @Param('storeId') storeId: string,
        @Body() dto: UpdateProfileDto,
    ) {
        return this.customersService.updateProfile(user.id, storeId, dto);
    }
}
