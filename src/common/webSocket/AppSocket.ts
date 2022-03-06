import { Server } from "socket.io"

export default class AppSocket {
    constructor(private readonly _io: Server) { }

    sendMessage(topic: string, message: any): void {
        this._io.emit(topic, JSON.stringify(message))
    }
}