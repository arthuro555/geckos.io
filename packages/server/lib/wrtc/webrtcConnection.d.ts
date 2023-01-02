/// <reference types="node" />
import { PeerConnection, RtcConfig } from './nodeDataChannel.js';
import Channel from '../geckos/channel.js';
import { ChannelId } from '@geckos.io/common/lib/types.js';
import EventEmitter from 'events';
export default class WebRTCConnection extends EventEmitter {
    id: string;
    configuration: RtcConfig;
    connections: Map<ChannelId, WebRTCConnection>;
    userData: any;
    state: 'open' | 'closed';
    peerConnection: PeerConnection;
    channel: Channel;
    additionalCandidates: RTCIceCandidate[];
    private options;
    constructor(id: string, configuration: RtcConfig, connections: Map<ChannelId, WebRTCConnection>, userData: any);
    init(): Promise<PeerConnection>;
    close(state?: string): Promise<void>;
}
//# sourceMappingURL=webrtcConnection.d.ts.map