import {Module} from '@nestjs/common';
import {DatabaseFileService} from './database-file.service';
import {DatabaseFileController} from './database-file.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import DatabaseFile from "./entity/databaseFile.entity";

@Module({
  controllers: [DatabaseFileController],
  providers: [DatabaseFileService],
  imports: [TypeOrmModule.forFeature([DatabaseFile]), ],
  exports: [DatabaseFileService],
})
export class DatabaseFileModule {}
