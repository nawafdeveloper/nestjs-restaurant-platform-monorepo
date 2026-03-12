import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { StoresModule } from './stores/stores.module';
import { BranchesModule } from './branches/branches.module';
import { WorkingHoursModule } from './working-hours/working-hours.module';
import { AppearanceModule } from './appearance/appearance.module';
import { JwtStrategy } from './jwt.strategy';
import { Store } from './stores/store.entity';
import { Branch } from './branches/branch.entity';
import { WorkingHours } from './working-hours/working-hours.entity';
import { StoreAppearance } from './appearance/store-appearance.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [Store, Branch, WorkingHours, StoreAppearance],
        synchronize: config.get<string>('NODE_ENV') !== 'production',
        logging: false,
      }),
    }),
    PassportModule,
    StoresModule,
    BranchesModule,
    WorkingHoursModule,
    AppearanceModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule { }