import * as express from 'express';
import { Server } from 'net';
import * as bodyParser from 'body-parser';

export class MainServer{
    readonly app = express();
    private server: Server;
    private port = '3220';

    constructor() {
        this.app.use(bodyParser.json({ limit: '2mb' }));
        this.app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }));
        this.app.use(bodyParser.text());
    }

    async listen() {
        await new Promise(resolve => this.server = this.app.listen(this.port, resolve));
    }
}
