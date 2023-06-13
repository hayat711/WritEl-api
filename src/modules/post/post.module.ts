import {Module} from '@nestjs/common';
import {PostService} from './post.service';
import {PostController} from './post.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Post} from "./entities/post.entity";
import {AuthModule} from "../auth/auth.module";

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [TypeOrmModule.forFeature([Post]), AuthModule]
})
export class PostModule {}
