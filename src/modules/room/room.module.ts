import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Room} from "./entities/room.entity";
import {Invitation} from "./entities/invitation.entity";
import {ConversationModule} from "../conversation/conversation.module";
import {MessageModule} from "../message/message.module";
import {UserModule} from "../user/user.module";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([Room, Invitation]), UserModule, AuthModule],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService]
})
export class RoomModule {}
