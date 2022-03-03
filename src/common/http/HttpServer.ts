import express, { Application, Express, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

export interface HttpRouterHook {
    hookRouters(app: Express): void
}

export default abstract class HttpServer {

    private isStarted = false;

    start(port: number) {
        this.bindRoutes(express()
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
            .use((err: Error, req: Request, res: Response, next: NextFunction) => {
                console.error(`[HTTP API] [Error] -> ${err.message}`)
                res.status(500).send('Something broke!')
            })
        ).listen(port, () => console.log(`[HTTP API] Listening on port ${port} ...`))
    }

    protected abstract bindRoutes(app: Application): Application
}

