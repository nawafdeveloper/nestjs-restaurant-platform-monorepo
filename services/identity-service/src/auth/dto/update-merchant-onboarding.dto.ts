import { IsBoolean } from 'class-validator';

export class UpdateMerchantOnboardingDto {
    @IsBoolean()
    isOnboarded: boolean;
}