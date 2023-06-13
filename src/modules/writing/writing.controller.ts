import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {WritingService} from './writing.service';
import {CreateWritingDto} from './dto/create-writing.dto';
import {UpdateWritingDto} from './dto/update-writing.dto';
import {CurrentUser} from "../../common/decorators";
import {JwtAuthGuard} from "../../common/guards/jwt.auth.guard";

@Controller('writing')
export class WritingController {
  constructor(private readonly writingService: WritingService) {}


  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createWritingDto: CreateWritingDto,
         @CurrentUser('id') userId:string,
         ) {
    return this.writingService.createDocument(userId, createWritingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.writingService.getAllDocuments();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string,
          @CurrentUser('id') userId:string
          ) {
    return this.writingService.getDocument(userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string,
         @Body() updateWritingDto: UpdateWritingDto) {
    return this.writingService.updateDocument(id, updateWritingDto);
  }


  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.writingService.removeDocument(id);
  }
}
