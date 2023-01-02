import type { DataChannel, DataChannelInitConfig, PeerConnection, RtcConfig } from 'node-datachannel';
export type { DataChannel, DataChannelInitConfig, PeerConnection, RtcConfig };
export declare const wait: (ms?: number) => Promise<void>;
export declare const createDataChannel: (pc: PeerConnection, label: string, config?: DataChannelInitConfig | undefined) => Promise<DataChannel>;
export declare const createPeerConnection: (peerName: string, config: RtcConfig) => Promise<PeerConnection>;
export declare const closePeerConnection: (peerConnection: PeerConnection) => Promise<void>;
export declare const closeDataChannel: (dataChannel: DataChannel) => Promise<void>;
export declare const cleanup: () => Promise<void>;
//# sourceMappingURL=nodeDataChannel.d.ts.map