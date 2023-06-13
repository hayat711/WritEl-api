import {Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {RoomService} from './room.service';
import {CreateRoomDto} from './dto/create-room.dto';
import {UpdateRoomDto} from './dto/update-room.dto';
import {JwtAuthGuard} from "../../common/guards/jwt.auth.guard";
import {CurrentUser} from "../../common/decorators";
import {VerifiedGuard} from "../../common/guards/verified.guard";
import {MembershipGuard} from "./guards/Membership.guard";
import {User} from "../user/entities/user.entity";
import {ModGuard} from "./guards/Mod.guard";
import {OwnershipGuard} from "./guards/Ownership.guard";
import {AddRemoveUserDto} from "./dto/add-remove.dto";
import {Throttle} from "@nestjs/throttler";

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @UseGuards(JwtAuthGuard)
  @Get('invitation')
  async getInvitation(@Query('code') code: string) {
    console.log('invitation code: ', code);
    return this.roomService.getInvitationByCode(code);
  }

  @UseGuards(JwtAuthGuard)
  @Get('invitations')
  async getInvitations() {
    return this.roomService.getInvitations();
  }

  @UseGuards(JwtAuthGuard)
  @Post('invite/:roomId')
  async inviteToRoom(@CurrentUser('id') userId: string,
                     @Param('roomId', new ParseUUIDPipe()) roomId: string) {
    return this.roomService.inviteToRoom(userId, roomId);
  }

  @UseGuards(JwtAuthGuard, VerifiedGuard)
  @Post()
  create(@Body() data: CreateRoomDto,
         @CurrentUser() user: User) {
    return this.roomService.createRoom(data, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.roomService.getRooms();
  }

  @UseGuards(JwtAuthGuard, VerifiedGuard, MembershipGuard)
  @Get(':id')
  async getRoom(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.roomService.getRoomWithRelations(id);
  }



  @UseGuards(JwtAuthGuard, VerifiedGuard, ModGuard)
  @Patch(':id')
  async updateRoom(@Param('id', new ParseUUIDPipe()) id: string,
                   @Body() data: UpdateRoomDto){
    return this.roomService.updateRoom(id, data);
  }

  @Throttle(60, 60)
  @UseGuards(JwtAuthGuard, VerifiedGuard)
  @Get('my/rooms')
  async getUserRoom(
      @CurrentUser('id', new ParseUUIDPipe()) userId: string,
  ) {
    return this.roomService.getUserRooms(userId);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(+id, updateRoomDto);
  }

  @UseGuards(JwtAuthGuard, VerifiedGuard, OwnershipGuard)
  @Delete(':id')
  async deleteRoom(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.roomService.deleteRoom(id);
  }


  @UseGuards(JwtAuthGuard)
  @Post('add-user/:roomId')
  async addUser(
      @Body() data: AddRemoveUserDto,
      @Param('roomId', new ParseUUIDPipe())  roomId: string ) {
        return this.roomService.addToRoom(data.type, data.userId, roomId);
  }

  @UseGuards(JwtAuthGuard, MembershipGuard, VerifiedGuard, ModGuard)
  @Delete('remove-user/:roomId')
  async removeUser(
      @Body() data: AddRemoveUserDto,
      @Param('roomId', new ParseUUIDPipe()) roomId: string
  ) {
    return this.roomService.removeFromRoom(data.type, data.userId, roomId);
  }

}
