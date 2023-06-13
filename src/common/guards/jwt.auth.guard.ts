import {Injectable, UnauthorizedException} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {AuthService} from "../../modules/auth/auth.service";
import {TokenExpiredError} from "jsonwebtoken";


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private readonly authService: AuthService
    ) {
        super();
    }

    handleRequest(err, user, info, context) {
        const request = context.switchToHttp().getRequest();
        const cookies = request.cookies || {};

        if (info) {
            if (info instanceof TokenExpiredError && cookies['refresh_token']) {
                return this.authService.refreshTokens(request);
            }
            if (info instanceof  Error && info.message === 'No auth token' && cookies['refresh_token']
                && !cookies['access_token']) {
                return  this.authService.refreshTokens(request);
            }
        }

        if (err || !user) {
            throw err || new UnauthorizedException()
        }
        return user;
    }
}