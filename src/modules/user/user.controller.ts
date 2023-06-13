import {Body, Controller, Patch, Post, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {UserService} from './user.service';
import {UpdateUserDto} from './dto/update-user.dto';
import {JwtAuthGuard} from "../../common/guards/jwt.auth.guard";
import {CurrentUser} from "../../common/decorators";
import {Express} from "express";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
              ) {}

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  updateProfile(@CurrentUser('id') id: string,
                @Body() updateData: UpdateUserDto) {
    return this.userService.updateProfile(id, updateData)
  }

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(@CurrentUser('id') userId: string,
                  @UploadedFile() file: Express.Multer.File) {
    return this.userService.addAvatar(userId, file.buffer, file.originalname);

  }

  @Post('test')
  @UseInterceptors(FileInterceptor('file'))
  async addAvatarTest(@Body() data: any, @UploadedFile() file: Express.Multer.File) {
  }


}
