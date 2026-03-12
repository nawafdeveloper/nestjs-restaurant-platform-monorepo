import { Injectable, BadGatewayException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class ProxyService {
    private readonly logger = new Logger(ProxyService.name);

    private readonly services: Record<string, string>;

    constructor(
        private httpService: HttpService,
        private config: ConfigService,
    ) {
        this.services = {
            identity: this.config.get('IDENTITY_SERVICE_URL', 'http://localhost:3001'),
            store: this.config.get('STORE_SERVICE_URL', 'http://localhost:3002'),
            catalog: this.config.get('CATALOG_SERVICE_URL', 'http://localhost:3003'),
            promotion: this.config.get('PROMOTION_SERVICE_URL', 'http://localhost:3004'),
            order: this.config.get('ORDER_SERVICE_URL', 'http://localhost:3005'),
            customer: this.config.get('CUSTOMER_SERVICE_URL', 'http://localhost:3006'),
            notification: this.config.get('NOTIFICATION_SERVICE_URL', 'http://localhost:3007'),
        };
    }

    async forward(serviceName: string, req: Request): Promise<any> {
        const baseUrl = this.services[serviceName];
        if (!baseUrl) throw new BadGatewayException(`Service ${serviceName} not found`);

        const url = `${baseUrl}${req.url}`;
        const method = req.method.toLowerCase();

        this.logger.log(`Forwarding ${req.method} ${req.url} → ${url}`);

        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            if (req.headers.authorization) {
                headers['Authorization'] = req.headers.authorization as string;
            }

            if (req.headers['x-store-id']) {
                headers['x-store-id'] = req.headers['x-store-id'] as string;
            }

            const response = await firstValueFrom(
                this.httpService.request({
                    method,
                    url,
                    headers,
                    data: ['post', 'put', 'patch'].includes(method) ? req.body : undefined,
                    params: req.query,
                }),
            );

            return response.data;
        } catch (error) {
            const status = error.response?.status || 502;
            const message = error.response?.data || 'Service unavailable';
            this.logger.error(`Proxy error: ${status} | ${JSON.stringify(message)}`);
            throw new BadGatewayException(message);
        }
    }
}