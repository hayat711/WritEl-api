import {
    BadRequestException,
    HttpException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException
} from '@nestjs/common';

import {UserService} from "../user/user.service";
import {CreateAccountDto} from "./dto/create-account.dto";
import {Request} from "express";
import {Providers} from "../../common/enums";
import {PostgresErrorCode} from "../../common/enums/postgres-error.enum";
import {InvalidCredentials, UniqueViolation} from "../../common/exceptions";
import {LoginDto} from "./dto/login.dot";
import {SocialProvider} from "../../common/exceptions/socil-provider";
import * as argon from 'argon2';
import {nanoid} from 'nanoid';
import {User} from "../user/entities/user.entity";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import RequestWithUser, {AuthRequest} from "./dto/req-with-user.dto";
import * as process from "process";
import {AccountStatus} from "../../common/enums/status.enum";
import {PasswordValuesDto} from "./dto/password-values.dto";
import {RedisService} from "@liaoliaots/nestjs-redis";


@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService,
                private readonly jwtService: JwtService,
                private readonly configService: ConfigService,
                private readonly redisService: RedisService) {
    }


    public async register(registrationData: CreateAccountDto, req: Request){
        try{
            const user = await this.userService.create({
                provider: Providers.Local,
                ...registrationData
            });

            await this.sendConfirmationToken(user);

            const [accessToken, refreshToken] = await this.generateToken(user);

            await this.setToken(req, { accessToken, refreshToken});

            return {
                user,
                accessToken,
            }

        } catch (err: any) {
            if (err.code == PostgresErrorCode.UniqueViolation) {
                if (err.detail.includes('email')) {
                    throw new UniqueViolation('email')
                }
                if(err.detail.includes('nick_name' || 'nick' || 'nickName')) {
                    throw new UniqueViolation('nickName')
                }
            }
            throw new InternalServerErrorException()
        }
    }

    public async login(credentials: LoginDto, req: Request) {
        try{
            const { email, password } = credentials;
            console.log('login credentials', credentials);
            const user = await  this.getAuthenticatedUser(email, password);
            const [accessToken, refreshToken] = await this.generateToken(user);

            await this.setToken(req, { accessToken, refreshToken})

            return {
                user,
                accessToken,
            }
        } catch (err) {
            throw new HttpException(err.response, err.status);
        }
    }

    public async logout(req: RequestWithUser) {
        if (req.cookies && req.cookies['refresh_token']) {
            const refreshTokenCookie = req.cookies['refresh_token'];
            const verifiedRefresh = await this.jwtService.verifyAsync(refreshTokenCookie, {
                secret: this.configService.get('JWT_REFRESH_SECRET_KEY')
            })
            await this.redisService.getClient().del(`refresh-token:${verifiedRefresh.id}:${verifiedRefresh.jti}`)
        }

        req.res.clearCookie('access_token');
        req.res.clearCookie('refresh_token');
    }

    public async refreshTokens(req: Request) {
        const refreshTokenCookie = req.cookies['refresh_token']
        if (!refreshTokenCookie) {
            throw new UnauthorizedException('Invalid cookie')
        }

        const verifiedJwt = await this.jwtService.verifyAsync(refreshTokenCookie, {
            secret: this.configService.get('JWT_REFRESH_SECRET_KEY')
        })

        if (!verifiedJwt) {
            throw new UniqueViolation('Invalid refresh token');
        }

        const accessToken = await this.jwtService.signAsync({
            displayName: verifiedJwt.displayName,
            id: verifiedJwt.id
        }, {
            issuer: 'Hayat',
            secret: this.configService.get('JWT_ACCESS_SECRET_KEY'),
            expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_TIME'),

        })

        await this.setToken(req, { accessToken})
        const user = await this.userService.getUserByField('id', verifiedJwt.id)
        return user;
    }

    public async getAuthenticatedUser(email: string, password: string){
        try {
            const user = await this.userService.getUserByField('email', email);
            if (!user) {
                throw new InvalidCredentials();
            }

            if (user.provider !== Providers.Local) {
                throw new SocialProvider()
            }
            const isMatch = await argon.verify(user.password, password);
            if (!isMatch) {
                throw new InvalidCredentials()
            }
            return user;
        } catch (err) {
            throw err;
        }
    }

    // private generateGravatarUrl(email: string) {
    //     const hash = createHash('md5').update(email).digest('hex');
    //     return `https://www.gravatar.com/avatar/${hash}`;
    // }

    public async getUserFromAccessToken(token: string) {
        const verifiedJWT = await this.jwtService.verifyAsync(token, {
            secret: this.configService.get('JWT_ACCESS_SECRET_KEY')
        });

        if (!verifiedJWT) {
            return undefined;
        }

        return this.userService.getUserByField('id', verifiedJWT.id)
    }

    public async confirmAccount(user: User, token: string) {
        const accountId = await this.redisService.getClient(`confirm-account', ${token}`);

        if(!accountId) {
            //@ts-ignore
            if(accountId === user.id && user.accountStatus === AccountStatus.VERIFIED) {
                return {
                    success: true,
                    message: "Account already verified"
                }
            }

            return {
                success: false,
                message: "Confirmation token expired"
            }
        }


        if (user.id ) {
            await this.userService.update(user.id, {
                accountStatus: AccountStatus.VERIFIED
            })

            await this.redisService.getClient().del(`confirm-account: ${token}`)
        }
        return {
            success: true,
            message: 'Account verified successfully'
        }
    }

    public async socialProviderLogin(request: AuthRequest, provider: Providers) {
        try {
            if (provider === Providers.Google) {
                if (!request.user.verified) {
                    throw new BadRequestException('This Google account is not verified')
                }
            }

            const user = await this.userService.continueWithProvider(request);
            const [accessToken, refreshToken] = await this.generateToken(user);
            await this.setToken(request, { accessToken, refreshToken});

            request.res.redirect(`${process.env.ORIGIN}/me`);

            console.log('Here is user logged with google account', user);
            return {
                user,
                accessToken
            };


        } catch (e) {
            request.res.redirect(`${process.env.ORIGIN}/login/error?message=${e.response.message}`);
        }
    }

    public async resendConfirmationToken(user: any) {
        this.sendConfirmationToken(user)
        return {
            success: true,
            message: 'Confirmation token resend. Check your email'
        }
    }

    public async resetPassword(email: string) {
        const user = await this.userService.getUserByField('email', email);

        if (user) {
            if (user.provider === Providers.Local) {
                this.sendResetToken(user);
            }
        }

        return {
            success: true,
            message: "If the account exists and it isn't registered with social provider, an " +
                "email with a password rest link has been sent to", email

        }
    }

    public async changePassword(user: User, password: PasswordValuesDto){
        if (user.provider !== Providers.Local) {
            throw new BadRequestException( `you cannot change password while using social provider`);
        }

        const authUser = await this.getAuthenticatedUser(user.email, password.oldPassword)
        if (password.newPassword === password.oldPassword) {
            throw new BadRequestException(`New password cannot be the same as old`)
        }

        if (authUser) {
            this.userService.update(user.id, {
                password: await argon.hash(password.newPassword)
            });
            return {
                success: true,
                message: 'Password changed'
            }
        }

    }

    public async setNewPassword(newPassword: string, token: string, reqUser: User) {
        const accountId = await this.redisService.getClient().get(`reset-password:${token}`)

        const user = await this.userService.getUserByField('id', reqUser.id);

        if (!accountId) {
            throw new BadRequestException(`Reset password token expired`)
        }

        await this.userService.update(user.id, {
            password: await argon.hash(newPassword)
        });

        await this.redisService.getClient().del(`reset-password:${token}`)

        return {
            success: true,
            message: 'password reseted'
        }
    }

    public async getProfile(req: RequestWithUser) {
        return {
            user: req.user
        }
    }

    private async generateToken(user: User) {
        const jwtid = nanoid();


        const accessToken = await this.jwtService.signAsync({
            displayName: user.displayName,
            id: user.id
        }, {
            issuer: 'Hayat',
            secret: this.configService.get('JWT_ACCESS_SECRET_KEY'),
            expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_TIME')
        })

        const refreshToken = await this.jwtService.signAsync({
            displayName: user.displayName,
            id: user.id
        }, {
            jwtid,
            issuer: 'Hayat',
            secret: this.configService.get('JWT_REFRESH_SECRET_KEY'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
        })
        //TODO add redis service
        await this.redisService.getClient().set(`refresh-token:${user.id}:${jwtid}`, user.id, 'EX', 60 * 60 * 24 * 30);

        return [accessToken, refreshToken];
    }

    private async setToken(req: Request, { accessToken, refreshToken}:
        { accessToken:string, refreshToken?: string} ) {
        req.res.cookie('access_token', accessToken, {
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
            sameSite: 'lax'
        })

        if(refreshToken) {
            req.res.cookie('refresh_token', refreshToken, {
                maxAge: 1000 * 60 * 60* 24* 30,
                httpOnly: true,
                sameSite: true,
            })
        }
    }

    private async sendResetToken(user: User) {
        const token = nanoid();

        await this.redisService.getClient().set(`reset-password:${token}`, user.id, 'EX', 60 * 60 ) // 1 hour until expires

    }

    private async sendConfirmationToken(user: User) {
        const token = nanoid()

        await this.redisService.getClient().set(`confirm-account:${token}`, user.id, 'EX', 60 * 60  ) // 1 hour until expires
    }

}
