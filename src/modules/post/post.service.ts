import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { ForumCategory } from '../../common/enums/forum.category.enum';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  public async createPost(createPostDto: CreatePostDto, userId: string) {
    try {
      const newPost = await this.postRepository.create({
        category: ForumCategory.General,
        content: createPostDto.content,
        title: createPostDto.title,
        description: createPostDto.description,
        author: { id: userId },
      });
      await this.postRepository.save(newPost);
      return newPost;
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }

  public async getPosts() {
    return await this.postRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  public async getPost(postId: string, userId: string) {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
        author: { id: userId },
      },
    });
    console.log('this post ', postId);
    console.log('is here', post);
    return post;
  }

  public async updatePost(postId: string, updatePostDto: UpdatePostDto) {
    try {
      const post = await this.postRepository.findOne({
        where: {
          id: postId,
        },
      });
      if (!post) {
        throw new Error('Post not found');
      }

      const updatedPost = { ...post, ...updatePostDto };

      const updatedPostEntity = await this.postRepository.save(updatedPost);
      console.log('And here the updated post', updatedPostEntity);
      return updatedPostEntity;
    } catch (e) {
      console.log(e);
      throw new Error('error updating post');
    }
  }

  async incrementView(id: string, userId: string) {
    try {
      await this.postRepository.update(id, { views: () => 'views + 1' });
    } catch (e) {
      console.log(e.message);
      throw new NotFoundException();
    }
  }

  async incrementLikes(id: string, userId: string) {
    console.log('add like increment is called');
    console.log('user id', userId);

    const post = await this.postRepository.findOne({
      where: {
        id,
      },
    });

    if (!post) {
      throw new NotFoundException('post not found');
    }

    // Check if the user already liked the post
    if (post.likedUsers?.includes(userId)) {
        console.log('the user already liked the post');
      // If the user already liked the post, remove the like
      await this.postRepository
        .createQueryBuilder()
        .update(Post)
        .set({
          likes: () => 'likes - 1',
          likedUsers: () => `array_remove(liked_users, '${userId}')`,
        })
        .where('id = :id', { id })
        .execute();

      console.log('removed like');
    } else {
      // If the user didn't like the post, add the like
      console.log('the user not liked the post before');
      await this.postRepository
        .createQueryBuilder()
        .update(Post)
        .set({
          likes: () => 'likes + 1',
          likedUsers: () => `array_append(liked_users, '${userId}')`,
        })
        .where('id = :id', { id })
        .execute();

      console.log('added like');
    }
  }

  async incrementDislikes(id: string, userId: string) {
    try {
      await this.postRepository
        .createQueryBuilder()
        .update(Post)
        .set({
          likes: () => 'dislikes + 1',
          dislikedUsers: () => `array_append(disliked_users, '${userId}')`,
        })
        .where('id = :id', { id })
        .execute();
      console.log('success 🚀');
    } catch (e) {
      console.log(e.message);
      throw new NotFoundException();
    }
  }

  public async removePost(id: string) {
    return await this.postRepository.delete(id);
  }
}
