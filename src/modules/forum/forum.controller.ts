import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ForumService } from './forum.service';
import { CreateForumDto } from './dto/create-froum.dto';
import { CurrentUser } from '../../common/decorators';
import { JwtAuthGuard } from '../../common/guards/jwt.auth.guard';
import { UpdateForumDto } from './dto/update-froum.dto';
import { Request } from 'express';

@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createForum(
    @Body() createForumDto: CreateForumDto,
    @CurrentUser('id') userId: string,
    @Req() req: Request,
  ) {
    return this.forumService.createForum(userId, createForumDto);
  }

  @Get()
  findAll() {
    return this.forumService.getForums();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.forumService.getForum(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateForumDto: UpdateForumDto) {
    return this.forumService.update(id, updateForumDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.forumService.removeForum(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/subscribe')
  subscribe(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.forumService.subscribeToForum(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/unsubscribe')
  unsubscribe(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.forumService.unsubscribeToForum(id, userId);
  }
}
