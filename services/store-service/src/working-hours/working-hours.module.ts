import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkingHours } from './working-hours.entity';
import { WorkingHoursService } from './working-hours.service';
import { WorkingHoursController } from './working-hours.controller';

@Module({
    imports: [TypeOrmModule.forFeature([WorkingHours])],
    controllers: [WorkingHoursController],
    providers: [WorkingHoursService],
    exports: [WorkingHoursService],
})
export class WorkingHoursModule { }