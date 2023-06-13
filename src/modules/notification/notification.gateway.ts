// import {
//     ConnectedSocket,
//     OnGatewayConnection,
//     OnGatewayDisconnect,
//     OnGatewayInit,
//     SubscribeMessage,
//     WebSocketGateway, WebSocketServer
// } from "@nestjs/websockets";
// import {Server, Socket} from "socket.io";
// import {User} from "../user/entities/user.entity";
// import {Logger, OnModuleInit} from "@nestjs/common";
//
//
// interface UserSocket extends Socket {
//     user: User
// }
//
//
// export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, OnModuleInit{
//
//     @WebSocketServer()
//     public server: Server
//
//     private readonly logger: Logger = new Logger('Notification Gateway');
//
//     afterInit(server: any): any {
//     }
//
//     handleConnection(client: any, ...args: any[]): any {
//     }
//
//     handleDisconnect(client: any): any {
//     }
//
//     onModuleInit(): any {
//     }
//
// }
//
// @WebSocketGateway({
//     cors: {
//         origin: 'http://localhost:3000',
//         credentials: true
//     },
//     namespace: `notification`
// })
//
//
// @SubscribeMessage('notif:create')
// // public onNotificationCreate(
// //     @ConnectedSocket socket : UserSocket
// // )
