import * as socketIo from "socket.io";

export class Listener {
    private io: SocketIO.Server
    
    constructor(private server: any) {
        this.io = socketIo(this.server)
    }
    
    public start(): void {
        this.io.on('connection', (socket: any) => {
            socket.on('message', (m: string) => {
               // this.io.emit('message', m);
            });
        });
    }
}