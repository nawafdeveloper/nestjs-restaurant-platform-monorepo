import { Controller, All, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ProxyService } from './proxy.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { MerchantGuard } from '../guards/merchant.guard';
import { CustomerGuard } from '../guards/customer.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Proxy')
@Controller()
export class ProxyController {
    constructor(private proxyService: ProxyService) { }

    // ── موجهات عامه لا تحتاج مصادقة ────────────────────────────────
    @ApiOperation({ summary: 'Proxy auth routes' })
    @All('api/v1/auth/*path')
    authRoutes(@Req() req: Request) {
        return this.proxyService.forward('identity', req);
    }

    @ApiOperation({ summary: 'Proxy public store routes by slug' })
    @All('api/v1/stores/slug/*path')
    publicStoreBySlug(@Req() req: Request) {
        return this.proxyService.forward('store', req);
    }

    @ApiOperation({ summary: 'Proxy public variant routes (wildcard)' })
    @All('api/v1/products/:productId/variants/*path')
    publicVariantRoutes(@Req() req: Request) {
        return this.proxyService.forward('catalog', req);
    }

    @ApiOperation({ summary: 'Proxy public variant routes (base)' })
    @All('api/v1/products/:productId/variants')
    publicVariantRoutesBase(@Req() req: Request) {
        return this.proxyService.forward('catalog', req);
    }

    @ApiOperation({ summary: 'Proxy public modifier routes (wildcard)' })
    @All('api/v1/products/:productId/modifiers/*path')
    publicModifierRoutes(@Req() req: Request) {
        return this.proxyService.forward('catalog', req);
    }

    @ApiOperation({ summary: 'Proxy public modifier routes (base)' })
    @All('api/v1/products/:productId/modifiers')
    publicModifierRoutesBase(@Req() req: Request) {
        return this.proxyService.forward('catalog', req);
    }

    @ApiOperation({ summary: 'Proxy customer promo code validation' })
    @All('api/v1/stores/:storeId/promo-codes/validate')
    customerValidatePromo(@Req() req: Request) {
        return this.proxyService.forward('promotion', req);
    }

    // ── موجهات التاجر تحتاج مصادقة التاجر ──────────────────────────────
    @ApiOperation({ summary: 'Proxy merchant category routes (wildcard)' })
    @All('api/v1/stores/:storeId/categories/*path')
    @UseGuards(JwtAuthGuard, MerchantGuard)
    merchantCategoryRoutes(@Req() req: Request) {
        return this.proxyService.forward('catalog', req);
    }

    @ApiOperation({ summary: 'Proxy merchant category routes (base)' })
    @All('api/v1/stores/:storeId/categories')
    @UseGuards(JwtAuthGuard, MerchantGuard)
    merchantCategoryRoutesBase(@Req() req: Request) {
        return this.proxyService.forward('catalog', req);
    }

    @ApiOperation({ summary: 'Proxy merchant product routes (wildcard)' })
    @All('api/v1/stores/:storeId/products/*path')
    @UseGuards(JwtAuthGuard, MerchantGuard)
    merchantProductRoutes(@Req() req: Request) {
        return this.proxyService.forward('catalog', req);
    }

    @ApiOperation({ summary: 'Proxy merchant product routes (base)' })
    @All('api/v1/stores/:storeId/products')
    @UseGuards(JwtAuthGuard, MerchantGuard)
    merchantProductRoutesBase(@Req() req: Request) {
        return this.proxyService.forward('catalog', req);
    }

    @ApiOperation({ summary: 'Proxy merchant promotion routes (wildcard)' })
    @All('api/v1/stores/:storeId/promotions/*path')
    @UseGuards(JwtAuthGuard, MerchantGuard)
    merchantPromotionRoutes(@Req() req: Request) {
        return this.proxyService.forward('promotion', req);
    }

    @ApiOperation({ summary: 'Proxy merchant promotion routes (base)' })
    @All('api/v1/stores/:storeId/promotions')
    @UseGuards(JwtAuthGuard, MerchantGuard)
    merchantPromotionRoutesBase(@Req() req: Request) {
        return this.proxyService.forward('promotion', req);
    }

    @ApiOperation({ summary: 'Proxy merchant promo code routes (wildcard)' })
    @All('api/v1/stores/:storeId/promo-codes/*path')
    @UseGuards(JwtAuthGuard, MerchantGuard)
    merchantPromoCodeRoutes(@Req() req: Request) {
        return this.proxyService.forward('promotion', req);
    }

    @ApiOperation({ summary: 'Proxy merchant promo code routes (base)' })
    @All('api/v1/stores/:storeId/promo-codes')
    @UseGuards(JwtAuthGuard, MerchantGuard)
    merchantPromoCodeRoutesBase(@Req() req: Request) {
        return this.proxyService.forward('promotion', req);
    }

