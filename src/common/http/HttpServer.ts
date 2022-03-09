import express, { Application, Express, NextFunction, Request, Response } from 'express';
import http, { createServer } from "http"
import morgan from 'morgan';
import { Server } from "socket.io"

export interface HttpRouterHook {
    hookRouters(app: Express): void
}

export default abstract class HttpServer {

    private isStarted = false;
    private _server: http.Server
    private _io!: Server;
    private _app: Application

    constructor() {
        this._app = express()
        this._server = createServer(this._app)
        this._io = new Server(this._server, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"]
            }
        })
    }

    get io() {
        return this._io;
    }

    start(port: number) {
        this.bindRoutes(
            this._app
                .use(express.json())
                .use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }))
                .use(morgan(function (tokens, req, res) {
                    return [
                        tokens.method(req, res),
                        tokens.url(req, res),
                        tokens.status(req, res),
                        tokens.res(req, res, 'content-length'), '-',
                        tokens['response-time'](req, res), 'ms'
                    ].join(' ')
                }))
        ).use((err: Error, req: Request, res: Response, next: NextFunction) => {
            console.error(`[HTTP API] [Error] -> ${err.message}`)
            res.status(500).send('Something broke!')
        })
        this._server.listen(port, () => console.log(`[HTTP API] Listening on port ${port} ...`))
    }
    protected abstract bindRoutes(app: Application): Application
}

