/// <reference types="node" />
import { ChannelId, ServerOptions } from '@geckos.io/common/lib/types.js';
import type { IncomingMessage, OutgoingMessage } from 'http';
import WebRTCConnection from './webrtcConnection.js';
export default class ConnectionsManagerServer {
    options: ServerOptions;
    connections: Map<ChannelId, WebRTCConnection>;
    constructor(options: ServerOptions);
    private createId;
    getConnection(id: ChannelId): WebRTCConnection | undefined;
    getConnections(): Map<ChannelId, WebRTCConnection>;
    private getUserData;
    createConnection(authorization: string | undefined, request: IncomingMessage, response: OutgoingMessage): Promise<{
        userData: any;
        status: any;
        connection?: undefined;
    } | {
        status: number;
        userData?: undefined;
        connection?: undefined;
    } | {
        connection: {
            id: string;
            localDescription: undefined;
        };
        userData: any;
        status: number;
    }>;
    deleteConnection(connection: WebRTCConnection, state: string): Promise<void>;
}
//# sourceMappingURL=connectionsManager.d.ts.map