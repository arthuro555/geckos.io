/// <reference types="node" />
import * as Types from '@geckos.io/common/lib/types.js';
import ConnectionsManagerServer from '../wrtc/connectionsManager.js';
import ServerChannel from './channel.js';
import http from 'http';
export declare class GeckosServer {
    connectionsManager: ConnectionsManagerServer;
    server: http.Server;
    private _port;
    private _cors;
    constructor(options: Types.ServerOptions);
    /** Get cors settings. */
    get cors(): Types.CorsOptions;
    private get connections();
    /**
     * Make the server listen on a specific port.
     * @param port Default port is 9208.
     */
    listen(port?: number): void;
    /**
     * Add a existing http server.
     * @param server Your http.Server.
     */
    addServer(server: http.Server): void;
    get port(): number;
    /**
     * Emit a message to all channels.
     * @param eventName The event name.
     * @param data The data you want to send.
     * @param options EmitOptions
     */
    emit(eventName: Types.EventName, data: Types.Data, options?: Types.EmitOptions): void;
    /**
     * Emit a message to a specific room.
     * @param roomId The roomId.
     */
    room(roomId?: Types.RoomId): {
        emit: (eventName: Types.EventName, data: Types.Data) => void;
    };
    /** Emit a raw message */
    get raw(): {
        emit: (rawMessage: Types.RawMessage) => void;
        room: (roomId?: Types.RoomId) => {
            emit: (rawMessage: Types.RawMessage) => void;
        };
    };
    /** Listen for a new connection. */
    onConnection(callback: (channel: ServerChannel) => void): void;
}
/** The geckos.io server library. */
declare const geckosServer: (options?: Types.ServerOptions) => GeckosServer;
export default geckosServer;
export { ServerChannel };
//# sourceMappingURL=server.d.ts.map