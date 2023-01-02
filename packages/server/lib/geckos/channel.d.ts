import * as Types from '@geckos.io/common/lib/types.js';
import type { DataChannel } from '../wrtc/nodeDataChannel.js';
import { Events } from '@yandeu/events';
import WebRTCConnection from '../wrtc/webrtcConnection.js';
export default class ServerChannel {
    webrtcConnection: WebRTCConnection;
    dataChannel: DataChannel;
    dataChannelOptions: Types.ServerOptions;
    userData: any;
    autoManageBuffering: boolean;
    maxMessageSize: number | undefined;
    private _roomId;
    private _id;
    eventEmitter: Events<any>;
    private receivedReliableMessages;
    constructor(webrtcConnection: WebRTCConnection, dataChannel: DataChannel, dataChannelOptions: Types.ServerOptions, userData: any);
    /** Get the channel's id. */
    get id(): Types.ChannelId;
    /** Get the channel's roomId. */
    get roomId(): Types.ChannelId;
    /**
     * Listen for the disconnect event.
     * Gets the connectionState 'disconnected', 'failed' or 'closed'. See https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/connectionState
     * @param callback The connectionState.
     */
    onDisconnect(callback: Types.DisconnectEventCallbackServer): void;
    /** Listen for the drop event. */
    onDrop(callback: (drop: {
        event: Types.EventName;
        data: Types.Data | Types.RawMessage | null;
    }) => void): void;
    /** Close the webRTC connection. */
    close(): Promise<void>;
    /** Join a room by its id. */
    join(roomId: Types.RoomId): void;
    /** Leave the current room. */
    leave(): void;
    /** Emit a message to all channels in the same room. */
    get room(): {
        /**
         * Emit a message to the current room.
         * @param eventName The event name.
         * @param data The data to send.
         */
        emit: (eventName: Types.EventName, data: Types.Data, options?: Types.EmitOptions) => void;
    };
    /** Broadcast a message to all channels in the same room, except the sender's. */
    get broadcast(): {
        /**
         * Emit a broadcasted message.
         * @param eventName The event name.
         * @param data The data to send.
         */
        emit: (eventName: Types.EventName, data: Types.Data, options?: Types.EmitOptions) => void;
    };
    /**
     * Forward a message to all channels in a specific room.
     * @param roomId The roomId.
     */
    forward(roomId: Types.RoomId): {
        /**
         * Emit a forwarded message.
         * @param eventName The event name.
         * @param data The data to send.
         */
        emit: (eventName: Types.EventName, data: Types.Data, options?: Types.EmitOptions) => void;
    };
    /**
     * Emit a message to the channel.
     * @param eventName The event name.
     * @param data The data to send.
     * @param options EmitOptions
     */
    emit(eventName: Types.EventName, data?: Types.Data | null, options?: Types.EmitOptions): void;
    private _emit;
    /** Send a raw message. */
    get raw(): {
        /**
         * Emit a raw message.
         * @param rawMessage The raw message. Can be of type 'USVString | ArrayBuffer | ArrayBufferView'
         */
        emit: (rawMessage: Types.RawMessage) => void;
        room: {
            emit: (rawMessage: Types.RawMessage) => void;
        };
        broadcast: {
            emit: (rawMessage: Types.RawMessage) => void;
        };
    };
    /**
     * Listen for raw messages.
     * @param callback The event callback.
     */
    onRaw(callback: Types.EventCallbackRawMessage): void;
    /**
     * Listen for a message.
     * @param eventName The event name.
     * @param callback The event callback.
     */
    on(eventName: Types.EventName, callback: Types.EventCallbackServer): void;
}
//# sourceMappingURL=channel.d.ts.map