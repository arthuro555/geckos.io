import ConnectionsManagerServer from '../wrtc/connectionsManager.js';
import { EVENTS } from '@geckos.io/common/lib/constants.js';
import HttpServer from '../httpServer/httpServer.js';
import ServerChannel from './channel.js';
import bridge from '@geckos.io/common/lib/bridge.js';
import { cleanup } from '../wrtc/nodeDataChannel.js';
import http from 'http';
import { makeReliable } from '@geckos.io/common/lib/reliableMessage.js';
import { promiseWithTimeout } from '@geckos.io/common/lib/helpers.js';
export class GeckosServer {
    constructor(options) {
        var _a;
        this._cors = { origin: '*', allowAuthorization: false };
        this.connectionsManager = new ConnectionsManagerServer(options);
        // auto adjust allow authorization in cors headers
        if (typeof ((_a = options.cors) === null || _a === void 0 ? void 0 : _a.allowAuthorization) === 'undefined' && typeof options.authorization === 'function')
            this._cors.allowAuthorization = true;
        // merge cors options
        this._cors = { ...this._cors, ...options.cors };
    }
    /** Get cors settings. */
    get cors() {
        return this._cors;
    }
    // @ts-ignore
    get connections() {
        return this.connectionsManager.connections;
    }
    /**
     * Make the server listen on a specific port.
     * @param port Default port is 9208.
     */
    listen(port = 9208) {
        this._port = port;
        // create the server
        this.server = http.createServer();
        // on server close event
        const promises = [];
        this.server.once('close', async () => {
            for (const [_, connection] of Array.from(this.connectionsManager.connections)) {
                promises.push(connection.close());
            }
            await Promise.all(promises);
            await promiseWithTimeout(cleanup(), 2000);
            bridge.removeAllListeners();
        });
        // add all routes
        HttpServer(this.server, this.connectionsManager, this._cors);
        // start the server
        this.server.listen(port, () => {
            console.log(`Geckos.io signaling server is running on port ${port}`);
        });
    }
    /**
     * Add a existing http server.
     * @param server Your http.Server.
     */
    addServer(server) {
        this.server = server;
        // on server close event
        const promises = [];
        this.server.once('close', async () => {
            for (const [_, connection] of Array.from(this.connectionsManager.connections)) {
                promises.push(connection.close());
            }
            await Promise.all(promises);
            await promiseWithTimeout(cleanup(), 2000);
            bridge.removeAllListeners();
        });
        HttpServer(this.server, this.connectionsManager, this._cors);
    }
    get port() {
        return this._port;
    }
    /**
     * Emit a message to all channels.
     * @param eventName The event name.
     * @param data The data you want to send.
     * @param options EmitOptions
     */
    emit(eventName, data, options) {
        this.connections.forEach((connection) => {
            const { channel } = connection;
            if (options && options.reliable) {
                makeReliable(options, (id) => channel.emit(eventName, {
                    MESSAGE: data,
                    RELIABLE: 1,
                    ID: id
                }));
            }
            else
                channel.emit(eventName, data);
        });
    }
    /**
     * Emit a message to a specific room.
     * @param roomId The roomId.
     */
    room(roomId = undefined) {
        return {
            emit: (eventName, data) => {
                this.connections.forEach((connection) => {
                    const { channel } = connection;
                    const { roomId: channelRoomId } = channel;
                    if (roomId === channelRoomId) {
                        channel.emit(eventName, data);
                    }
                });
            }
        };
    }
    /** Emit a raw message */
    get raw() {
        return {
            emit: (rawMessage) => this.emit(EVENTS.RAW_MESSAGE, rawMessage),
            room: (roomId = undefined) => {
                return {
                    emit: (rawMessage) => {
                        this.room(roomId).emit(EVENTS.RAW_MESSAGE, rawMessage);
                    }
                };
            }
        };
    }
    /** Listen for a new connection. */
    onConnection(callback) {
        bridge.on(EVENTS.CONNECTION, (channel) => {
            const cb = channel => callback(channel);
            cb(channel);
        });
    }
}
/** The geckos.io server library. */
const geckosServer = (options = {}) => {
    const { iceTransportPolicy } = options;
    if (iceTransportPolicy === 'relay') {
        console.error(`WARNING: iceTransportPolicy "relay" does not work yet on the server!`);
        options.iceTransportPolicy = 'all';
    }
    return new GeckosServer(options);
};
export default geckosServer;
export { ServerChannel };
//# sourceMappingURL=server.js.map