import Redis from "ioredis";
import {IoAdapter} from "@nestjs/platform-socket.io";
import {ServerOptions} from "socket.io";
import {createAdapter} from '@socket.io/redis-adapter';


const redisHost = process.env.REDIS_HOST;
const redisPort = parseInt(process.env.REDIS_PORT ?? '0', 10);
const redisPassword = process.env.REDIS_PASSWORD;


const pubClient = new Redis({
    host: redisHost,
    port: redisPort,
    password: redisPassword,
});
const subClient = pubClient.duplicate();


export class RedisIoAdapter extends IoAdapter {
    private adapterConstructor : ReturnType<typeof createAdapter>;

    async connectToRedis(): Promise<void> {
        await Promise.all([pubClient, subClient]);

        this.adapterConstructor = createAdapter(pubClient, subClient);
    }

    createIOServer(port: number, options?: ServerOptions): any {
        const server = super.createIOServer(port, options);
        server.adapter(this.adapterConstructor);
        return server;
    }
}
