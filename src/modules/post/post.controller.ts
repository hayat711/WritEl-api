import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import {PostService} from './post.service';
import {CreatePostDto} from './dto/create-post.dto';
import {UpdatePostDto} from './dto/update-post.dto';
import {JwtAuthGuard} from "../../common/guards/jwt.auth.guard";
import {CurrentUser} from "../../common/decorators";

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}


  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser('id') userId: string,
      @Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.postService.getPosts();
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string,
          @Req() req: Request,
          @CurrentUser('id') userId: string
          ) {


    return this.postService.getPost(id, userId);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    console.log('this patch route called');
    console.log('the post id -->', id);
    console.log('the post update field -->', updatePostDto);
    if (updatePostDto.views) {
      await this.postService.incrementView(id);
    }

    if (updatePostDto.likes) {
      await this.postService.incrementLikes(id);
    }

    if (updatePostDto.dislikes) {
      await this.postService.incrementDislikes(id);
    }

    return this.postService.updatePost(id, updatePostDto);
  }


  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.removePost(id);
  }

}
