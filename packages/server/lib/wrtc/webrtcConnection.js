import { closeDataChannel, closePeerConnection, createPeerConnection } from './nodeDataChannel.js';
import { EVENTS } from '@geckos.io/common/lib/constants.js';
import EventEmitter from 'events';
import { promiseWithTimeout } from '@geckos.io/common/lib/helpers.js';
// strangely something it takes a long time
// so I set it to 10 seconds
const TIME_TO_HOST_CANDIDATES = 10000;
export default class WebRTCConnection extends EventEmitter {
    constructor(id, configuration, connections, userData) {
        super();
        this.id = id;
        this.configuration = configuration;
        this.connections = connections;
        this.userData = userData;
        this.additionalCandidates = [];
        this.state = 'open';
        this.options = {
            timeToHostCandidates: TIME_TO_HOST_CANDIDATES
        };
    }
    async init() {
        this.peerConnection = await promiseWithTimeout(createPeerConnection(this.id, this.configuration), 2000);
        return this.peerConnection;
    }
    async close(state = 'closed') {
        await promiseWithTimeout(closeDataChannel(this.channel.dataChannel), 2000);
        await promiseWithTimeout(closePeerConnection(this.peerConnection), 2000);
        // @ts-ignore
        this.channel.dataChannel = null;
        // @ts-ignore
        this.peerConnection = null;
        this.channel.eventEmitter.on(EVENTS.DISCONNECT, () => {
            this.removeAllListeners();
            this.channel.eventEmitter.removeAllListeners();
        });
        this.channel.eventEmitter.emit(EVENTS.DISCONNECT, state);
        if (this.connections.has(this.id))
            this.connections.delete(this.id);
    }
}
//# sourceMappingURL=webrtcConnection.js.map