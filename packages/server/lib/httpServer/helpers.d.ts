import type { IncomingMessage, ServerResponse } from 'http';
export declare const sendStatus: (res: ServerResponse, status: number) => void;
export declare const sendJSON: (res: ServerResponse, json: object) => void;
export declare const getJSONBody: (req: IncomingMessage) => Promise<object>;
//# sourceMappingURL=helpers.d.ts.map