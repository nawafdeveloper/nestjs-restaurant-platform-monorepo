import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CurrentUser } from '@restaurant/shared';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
    constructor(private ordersService: OrdersService) { }

    @ApiOperation({ summary: 'Create order' })
    @Post()
    @UseGuards(AuthGuard('jwt'))
    create(@CurrentUser() user: any, @Body() dto: CreateOrderDto) {
        return this.ordersService.create(user.id, dto);
    }

    @ApiOperation({ summary: 'List store orders' })
    @Get('store/:storeId')
    @UseGuards(AuthGuard('jwt'))
    findByStore(@Param('storeId') storeId: string) {
        return this.ordersService.findByStore(storeId);
    }

    @ApiOperation({ summary: 'List my orders' })
    @Get('my/:storeId')
    @UseGuards(AuthGuard('jwt'))
    findMyOrders(@CurrentUser() user: any, @Param('storeId') storeId: string) {
        return this.ordersService.findByCustomer(user.id, storeId);
    }

    @ApiOperation({ summary: 'Get order by id' })
    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    findOne(@Param('id') id: string) {
        return this.ordersService.findOneWithItems(id);
    }

    @ApiOperation({ summary: 'Update order status' })
    @Put(':id/status')
    @UseGuards(AuthGuard('jwt'))
    updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
        return this.ordersService.updateStatus(id, dto);
    }
}
