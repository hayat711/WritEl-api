import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {DataSource, Repository} from "typeorm";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";
import {PostgresErrorCode} from "../../common/enums/postgres-error.enum";
import {UniqueViolation} from "../../common/exceptions";
import {AuthRequest} from "../auth/dto/req-with-user.dto";
import {AccountStatus} from "../../common/enums/status.enum";
import {DatabaseFileService} from "../database-file/database-file.service";

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
              private readonly databaseFileService : DatabaseFileService,
              private readonly dataSource : DataSource,
              ) {
  }

  public async create(data: Partial<User>) {
    const user = this.userRepository.create(data)

    await this.userRepository.save(user);

    return user;
  }

  public async update(usrId: string, values: QueryDeepPartialEntity<User>) {
    await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set(values)
        .where("id = :id", {id: usrId})
        .execute()
  }

  public async getUserByField(field:string, value: string |number) : Promise<User>{
    const user = await this.userRepository.findOne({
      where: {
        [field] : value
      }
    })
    return user;
  }

  public async updateProfile(userId: string, values: QueryDeepPartialEntity<User>) {
    try {
      console.log('Updating profile ....');
      await this.userRepository.update(userId, values);

      // await  this.userRepository.createQueryBuilder()
      //     .update(User)
      //     .set(values)
      //     .where("id = :userId", { id: userId})
      //     .execute()
      console.log('profile updated!');

        return {
          success: true,
          message: 'Profile updated'
        }
    } catch (err) {
      if (err.code == PostgresErrorCode.UniqueViolation) {
        if (err.detail.includes('email')) {
          throw new UniqueViolation('email');
        }

        if (err.detail.includes('nick_name' || 'nick' || 'nickName')) {
          throw new UniqueViolation('displayName');
        }
      }
      throw new InternalServerErrorException();
    }
  }


  public async continueWithProvider(request: AuthRequest) {
    let user : User;

    const { providerId, email } = request.user;
    user = await this.userRepository
        .createQueryBuilder()
        .where('provider.id = :providerId', {providerId})
        .orWhere('email = :email', {email})
        .getOne();

    if (user) {
      if (request.user.email === user.email && user.provider == 'local') {
        throw new BadRequestException('User with email same as social provider already exists');
      }
    }

    if (!user) {
      user = this.userRepository.create({
        provider: request.user.provider,
        providerId: request.user.providerId,
        email: request.user.email,
        password: request.user.password,
        firstName: request.user.firstName,
        lastName : request.user.lastName,
        displayName: request.user.displayName,
        image: request.user.image,
        accountStatus: AccountStatus.VERIFIED,
      });

      await this.userRepository.save(user);
    }
    return user;
  }

  async addAvatar(userId: string, imageBuffer: Buffer, filename:string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try{
      const user = await queryRunner.manager.findOne(User, {
        where: {
          id: userId
        }
      });
      const currentAvatarId = user.avatarId;
      const avatar = await this.databaseFileService.uploadDatabaseFile(imageBuffer, filename, queryRunner);
      await queryRunner.manager.update(User, userId, {
        avatarId: avatar.id
      });
      if (currentAvatarId) {
        await this.databaseFileService.deleteFile(currentAvatarId, queryRunner);
      }
      await queryRunner.commitTransaction();
      return avatar;
    } catch {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }



  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
