import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe} from '@nestjs/common';
import { MessageService } from './message.service';
import {JwtAuthGuard} from "../../common/guards/jwt.auth.guard";
import {VerifiedGuard} from "../../common/guards/verified.guard";
import {MembershipGuard} from "../room/guards/Membership.guard";
import {CurrentUser} from "../../common/decorators";
import {User} from "../user/entities/user.entity";

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(JwtAuthGuard, VerifiedGuard, MembershipGuard)
  @Post(':roomId')
  create(
      @CurrentUser() user: User,
      @Param('roomId', new ParseUUIDPipe()) roomId: string,
      @Body('text') text: string,
      @Body('type') type: 'room' | 'conversation'
  ) {
    return this.messageService.create(user, type, roomId, text);
  }


  @UseGuards(JwtAuthGuard, VerifiedGuard, MembershipGuard)
  @Get(':roomId')
  async findMessageForRoom(@Param('roomId') roomId: string) {
    return this.messageService.findMessagesForRoom(roomId);
  }

  @UseGuards(JwtAuthGuard, VerifiedGuard)
  @Get('')
  async getUserMessages(
      @CurrentUser() user: User
  ) {
    return this.messageService.getUserMessages(user);
  }

}
