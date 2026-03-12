import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreAppearance } from './store-appearance.entity';
import { AppearanceService } from './appearance.service';
import { AppearanceController } from './appearance.controller';

@Module({
    imports: [TypeOrmModule.forFeature([StoreAppearance])],
    controllers: [AppearanceController],
    providers: [AppearanceService],
    exports: [AppearanceService],
})
export class AppearanceModule { }