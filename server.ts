import { createServer, Server } from 'http';

import { Replicant } from './types/Replicant'

import * as express from 'express';
import * as socketIo from 'socket.io';
import { getDefaultCompilerOptions } from 'typescript';

export class InfoMiddle {
    public static readonly PORT:number = 9091;
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;

    private replicants: Replicant[];

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }

    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

    private config(): void {
        this.port = process.env.PORT || InfoMiddle.PORT;
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.on('connect', (socket: any) => {
            console.log('Connected client on port %s.', this.port);
            socket.on('replicantUpdate', (newRep: Replicant) => {
                this.io.emit('update', JSON.stringify(newRep.content));
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }

    public getApp(): express.Application {
        return this.app;
    }

    public addReplicant(): express
}