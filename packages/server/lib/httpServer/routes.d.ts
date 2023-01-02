import type { IncomingMessage, ServerResponse } from 'http';
import type ConnectionsManagerServer from '../wrtc/connectionsManager.js';
export declare const connection: (connectionsManager: ConnectionsManagerServer, req: IncomingMessage, res: ServerResponse) => Promise<void>;
export declare const remoteDescription: (connectionsManager: ConnectionsManagerServer, req: IncomingMessage, res: ServerResponse) => Promise<void>;
export declare const additionalCandidates: (connectionsManager: ConnectionsManagerServer, req: IncomingMessage, res: ServerResponse) => Promise<void>;
export declare const close: (connectionsManager: ConnectionsManagerServer, req: IncomingMessage, res: ServerResponse) => Promise<void>;
//# sourceMappingURL=routes.d.ts.map