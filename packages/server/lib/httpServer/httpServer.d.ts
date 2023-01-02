import type { Server } from 'http';
import ConnectionsManagerServer from '../wrtc/connectionsManager.js';
import { CorsOptions } from '@geckos.io/common/lib/types.js';
declare const HttpServer: (server: Server, connectionsManager: ConnectionsManagerServer, cors: CorsOptions) => void;
export default HttpServer;
//# sourceMappingURL=httpServer.d.ts.map