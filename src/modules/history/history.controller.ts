import {Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards} from '@nestjs/common';
import { HistoryService } from './history.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import {Request} from "express";
import {CurrentUser} from "../../common/decorators";
import {JwtAuthGuard} from "../../common/guards/jwt.auth.guard";

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}


  @UseGuards(JwtAuthGuard)
  @Post('save')
  async create(@Body() createHistoryDto: CreateHistoryDto,
               @CurrentUser('id') userId: string) {
    console.log('curr user', userId);
    return this.historyService.createHistory(userId, createHistoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req: Request) {
    return this.historyService.getAllHistories();
  }


  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historyService.getHistory(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string,
         @Body() updateHistoryDto: UpdateHistoryDto) {
    return this.historyService.update(id, updateHistoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historyService.remove(id);
  }
}
