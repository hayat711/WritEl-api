import {forwardRef, Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UserModule} from "../user/user.module";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtAuthStrategy} from "./strategies/jwt.strategy";
import {GoogleOauthStrategy} from "./strategies/google-oauth.strategy";
import {FacebookStrategy} from "./strategies/facebook.strategy";

@Module({
  imports: [
      forwardRef(() => UserModule)
      ,JwtModule.registerAsync({
    imports: [ConfigModule, ],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get('JWT_ACCESS_SECRET_KEY'),
      signOptions: {
        expiresIn: configService.get('JWT_ACCESS_EXPIRATION_TIME')
      }
    })
  })],
  controllers: [AuthController],

  providers: [AuthService, JwtAuthStrategy, GoogleOauthStrategy, FacebookStrategy],
  exports: [AuthService],
})
export class AuthModule {}