    @ApiOperation({ summary: 'Proxy merchant store appearance routes (wildcard)' })
    @All('api/v1/stores/:storeId/appearance/*path')
    @UseGuards(JwtAuthGuard, MerchantGuard)
    merchantAppearanceRoutes(@Req() req: Request) {
        return this.proxyService.forward('store', req);
    }

    @ApiOperation({ summary: 'Proxy merchant store appearance routes (base)' })
    @All('api/v1/stores/:storeId/appearance')
    @UseGuards(JwtAuthGuard, MerchantGuard)
    merchantAppearanceRoutesBase(@Req() req: Request) {
        return this.proxyService.forward('store', req);
    }

    @ApiOperation({ summary: 'Proxy merchant store by id' })
    @All('api/v1/stores/:id')
    @UseGuards(JwtAuthGuard, MerchantGuard)
    merchantStoreById(@Req() req: Request) {
        return this.proxyService.forward('store', req);
    }

    @ApiOperation({ summary: 'Proxy merchant stores base' })
    @All('api/v1/stores')
    @UseGuards(JwtAuthGuard, MerchantGuard)
    merchantStoresBase(@Req() req: Request) {
        return this.proxyService.forward('store', req);
    }

    @ApiOperation({ summary: 'Proxy merchant working hours routes (wildcard)' })
    @All('api/v1/branches/:branchId/working-hours/*path')
    @UseGuards(JwtAuthGuard, MerchantGuard)
    merchantWorkingHoursRoutes(@Req() req: Request) {
        return this.proxyService.forward('store', req);
    }

    @ApiOperation({ summary: 'Proxy merchant working hours routes (base)' })
    @All('api/v1/branches/:branchId/working-hours')
    @UseGuards(JwtAuthGuard, MerchantGuard)
    merchantWorkingHoursBase(@Req() req: Request) {
        return this.proxyService.forward('store', req);
    }

    @ApiOperation({ summary: 'Proxy merchant branch by id' })
    @All('api/v1/branches/:id')
    @UseGuards(JwtAuthGuard, MerchantGuard)
    merchantBranchById(@Req() req: Request) {
        return this.proxyService.forward('store', req);
    }

    @ApiOperation({ summary: 'Proxy merchant order routes' })
    @All('api/v1/orders/store/:storeId')
    @UseGuards(JwtAuthGuard, MerchantGuard)
    merchantOrderRoutes(@Req() req: Request) {
        return this.proxyService.forward('order', req);
    }

    @ApiOperation({ summary: 'Proxy merchant customer routes' })
    @All('api/v1/customers/store/:storeId')
    @UseGuards(JwtAuthGuard, MerchantGuard)
    merchantCustomerRoutes(@Req() req: Request) {
        return this.proxyService.forward('customer', req);
    }

    // ── موجهات العميل تحتاج مصادقة العميل ──────────────────────────────
    @ApiOperation({ summary: 'Proxy order status route' })
    @All('api/v1/orders/:id/status')
    @UseGuards(JwtAuthGuard)
    orderStatusRoute(@Req() req: Request) {
        return this.proxyService.forward('order', req);
    }

    @ApiOperation({ summary: 'Proxy customer order by id' })
    @All('api/v1/orders/:id')
    @UseGuards(JwtAuthGuard, CustomerGuard)
    customerOrderById(@Req() req: Request) {
        return this.proxyService.forward('order', req);
    }

    @ApiOperation({ summary: 'Proxy customer orders base' })
    @All('api/v1/orders')
    @UseGuards(JwtAuthGuard, CustomerGuard)
    customerOrdersBase(@Req() req: Request) {
        return this.proxyService.forward('order', req);
    }

    @ApiOperation({ summary: 'Proxy customer address routes (wildcard)' })
    @All('api/v1/customers/me/:storeId/addresses/*path')
    @UseGuards(JwtAuthGuard, CustomerGuard)
    customerAddressRoutes(@Req() req: Request) {
        return this.proxyService.forward('customer', req);
    }

    @ApiOperation({ summary: 'Proxy customer address routes (base)' })
    @All('api/v1/customers/me/:storeId/addresses')
    @UseGuards(JwtAuthGuard, CustomerGuard)
    customerAddressBase(@Req() req: Request) {
        return this.proxyService.forward('customer', req);
    }

    @ApiOperation({ summary: 'Proxy customer orders with profile' })
    @All('api/v1/customers/me/:storeId/orders')
    @UseGuards(JwtAuthGuard, CustomerGuard)
    customerOrdersWithProfile(@Req() req: Request) {
        return this.proxyService.forward('customer', req);
    }

    @ApiOperation({ summary: 'Proxy customer profile' })
    @All('api/v1/customers/me/:storeId')
    @UseGuards(JwtAuthGuard, CustomerGuard)
    customerProfile(@Req() req: Request) {
        return this.proxyService.forward('customer', req);
    }
}
