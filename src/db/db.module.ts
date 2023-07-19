import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('LOCAL_POSTGRES_HOST'),
        port: configService.get('LOCAL_POSTGRES_PORT'),
        username: configService.get('LOCAL_POSTGRES_USER'),
        // password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('LOCAL_POSTGRES_DB'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}