import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.auth.guard';
import { CurrentUser } from '../../common/decorators';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.createPost(createPostDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.postService.getPosts();
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: Request,
    @CurrentUser('id') userId: string,
  ) {
    return this.postService.getPost(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser('id') userId: string,
  ) {
    console.log('this patch route called');
    console.log('the post id -->', id);
    console.log('the post update field -->', updatePostDto);

    return this.postService.updatePost(id, updatePostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/like')
  async like(@Param('id') id: string, @CurrentUser('id') userId: string) {
    console.log('this patch route called');

    return this.postService.incrementLikes(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/dislike')
  async dislike(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.postService.incrementDislikes(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/view')
  async view(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.postService.incrementView(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.removePost(id);
  }
}
