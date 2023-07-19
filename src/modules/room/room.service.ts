import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {UpdateRoomDto} from './dto/update-room.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Room} from "./entities/room.entity";
import {Repository} from "typeorm";
import {Invitation} from "./entities/invitation.entity";
import {UserService} from "../user/user.service";
import {nanoid} from "nanoid";
import {Emitter} from '@socket.io/redis-emitter';
import {User} from "../user/entities/user.entity";
import {PostgresErrorCode} from "../../common/enums/postgres-error.enum";
import {UniqueViolation} from "../../common/exceptions";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";
import {InjectEmitter} from "../chat/ws-emitter.module";

@Injectable()
export class RoomService {
  constructor(@InjectRepository(Room) private readonly roomRepository: Repository<Room>,
              @InjectRepository(Invitation) private readonly invitationRepository: Repository<Invitation>,
              private readonly userService: UserService,
              // @InjectEmitter() private readonly emitter: Emitter
              ) {
  }

  public async inviteToRoom(userId: string, roomId: string) {
    const code = nanoid();
    let invitation: Invitation;
    invitation = await this.invitationRepository.findOne({
      where: {
        userId, roomId
      }
    });

    if(!invitation) {
      invitation = new Invitation({
        userId,
        roomId,
        code,
      })
      return this.invitationRepository.save(invitation);
    }

    return invitation;
  }

  public async createRoom(dto: Partial<Room>, owner: User) {
    try {
      console.log('room owner id:  ', owner.id);
      const room: Room = new Room({
        name: dto.name,
        description: dto.description,
        isPublic: dto.isPublic,
        owner,
        users: [owner],
        mods: [owner]
      })

      await this.roomRepository.save(room);

      return room;

    } catch (err) {
      if (err.code == PostgresErrorCode.UniqueViolation) {
        if(err.detail.includes('name')) {
          throw new UniqueViolation('name');
        }
      }
    }
  }

  public async getRooms() {
    return await this.roomRepository.find();
  }

  public async getRoomWithRelations(id: string) {
      const query = await this.roomRepository
          .createQueryBuilder('room')
          .where('room.id = :id', {id})
          .leftJoin('room.users', 'users')
          .leftJoinAndSelect('room.users', 'all_users')
          .leftJoinAndSelect('room.mods', 'mods')
          .select([
              'room',
              'all_users.id',
              'all_users.displayName',
              'all_users.image',
              'mods.id',
              'mods.displayName',
              'mods.image',
              'owner.id',
              'owner.displayName',
              'owner.image',
          ])
          .orderBy('room.updated_at', 'DESC')
          .getOne()
      return query;
  }

  public async getRoomForMessages(id:string) {
      return await this.roomRepository.findOneOrFail({
          where: {id},
          relations: [
              'users', 'mods', 'owner'
          ]
      });
  }


  public async getUserRooms(userId: string) {
    const query = await this.roomRepository
        .createQueryBuilder('room')
        .where('users.id = :userId', {userId})
        .leftJoin('room.users', 'users')
        .leftJoinAndSelect('room.users', 'all_users')
        .leftJoinAndSelect('room.mods', 'mods')
        .leftJoinAndSelect('room.owner', 'owner')
        .select([
            'room',
            'all_users.id',
            'all_users.displayName',
            'all_users.image',
            'mods.id',
            'mods.displayName',
            'mods.image',
            'owner.id',
            'owner.displayName',
            'owner.image',
        ])
        .orderBy('room.updated_at', 'DESC')
        .getMany();
      return query;
  }

  public async getRoom(id: string, { relationIds} : { relationIds : boolean}) {
    const room = await  this.roomRepository.findOneOrFail({
      loadRelationIds: relationIds || false,
      where: {
        id,
      }
    });
    return room;
  }

  public async updateRoom(roomId: string, values: QueryDeepPartialEntity<Room> ) {
      try {
          const room = await this.roomRepository
              .createQueryBuilder()
              .update(Room)
              .set(values)
              .where('id = :id', {roomId})
              .execute();

          return {
              success: !!room.affected,
              message: !!room.affected ? 'Room updated' : 'No room found with this id',
          }
      }catch (e) {
          if (e.code == PostgresErrorCode.UniqueViolation) {
              if (e.detail.includes('name')) {
                  throw new UniqueViolation('name');
              }
          }
          throw new InternalServerErrorException();
      }
  }

