import {Module} from '@nestjs/common';
import {ForumController} from "./forum.controller";
import {ForumService} from "./forum.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Forum} from "./entities/froum.entity";
import {UserModule} from "../user/user.module";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([Forum]), UserModule, AuthModule],
  controllers: [ForumController],
  providers: [ForumService, ],

})
export class ForumModule {}
