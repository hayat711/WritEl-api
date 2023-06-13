import {Module} from '@nestjs/common';
import {GrammarService} from './grammar.service';
import {GrammarController} from './grammar.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Grammar} from "./entities/grammar.entity";
import {AuthModule} from "../auth/auth.module";

@Module({
  controllers: [GrammarController],
  providers: [GrammarService],
  imports: [TypeOrmModule.forFeature([Grammar]), AuthModule]
})
export class GrammarModule {}
