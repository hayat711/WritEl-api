import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GrammarService } from './grammar.service';
import { CreateGrammarDto } from './dto/create-grammar.dto';

@Controller('grammar')
export class GrammarController {
  constructor(private readonly grammarService: GrammarService) {}

  @Post()
  create(@Body() createGrammarDto: CreateGrammarDto) {
    return this.grammarService.create(createGrammarDto);
  }

  @Get()
  findAll() {
    return this.grammarService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.grammarService.findOne(id);
  }
}
