import { ERRORS, EVENTS } from '@geckos.io/common/lib/constants.js';
import { Events } from '@yandeu/events';
import ParseMessage from '@geckos.io/common/lib/parseMessage.js';
import SendMessage from '@geckos.io/common/lib/sendMessage.js';
import bridge from '@geckos.io/common/lib/bridge.js';
import { makeReliable } from '@geckos.io/common/lib/reliableMessage.js';
export default class ServerChannel {
    constructor(webrtcConnection, dataChannel, dataChannelOptions, userData) {
        this.webrtcConnection = webrtcConnection;
        this.dataChannel = dataChannel;
        this.dataChannelOptions = dataChannelOptions;
        this.userData = userData;
        // private dataChannel: RTCDataChannel
        this.eventEmitter = new Events();
        // stores all reliable messages for about 15 seconds
        this.receivedReliableMessages = [];
        this._id = webrtcConnection.id;
        this._roomId = undefined;
        const { autoManageBuffering = true
        // maxPacketLifeTime = undefined,
        // maxRetransmits = 0,
         } = dataChannelOptions;
        this.autoManageBuffering = autoManageBuffering;
        this.dataChannel.onOpen(() => {
            this.dataChannel.onMessage(msg => {
                const { key, data } = ParseMessage(msg);
                this.eventEmitter.emit(key, data);
            });
            bridge.emit(EVENTS.CONNECTION, this);
        });
        this.dataChannel.onClosed(() => {
            // this.eventEmitter.removeAllListeners()
        });
    }
    /** Get the channel's id. */
    get id() {
        return this._id;
    }
    /** Get the channel's roomId. */
    get roomId() {
        return this._roomId;
    }
    /**
     * Listen for the disconnect event.
     * Gets the connectionState 'disconnected', 'failed' or 'closed'. See https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/connectionState
     * @param callback The connectionState.
     */
    onDisconnect(callback) {
        this.eventEmitter.on(EVENTS.DISCONNECT, (connectionState) => {
            const cb = connectionState => callback(connectionState);
            cb(connectionState);
        });
    }
    /** Listen for the drop event. */
    onDrop(callback) {
        this.eventEmitter.on(EVENTS.DROP, (drop) => {
            callback(drop);
        });
    }
    /** Close the webRTC connection. */
    async close() {
        const connection = this.webrtcConnection.connections.get(this.id);
        if (connection)
            await connection.close();
        else
            console.log('connection not found!');
    }
    /** Join a room by its id. */
    join(roomId) {
        this._roomId = roomId;
    }
    /** Leave the current room. */
    leave() {
        this._roomId = undefined;
    }
    /** Emit a message to all channels in the same room. */
    get room() {
        return {
            /**
             * Emit a message to the current room.
             * @param eventName The event name.
             * @param data The data to send.
             */
            emit: (eventName, data, options) => {
                this.webrtcConnection.connections.forEach((connection) => {
                    const { channel } = connection;
                    const { roomId } = channel;
                    if (roomId === this._roomId) {
                        if (options && options.reliable) {
                            makeReliable(options, (id) => channel.emit(eventName, {
                                MESSAGE: data,
                                RELIABLE: 1,
                                ID: id
                            }));
                        }
                        else {
                            channel.emit(eventName, data);
                        }
                    }
                });
            }
        };
    }
    /** Broadcast a message to all channels in the same room, except the sender's. */
    get broadcast() {
        return {
            /**
             * Emit a broadcasted message.
             * @param eventName The event name.
             * @param data The data to send.
             */
            emit: (eventName, data, options) => {
                this.webrtcConnection.connections.forEach((connection) => {
                    const { channel } = connection;
                    const { roomId, id } = channel;
                    if (roomId === this._roomId && id !== this._id) {
                        if (options && options.reliable) {
                            makeReliable(options, (id) => channel.emit(eventName, {
                                MESSAGE: data,
                                RELIABLE: 1,
                                ID: id
                            }));
                        }
                        else {
                            channel.emit(eventName, data);
                        }
                    }
                });
            }
        };
    }
    /**
     * Forward a message to all channels in a specific room.
     * @param roomId The roomId.
     */
    forward(roomId) {
        return {
            /**
             * Emit a forwarded message.
             * @param eventName The event name.
             * @param data The data to send.
             */
            emit: (eventName, data, options) => {
                this.webrtcConnection.connections.forEach((connection) => {
                    const { channel } = connection;
                    const { roomId: channelRoomId } = channel;
                    if (roomId === channelRoomId) {
                        if (options && options.reliable) {
                            makeReliable(options, (id) => channel.eventEmitter.emit(eventName, {
                                MESSAGE: data,
                                RELIABLE: 1,
                                ID: id
                            }, this._id));
                        }
                        else {
                            channel.eventEmitter.emit(eventName, data, this._id);
                        }
                    }
                });
            }
        };
    }
    /**
     * Emit a message to the channel.
     * @param eventName The event name.
     * @param data The data to send.
     * @param options EmitOptions
     */
    emit(eventName, data = null, options) {
        if (options && options.reliable) {
            makeReliable(options, (id) => this._emit(eventName, {
                MESSAGE: data,
                RELIABLE: 1,
                ID: id
            }));
        }
        else {
            this._emit(eventName, data);
        }
    }
    _emit(eventName, data = null) {
        if (!this._roomId || this._roomId === this._roomId)
            if (!this._id || this._id === this._id) {
                if (!this.dataChannel)
                    return;
                const isReliable = data && typeof data === 'object' && 'RELIABLE' in data;
                const buffering = this.autoManageBuffering && +this.dataChannel.bufferedAmount() > 0;
                const drop = (reason, event, data) => {
                    this.eventEmitter.emit(EVENTS.DROP, { reason, event, data });
                };
                // server should never buffer, geckos.io wants to send messages as fast as possible
                if (isReliable || !buffering) {
                    const error = SendMessage(this.dataChannel, this.maxMessageSize, eventName, data);
                    if (error)
                        drop(ERRORS.MAX_MESSAGE_SIZE_EXCEEDED, eventName, data);
                }
                else {
                    drop(ERRORS.DROPPED_FROM_BUFFERING, eventName, data);
                }
            }
    }
    /** Send a raw message. */
    get raw() {
        return {
            /**
             * Emit a raw message.
             * @param rawMessage The raw message. Can be of type 'USVString | ArrayBuffer | ArrayBufferView'
             */
            emit: (rawMessage) => this.emit(EVENTS.RAW_MESSAGE, rawMessage),
            room: { emit: (rawMessage) => this.room.emit(EVENTS.RAW_MESSAGE, rawMessage) },
            broadcast: { emit: (rawMessage) => this.broadcast.emit(EVENTS.RAW_MESSAGE, rawMessage) }
        };
    }
    /**
     * Listen for raw messages.
     * @param callback The event callback.
     */
    onRaw(callback) {
        this.eventEmitter.on(EVENTS.RAW_MESSAGE, (rawMessage) => {
            const cb = (rawMessage) => callback(rawMessage);
            cb(rawMessage);
        });
    }
    /**
     * Listen for a message.
     * @param eventName The event name.
     * @param callback The event callback.
     */
    on(eventName, callback) {
        this.eventEmitter.on(eventName, (data, senderId = undefined) => {
            const cb = (data, senderId) => callback(data, senderId);
            // check if message is reliable
            // and reject it if it has already been submitted
            const isReliableMessage = data && data.RELIABLE === 1 && data.ID !== 'undefined';
            const expireTime = 15000; // 15 seconds
            const deleteExpiredReliableMessages = () => {
                const currentTime = new Date().getTime();
                this.receivedReliableMessages.forEach((msg, index, object) => {
                    if (msg.expire <= currentTime) {
                        object.splice(index, 1);
                    }
                });
            };
            if (isReliableMessage) {
                deleteExpiredReliableMessages();
                if (this.receivedReliableMessages.filter(obj => obj.id === data.ID).length === 0) {
                    this.receivedReliableMessages.push({
                        id: data.ID,
                        timestamp: new Date(),
                        expire: new Date().getTime() + expireTime
                    });
                    cb(data.MESSAGE, senderId);
                }
                else {
                    // reject message
                }
            }
            else {
                cb(data, senderId);
            }
        });
    }
}
//# sourceMappingURL=channel.js.map