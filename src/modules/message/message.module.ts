import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Message} from "./entities/message.entity";
import {RoomModule} from "../room/room.module";
import {ConversationModule} from "../conversation/conversation.module";
import {AuthModule} from "../auth/auth.module";
import {UserModule} from "../user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Message]),
    RoomModule, ConversationModule, AuthModule, UserModule],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
