/* eslint-disable sort-imports */
import ndc from 'node-datachannel';
export const wait = (ms = 1000) => {
    return new Promise(resolve => {
        setTimeout(() => {
            return resolve();
        }, ms);
    });
};
export const createDataChannel = (pc, label, config) => {
    return new Promise((resolve, reject) => {
        try {
            const dc = pc.createDataChannel(label, config);
            resolve(dc);
        }
        catch (err) {
            reject(err);
        }
    });
};
export const createPeerConnection = (peerName, config) => {
    return new Promise((resolve, reject) => {
        try {
            const peerConnection = new ndc.PeerConnection(peerName, config);
            resolve(peerConnection);
        }
        catch (err) {
            reject(err);
        }
    });
};
export const closePeerConnection = (peerConnection) => {
    return new Promise(resolve => {
        if (peerConnection) {
            peerConnection.destroy();
            resolve();
        }
        else {
            resolve();
        }
    });
};
export const closeDataChannel = (dataChannel) => {
    return new Promise(resolve => {
        if (dataChannel === null || dataChannel === void 0 ? void 0 : dataChannel.isOpen()) {
            dataChannel.close();
            resolve();
        }
        else {
            resolve();
        }
    });
};
export const cleanup = () => {
    return new Promise(resolve => {
        try {
            ndc.cleanup();
            resolve();
        }
        catch (err) {
            resolve();
        }
    });
};
//# sourceMappingURL=nodeDataChannel.js.map