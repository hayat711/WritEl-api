import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import {JwtAuthGuard} from "../../common/guards/jwt.auth.guard";
import {VerifiedGuard} from "../../common/guards/verified.guard";
import {CurrentUser} from "../../common/decorators";
import {User} from "../user/entities/user.entity";

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() data: any,
         @CurrentUser() user: User) {
    return this.conversationService.createConversation(data, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.conversationService.getConversations();
  }

  @UseGuards(JwtAuthGuard, VerifiedGuard)
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.conversationService.getConversation(id);
  }

  @UseGuards(JwtAuthGuard, VerifiedGuard)
  @Get('/my/conversations')
  async getUserConversations(
      @CurrentUser('id', new ParseUUIDPipe()) userId: string,

  ) {
    return this.conversationService.getUserConversations(userId);
  }

  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateConversationDto: UpdateConversationDto) {
  //   return this.conversationService.update(+id, updateConversationDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.conversationService.remove(+id);
  // }
}
