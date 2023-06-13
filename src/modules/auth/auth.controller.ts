import {Body, Controller, Delete, Get, HttpCode, Patch, Post, Query, Req, Res, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {CreateAccountDto} from "./dto/create-account.dto";
import {Request, Response} from 'express'
import {LoginDto} from "./dto/login.dot";
import {JwtAuthGuard} from "../../common/guards/jwt.auth.guard";
import RequestWithUser, {AuthRequest} from "./dto/req-with-user.dto";
import {RolesGuard} from "../../common/guards/roles.guard";
import {CurrentUser, Roles, Verified as Status} from "../../common/decorators";
import {Role} from "../../common/enums/roles.enum";
import {VerifiedGuard} from "../../common/guards/verified.guard";
import {User} from "../user/entities/user.entity";
import {GoogleOauthGuard} from "../../common/guards/google-oauth.guard";
import {Providers} from "../../common/enums";
import {FacebookGuard} from "../../common/guards/facebook.guard";
import {AccountStatus} from "../../common/enums/status.enum";
import {PasswordValuesDto} from "./dto/password-values.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local/register')
  async register(
      @Body() credentials: CreateAccountDto,
      @Req() req: Request) {
    return this.authService.register(credentials, req);
  }

  @HttpCode(200)
  @Post('local/login')
  async login(
      @Body() credentials: LoginDto,
      @Req() req: Request
  ){
    return this.authService.login(credentials, req);
  }

  @Delete('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: RequestWithUser) {
    return this.authService.logout(req);
  }
  
  // social login
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth(@Req() _req: Request){
  //   Guard redirects
  }

  @Get('google/redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req: AuthRequest, @Res() _res: Response) {
    return this.authService.socialProviderLogin(req, Providers.Google);
  }

  @Get('facebook')
  @UseGuards(FacebookGuard)
  async facebookAuth(@Req() _req: Request) {
  //   Guard redirects
  }

  @Get('facebook/redirect')
  @UseGuards(FacebookGuard)
  async facebookAuthRedirect(@Req() req: AuthRequest, @Res() _res: Response) {
    return this.authService.socialProviderLogin(req, Providers.Facebook);
  }


  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: RequestWithUser) {
    return this.authService.getProfile(req);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin')
  getAdminData() {
    return 'only admin should see this'
  }

  @Status(AccountStatus.PENDING)
  @UseGuards(JwtAuthGuard, VerifiedGuard)
  @Get('account/confirm')
  confirmAccount(
      @CurrentUser() user: User,
      @Query('token') token: string
  ){
    return this.authService.confirmAccount(user, token);
  }

  @Status(AccountStatus.PENDING)
  @UseGuards(JwtAuthGuard, VerifiedGuard)
  @Get('account/confirm-resend')
  resendConfirmToken(
      @CurrentUser() user: User
  ) {
    return this.authService.resendConfirmationToken(user);
  }

  // reset your password
  @Patch('password/reset')
  resetPassword(
      @Body('email') email: string
  ) {
    return this.authService.resetPassword(email);
  }

  // change your password
  @Patch('password/change')
  @UseGuards(JwtAuthGuard, VerifiedGuard)
  changePassword(
      @CurrentUser() user: User,
      @Body() passwordValues: PasswordValuesDto
  ) {
    return this.authService.changePassword(user, passwordValues);
  }

  // set new password
  @Patch('password/new')
  setNewPassword(
      @Body('newPassword') newPassword: string,
      @Query('token') token: string,
      @CurrentUser() user: User
  ) {
    return this.authService.setNewPassword(newPassword, token, user)
  }
}
