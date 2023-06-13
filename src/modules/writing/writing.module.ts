import {Module} from '@nestjs/common';
import {WritingService} from './writing.service';
import {WritingController} from './writing.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Writing} from "./entities/writing.entity";
import {AuthModule} from "../auth/auth.module";

@Module({
  controllers: [WritingController],
  providers: [WritingService],
  imports: [TypeOrmModule.forFeature([Writing]), AuthModule]
})
export class WritingModule {}
