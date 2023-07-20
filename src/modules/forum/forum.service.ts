import { Injectable } from '@nestjs/common';
import { CreateForumDto } from './dto/create-froum.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Forum } from './entities/froum.entity';
import { Repository } from 'typeorm';
import { UpdateForumDto } from './dto/update-froum.dto';
import { ForumCategory } from '../../common/enums/forum.category.enum';

@Injectable()
export class ForumService {
  constructor(
    @InjectRepository(Forum)
    private readonly forumRepository: Repository<Forum>,
  ) {}

  public async createForum(userId: string, createForumDto: CreateForumDto) {
    try {
      const forum = await this.forumRepository.create({
        category: ForumCategory.General,
        title: createForumDto.title,
        description: createForumDto.description,
        owner: { id: userId },
      });

      const savedForum = await this.forumRepository.save(forum);
      console.log('new forum created ', savedForum);
      return savedForum;
    } catch (e) {
      console.log('error creating forum ', e);
    }
  }

  public async getForums() {
    try {
      const forums =  await this.forumRepository.find({
        order: { createdAt: 'DESC' },
        relations: ['posts', 'owner'],
      });
      console.log('forums', forums);
      return forums;
    } catch (e) {
      console.log(e);
    }
  }

  public async getForum(id: string) {
    try {
      return await this.forumRepository.findOne({
        where: { id },
      });
    } catch (e) {
      console.log(e);
    }
  }

  public async update(id: string, updateForumDto: UpdateForumDto) {
    try {
      const forum = await this.forumRepository.findOne({ where: { id } });
      if (!forum) {
        throw new Error('can not find forum ');
      }
      const updatedForum = await this.forumRepository.update(
        id,
        updateForumDto,
      );
      if (updatedForum.affected === 0) {
        throw new Error('Failed to update the forum');
      }
      const updatedForumEntity = await this.forumRepository.findOne({
        where: { id },
      });
      return updatedForumEntity;
    } catch (e) {
      console.log(e);
    }
  }
  public async subscribeToForum(forumId: string, userId: string) {
    try {
      const forum = await this.forumRepository.findOne({
        where: { id: forumId },
      });
      if (!forum) {
        throw new Error('can not find forum ');
      }
      forum.subscribers = forum.subscribers ?? [];
      if (forum.subscribers.includes(userId)) {
        throw new Error('user already subscribed to the forum');
      }
      forum.subscribers.push(userId);
      const updatedForum = await this.forumRepository.save(forum);
      console.log('new forum updated', updatedForum);

      return updatedForum;
    } catch (e) {
      console.log(e);
    }
  }

  public async unsubscribeToForum(forumId: string, userId: string) {
    try {
      const forum = await this.forumRepository.findOne({
        where: { id: forumId },
      });
      if (!forum) {
        throw new Error('can not find forum ');
      }
      if (!forum.subscribers.includes(userId)) {
        throw new Error('user is not subscribed to the forum');
      }
      forum.subscribers = forum.subscribers.filter(
        (subscriber) => subscriber !== userId,
      );
      const updatedForum = await this.forumRepository.save(forum);
      console.log('new forum updated', updatedForum);

      return updatedForum;
    } catch (e) {
      console.log(e);
    }
  }

  public async removeForum(id: string) {
    try {
      const removedForum = await this.forumRepository.delete(id);
      return removedForum;
    } catch (e) {
      console.log(e);
    }
  }
}
