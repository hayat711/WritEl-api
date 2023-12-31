import {Injectable} from '@nestjs/common';
import {CreateForumDto} from "./dto/create-froum.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Forum} from "./entities/froum.entity";
import {Repository} from "typeorm";
import {UserService} from "../user/user.service";
import {UpdateForumDto} from "./dto/update-froum.dto";
import {ForumCategory} from "../../common/enums/forum.category.enum";

@Injectable()
export class ForumService {
    constructor(
        @InjectRepository(Forum) private readonly forumRepository: Repository<Forum>,
        private readonly userService: UserService
    ) {}

  public async createForum(userId: string, createForumDto: CreateForumDto) {
    try {
        const user = await this.userService.getUserByField('id', userId);
        const forum = await this.forumRepository.create({
            category: ForumCategory.General,
            title: createForumDto.title,
            description: createForumDto.description,
            author: user
        });

        const savedForum =  await this.forumRepository.save(forum);
        return savedForum;
    } catch (e) {
        console.log('error creating forum ', e);
    }
  }

  public async getForums() {
        try {
            return await this.forumRepository.find();

        }catch (e) {
            console.log(e)
        }
  }

  public async getForum(id: string) {
      try {
          return await this.forumRepository.findOne({
              where: {id}
          });
      } catch (e) {
          console.log(e);
      }
  }

  public async update(id: string, updateForumDto: UpdateForumDto) {
        try {
            const forum = await this.forumRepository.findOne({where: {id}});
            if(!forum) {
                throw new Error('can not find forum ');
            }
            const updatedForum = await this.forumRepository.update(id, updateForumDto);
            if(updatedForum.affected === 0){
                throw new Error('Failed to update the forum');
            }
            const updatedForumEntity = await this.forumRepository.findOne({
                where: { id}
            });
            return updatedForumEntity;
        } catch (e) {
            console.log(e);
        }
  }

  public async removeForum(id: string) {
        try {
            const removedForum = await this.forumRepository.delete(id);
            return removedForum;
        }catch (e){
            console.log(e);
        }
  }
}
