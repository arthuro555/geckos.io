import { getJSONBody, sendJSON, sendStatus } from './helpers.js';
export const connection = async (connectionsManager, req, res) => {
    try {
        const headers = req.headers;
        // create connection (and check auth header)
        const { status, connection, userData } = await connectionsManager.createConnection(headers === null || headers === void 0 ? void 0 : headers.authorization, req, res);
        // on http status code
        if (status !== 200) {
            if (status >= 100 && status < 600)
                return sendStatus(res, status);
            else
                return sendStatus(res, 500);
        }
        if (!connection || !connection.id)
            return sendStatus(res, 500);
        const { id, localDescription } = connection;
        if (!id || !localDescription)
            return sendStatus(res, 500);
        return sendJSON(res, {
            userData,
            id,
            localDescription
        });
    }
    catch (err) {
        return sendStatus(res, 500);
    }
};
export const remoteDescription = async (connectionsManager, req, res) => {
    try {
        const pathname = req.url;
        const ids = pathname === null || pathname === void 0 ? void 0 : pathname.match(/[0-9a-zA-Z]{24}/g);
        const body = (await getJSONBody(req));
        if (ids && ids.length === 1) {
            const id = ids[0];
            const connection = connectionsManager.getConnection(id);
            if (!connection)
                return sendStatus(res, 404);
            const { sdp, type } = body;
            if (!sdp || !type)
                sendStatus(res, 400);
            connection.peerConnection.setRemoteDescription(sdp, type);
            return sendStatus(res, 200);
        }
        else {
            return sendStatus(res, 400);
        }
    }
    catch (err) {
        return sendStatus(res, 500);
    }
};
export const additionalCandidates = async (connectionsManager, req, res) => {
    try {
        const pathname = req.url;
        const ids = pathname === null || pathname === void 0 ? void 0 : pathname.match(/[0-9a-zA-Z]{24}/g);
        if (ids && ids.length === 1) {
            const id = ids[0];
            const connection = connectionsManager.getConnection(id);
            if (!connection)
                return sendStatus(res, 404);
            const additionalCandidates = [...connection.additionalCandidates];
            connection.additionalCandidates = [];
            return sendJSON(res, additionalCandidates);
        }
        else {
            return sendStatus(res, 400);
        }
    }
    catch (err) {
        return sendStatus(res, 500);
    }
};
export const close = async (connectionsManager, req, res) => {
    try {
        const pathname = req.url;
        const ids = pathname === null || pathname === void 0 ? void 0 : pathname.match(/[0-9a-zA-Z]{24}/g);
        if (ids && ids.length === 1) {
            const id = ids[0];
            const connection = connectionsManager.getConnection(id);
            await (connection === null || connection === void 0 ? void 0 : connection.close());
            return sendStatus(res, 200);
        }
        else {
            return sendStatus(res, 400);
        }
    }
    catch (err) {
        return sendStatus(res, 500);
    }
};
//# sourceMappingURL=routes.js.map