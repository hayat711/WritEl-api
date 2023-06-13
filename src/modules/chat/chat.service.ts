import { Injectable } from '@nestjs/common';
import {AuthService} from "../auth/auth.service";
import {Socket} from "socket.io";
import {WsException} from "@nestjs/websockets";
import {parse} from "cookie";

@Injectable()
export class ChatService {
  constructor(private readonly authService: AuthService) {
  }
    async getUserFromSocket(socket: Socket) {
      try {
        const cookie = socket.handshake.headers.cookie;

        if (!cookie) {
          throw new WsException('No cookie Found!');
        }

        const { access_token : accessToken } = parse(cookie);
        const user = await  this.authService.getUserFromAccessToken(accessToken);

        if (!user) {
          throw new WsException('Invalid credentials');
        }

        return user;
      } catch (e) {

      }
    }

}
