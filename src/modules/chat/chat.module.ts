import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import {AuthModule} from "../auth/auth.module";
import {RoomModule} from "../room/room.module";
import {MessageModule} from "../message/message.module";
import {ConversationModule} from "../conversation/conversation.module";
import {UserModule} from "../user/user.module";

@Module({
  providers: [ChatGateway, ChatService],
  imports: [AuthModule,UserModule, RoomModule, MessageModule, ConversationModule],
})
export class ChatModule {}