  public async addToRoom(type: 'user' | 'mod', userId: string, roomId: string) {
      const room = await this.getRoom(roomId, {relationIds: true});
      const user = await this.userService.getUserByField('id', userId);

      //@ts-ignore
      const isUser = room.users.includes(user.id);
      //@ts-ignore
      const isMod = room.mods.includes(user.id);

      if (type === 'user') {
          if (!isUser) {
              await this.roomRepository
                  .createQueryBuilder()
                  .relation(Room, 'users')
                  .of(room)
                  .add(user)
              const rooms = await this.getUserRooms(user.id);

              //TODO redis emitter here!
              // this.emmiter

              return {
                  success: true,
                  message: 'User added to room'
              }
          }

          return {
              success: false,
              message: 'User not added to room'
          }
      }

      if (type === 'mod') {
          if (!isMod) {
              await this.roomRepository
                  .createQueryBuilder()
                  .relation(Room, 'mods')
                  .of(room)
                  .add(user);

              return {
                  success: true,
                  message: 'User added to moderators',
              }
          }

          if (!isUser) {
              await this.roomRepository
                  .createQueryBuilder()
                  .relation(Room, 'users')
                  .relation(Room, 'mods')
                  .of(room)
                  .add(user);

              return {
                  success: true,
                  message: 'User added to room and moderators',
              }
          }
          return {
              success: false,
              message: 'User not added to room and moderators'
          }
      }
  }

  public async getInvitationByCode(code: string) {
    try {
      const query = await this.invitationRepository
          .createQueryBuilder('invitation')
          .where('code = :code', { code })
          .leftJoinAndSelect('invitation.user', 'user')
          .leftJoinAndSelect('invitation.room', 'room')
          .leftJoinAndSelect('room.owner', 'owner')
          .select([
              'invitation',
              'user.id',
              'user.displayName',
              'user.image',
              'room.id',
              'room.name',
              'room.description',
              'owner.id',
              'owner.displayName',
              'owner.image',
          ])
          .getOne();
      return query;
    } catch (err: any){
      console.log(err);
    }
  }

  public async getInvitations () {
      try {
          const query = await this.invitationRepository
              .createQueryBuilder('invitation')
              .where({})
              .leftJoinAndSelect('invitation.user', 'user')
              .leftJoinAndSelect('invitation.room', 'room')
              .select([
                  'invitation',
                  'user.id',
                  'user.displayName',
                  'room.id',
                  'room.name'
              ])
              .orderBy('invitation.created_at', 'DESC')
              .getMany();
          return query;
      }
      catch (e) {
          console.log(e);
      }
  }
  public async findAll() {
    return this.roomRepository.find();
  }

  public async findOneRoom(id: string) {
    const query = await this.roomRepository
        .createQueryBuilder('room')
        .where('room.id =:id', {id})
        .leftJoin('room.users', 'all_users')
        .leftJoinAndSelect('room.mods', 'mods')
        .leftJoinAndSelect('room.owner', 'owner')
        .select([
            'room',
            'all_users.id',
            'all_users.displayName',
            'all_users.image',
            'mods.id',
            'mods.displayName',
            'mods.image',
            'owner.id',
            'owner.displayName',
            'owner.image',
        ])
        .orderBy('room.updated_at', 'DESC')
        .getOne();
    return query;
  }


  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  public async deleteRoom(roomId: string) {
    try {
        const room = await this.roomRepository
            .createQueryBuilder()
            .delete()
            .where("id = :id", { roomId })
            .execute()

        return {
            success: !!room.affected,
            message: !!room.affected ? 'Room deleted' : 'No room found with this id',
        }
    } catch (err) {
        throw err;
    }
  }

  public async removeFromRoom(type: 'user' | 'mod', userId: string, roomId: string) {
      const room = await this.getRoom(roomId, { relationIds: true});
      const user = await this.userService.getUserByField('id', userId);

      //@ts-ignore
      const isUser = room.users.includes(user.id);

      //@ts-ignore
      const isMod = room.mods.includes(user.id);

      //@ts-ignore
      const isOwner = user.id === room.owner;

      if (isOwner) {
          return {
              success: false,
              message: 'Owner cannot be removed from their room'
          }
      }

      if (type === 'user') {
          if (isUser) {
              await this.roomRepository
                  .createQueryBuilder()
                  .relation(Room, 'users')
                  .of(room)
                  .remove(user);

              const rooms = await this.getUserRooms(user.id);
              //TODO emitter
              // this.emitter.of('/chat').to(user.id).emit('room:all', rooms);

              return {
                  success: true,
                  message: 'User removed from room',
              }
          }

          if (isMod) {
              await this.roomRepository
                  .createQueryBuilder()
                  .relation(Room, 'users')
                  .relation(Room, 'mods')
                  .of(room)
                  .remove(user);

              return {
                  success: true,
                  message: 'User removed from room and moderators',
              }
          }
          return {
              success: false,
              message: 'User not removed from room'
          }
      }

      if (type === 'mod') {
          if (isMod) {
              await this.roomRepository
                  .createQueryBuilder()
                  .relation(Room, 'mods')
                  .of(room)
                  .remove(user);

              return {
                  success: true,
                  message: 'User removed from moderators',
              }
          }

          return {
              success: false,
              message: 'User not removed from moderators',
          }
      }
  }
}
