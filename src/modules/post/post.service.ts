import {Injectable, NotFoundException} from '@nestjs/common';
import {CreatePostDto} from './dto/create-post.dto';
import {UpdatePostDto} from './dto/update-post.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Post} from "./entities/post.entity";
import {Repository} from "typeorm";
import {ForumCategory} from "../../common/enums/forum.category.enum";

@Injectable()
export class PostService {
  constructor(@InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {
  }

  public async createPost(createPostDto: CreatePostDto, userId: string) {
    try {
      const newPost = await this.postRepository.create({
        category: ForumCategory.General,
        content: createPostDto.content,
        title: createPostDto.title,
        description: createPostDto.description,
        author: { id: userId},
      });
      await this.postRepository.save(newPost);
      return newPost;
    } catch (e) {
        console.log(e);
        throw new Error(e);
    }
  }

  public async getPosts() {
    return await this.postRepository.find();
  }

  public async getPost(postId: string) {
    return await this.postRepository.findOne({
      where: {
        id: postId
      }
    });
  }

  public async updatePost(postId: string, updatePostDto: UpdatePostDto) {
    try {
      const post = await this.postRepository.findOne({
        where: {
          id: postId
        }
      });
      if (!post) {
          throw new Error('Post not found')
      }

      const updatedPost = await this.postRepository.update(postId, updatePostDto);

    //   check if the post was successfully updated
      if(updatedPost.affected === 0) {
        throw new Error('Failed to update the post')
      }
    //   fetch the updated post
      const updatedPostEntity = await this.postRepository.findOne({
        where: { id: postId}
      });

      return updatedPostEntity;
    } catch (e) {
      console.log(e);
      throw new Error('error updating post')
    }
  }

  async incrementView(id: string) {
    try {
      await this.postRepository.update(id, { views: () => 'views + 1' });
    } catch (e) {
      console.log(e.message);
      throw new NotFoundException();
    }
  }

  async incrementLikes(id: string) {
    try {
      await this.postRepository.update(id, { likes: () => 'likes + 1' });
    } catch (e) {
      console.log(e.message);
      throw new NotFoundException();
    }
  }

  async incrementDislikes(id: string) {
    try {
      await this.postRepository.update(id, { dislikes: () => 'dislikes + 1' });
    } catch (e) {
      console.log(e.message);
      throw new NotFoundException();
    }
  }


  public async removePost(id: string) {
    return await this.postRepository.delete(id);
  }
}
