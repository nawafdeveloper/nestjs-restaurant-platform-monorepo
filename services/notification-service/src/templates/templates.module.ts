import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationTemplate } from './notification-template.entity';
import { TemplatesService } from './templates.service';

@Module({
    imports: [TypeOrmModule.forFeature([NotificationTemplate])],
    providers: [TemplatesService],
    exports: [TemplatesService],
})
export class TemplatesModule implements OnModuleInit {
    constructor(private templatesService: TemplatesService) { }

    async onModuleInit() {
        await this.templatesService.seedDefaultTemplates();
    }
}