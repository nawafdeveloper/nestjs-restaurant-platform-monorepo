import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModifier } from './modifier.entity';
import { ModifiersService } from './modifiers.service';
import { ModifiersController } from './modifiers.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ProductModifier])],
    controllers: [ModifiersController],
    providers: [ModifiersService],
    exports: [ModifiersService],
})
export class ModifiersModule { }