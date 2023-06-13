import {Module} from '@nestjs/common';
import {HistoryService} from './history.service';
import {HistoryController} from './history.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {History} from "./entities/history.entity";
import {AuthModule} from "../auth/auth.module";

@Module({
  controllers: [HistoryController],
  providers: [HistoryService],
  imports: [TypeOrmModule.forFeature([History]), AuthModule]
})
export class HistoryModule {}
