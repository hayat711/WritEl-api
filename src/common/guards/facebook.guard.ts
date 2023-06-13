import {Injectable} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";


@Injectable()
export class FacebookGuard extends AuthGuard('facebook'){
    constructor() {
        super({
            prompt:'select_account'
        });
    }
}