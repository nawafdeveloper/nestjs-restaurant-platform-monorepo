import { IsString, IsBoolean, IsEnum, IsOptional, Matches } from 'class-validator';
import { DayOfWeek } from '../working-hours.entity';

export class SetWorkingHoursDto {
    @IsEnum(DayOfWeek)
    day: DayOfWeek;

    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'openTime must be HH:MM format' })
    openTime: string;

    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'closeTime must be HH:MM format' })
    closeTime: string;

    @IsBoolean()
    @IsOptional()
    isOpen?: boolean;
}