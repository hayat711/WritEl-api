import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {Observable} from "rxjs";
import {Role} from "../enums/roles.enum";
import {ROLES_KEY} from "../decorators";
import {User} from "../../modules/user/entities/user.entity";

@Injectable()

export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndMerge<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ])

        if (!requiredRoles) {
            return true;
        }
        const { user }: { user: User} = context.switchToHttp().getRequest();

        return user && requiredRoles.some((role) => user.role?.includes(role))
    }
}