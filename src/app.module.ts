import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './db/db.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatModule } from './modules/chat/chat.module';
import { MessageModule } from './modules/message/message.module';
import { RoomModule } from './modules/room/room.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import {
  WsEmitterClientOptions,
  WsEmitterModule,
} from './modules/chat/ws-emitter.module';
import { WritingModule } from './modules/writing/writing.module';
import { GrammarModule } from './modules/grammar/grammar.module';
import { HistoryModule } from './modules/history/history.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PostModule } from './modules/post/post.module';
import { ForumModule } from './modules/forum/forum.module';
import { AiModule } from './modules/ai/ai.module';
import { DatabaseFileModule } from './modules/database-file/database-file.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MainController } from './app.controller';

@Module({
  imports: [
    UserModule,
    AuthModule,
    DatabaseModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    ChatModule,
    MessageModule,
    RoomModule,
    ConversationModule,
    WritingModule,
    GrammarModule,
    HistoryModule,
    NotificationModule,
    ForumModule,
    PostModule,
    AiModule,
    DatabaseFileModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    // RedisModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService): Promise<RedisModuleOptions> => {
    //     return {
    //       config: {
    //         host: configService.get('REDIS_HOST'),
    //         port: configService.get('REDIS_PORT'),
    //         password: configService.get('REDIS_PASSWORD'),
    //       }
    //     }
    //   }
    // }),
    // WsEmitterModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) : Promise<WsEmitterClientOptions> => {
    //     return {
    //       config: {
    //         host: configService.get('REDIS_HOST'),
    //         port: configService.get('REDIS_PORT'),
    //         password: configService.get<string>('REDIS_PASSWORD')
    //       }
    //     }
    //   }
    // }),
  ],
  controllers: [MainController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
