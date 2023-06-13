import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Profile, Strategy} from "passport-facebook";
import {ConfigService} from "@nestjs/config";
import {Providers} from "../../../common/enums";


@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook'){
    constructor(configService: ConfigService) {
        super({
            clientID: configService.get<string>('OAUTH_FACEBOOK_ID'),
            clientSecret:configService.get<string>('OAUTH_FACEBOOK_SECRET'),
            callbackURL: configService.get<string>('OAUTH_FACEBOOK_REDIRECT_URL'),
            scope: 'email',
            profileFields: ['id', 'emails', 'gender', 'name', 'displayName', 'pictures.type(large)'],
        });

    }

    async validate(_accessToken, _refreshToken, profile: Profile){
        try {
            const user = {
                provider: Providers.Facebook,
                providerId: profile.id,
                email: profile.emails[0].value,
                password: 'provided',
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                displayName: profile.displayName ?? profile.name.givenName,
                image: profile.photos[0].value,
            }

            return user;
        } catch (e) {
            console.log('facebook auth err ', e);
            throw new InternalServerErrorException();
        }
    }
}