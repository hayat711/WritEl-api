import {Controller, Get, Param, Res, StreamableFile} from '@nestjs/common';
import {DatabaseFileService} from './database-file.service';
import {Readable} from "stream";
import {Response} from "express";

@Controller('database-file')
export class DatabaseFileController {
  constructor(private readonly databaseFileService: DatabaseFileService) {

  }

  @Get(':id')
  async getDatabaseFileById(@Res({
    passthrough: true
  }) response: Response, @Param('id') id: string ) {
    const file = await this.databaseFileService.getFileById(id);
    const stream = Readable.from(file.data);

    response.set({
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Content-Type' : 'image'
    })
    return new StreamableFile(stream);
  }
}
