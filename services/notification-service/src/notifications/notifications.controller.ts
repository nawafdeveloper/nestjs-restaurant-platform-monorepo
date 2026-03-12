import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './notifications.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
    constructor(private notificationsService: NotificationsService) { }

    @ApiOperation({ summary: 'Send notification' })
    @Post('send')
    send(@Body() dto: SendNotificationDto) {
        return this.notificationsService.send(dto);
    }

    @ApiOperation({ summary: 'List customer notifications' })
    @Get('customer/:customerId')
    @UseGuards(AuthGuard('jwt'))
    findByCustomer(@Param('customerId') customerId: string) {
        return this.notificationsService.findByCustomer(customerId);
    }

    @ApiOperation({ summary: 'List store notifications' })
    @Get('store/:storeId')
    @UseGuards(AuthGuard('jwt'))
    findByStore(@Param('storeId') storeId: string) {
        return this.notificationsService.findByStore(storeId);
    }
}
