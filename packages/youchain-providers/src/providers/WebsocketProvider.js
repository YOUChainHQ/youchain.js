/*
    This file is part of youchain.js.

    youchain.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    youchain.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with youchain.js.  If not, see <http://www.gnu.org/licenses/>.
*/

import JsonRpcMapper from '../mappers/JsonRpcMapper';
import AbstractSocketProvider from '../../lib/providers/AbstractSocketProvider';
import JsonRpcResponseValidator from '../validators/JsonRpcResponseValidator';
import isArray from 'lodash/isArray';

export default class WebsocketProvider extends AbstractSocketProvider {
    /**
     * @param {WebSocket} connection
     * @param {Number} timeout
     *
     * @constructor
     */
    constructor(connection, timeout) {
        super(connection, timeout);
        this.host = this.connection.url;
    }

    /**
     * This is the listener for the 'message' events of the current socket connection.
     *
     * @method onMessage
     *
     * @param {MessageEvent} messageEvent
     */
    onMessage(messageEvent) {
        super.onMessage(messageEvent.data);
    }

    /**
     * This is the listener for the 'error' event of the current socket connection.
     *
     * @method onError
     *
     * @param {Event} event
     */
    onError(event) {
        if (event.code === 'ECONNREFUSED') {
            this.reconnect();

            return;
        }

        super.onError(event);
    }

    /**
     * This ist the listener for the 'close' event of the current socket connection.
     *
     * @method onClose
     *
     * @param {CloseEvent} closeEvent
     */
    onClose(closeEvent) {
        if (closeEvent.code !== 1000) {
            this.reconnect();

            return;
        }

        super.onClose();
    }

    /**
     * Removes the listeners and reconnects to the socket.
     *
     * @method reconnect
     */
    reconnect() {
        setTimeout(() => {
            this.removeAllSocketListeners();

            let connection = [];

            if (this.connection.constructor.name === 'W3CWebsocket') {
                connection = new this.connection.constructor(
                    this.host,
                    this.connection._client.protocol,
                    null,
                    this.connection._client.headers,
                    this.connection._client.requestOptions,
                    this.connection._client.config
                );
            } else {
                const protocol = this.connection.protocol || undefined;
                connection = new this.connection.constructor(this.host, protocol);
            }

            this.connection = connection;
            this.registerEventListeners();
        }, 5000);
    }

    /**
     * Will close the socket connection with a error code and reason.
     * Please have a look at https://developer.mozilla.org/de/docs/Web/API/WebSocket/close
     * for further information.
     *
     * @method disconnect
     *
     * @param {Number} code
     * @param {String} reason
     */
    disconnect(code = null, reason = null) {
        this.connection.close(code, reason);
    }

    /**
     * Registers all the required listeners.
     *
     * @method registerEventListeners
     */
    registerEventListeners() {
        this.connection.addEventListener('message', this.onMessage.bind(this));
        this.connection.addEventListener('open', this.onReady.bind(this));
        this.connection.addEventListener('open', this.onConnect.bind(this));
        this.connection.addEventListener('close', this.onClose.bind(this));
        this.connection.addEventListener('error', this.onError.bind(this));
    }

    /**
     * Removes all listeners on the EventEmitter and the socket object.
     *
     * @method removeAllListeners
     *
     * @param {String} event
     */
    removeAllListeners(event) {
        switch (event) {
            case this.SOCKET_MESSAGE:
                this.connection.removeEventListener('message', this.onMessage);
                break;
            case this.SOCKET_READY:
                this.connection.removeEventListener('open', this.onReady);
                break;
            case this.SOCKET_CLOSE:
                this.connection.removeEventListener('close', this.onClose);
                break;
            case this.SOCKET_ERROR:
                this.connection.removeEventListener('error', this.onError);
                break;
            case this.SOCKET_CONNECT:
                this.connection.removeEventListener('connect', this.onConnect);
                break;
        }

        super.removeAllListeners(event);
    }

    /**
     * Returns true if the socket connection state is OPEN
     *
     * @property connected
     *
     * @returns {Boolean}
     */
    get connected() {
        return this.connection.readyState === this.connection.OPEN;
    }

    /**
     * Returns if the socket connection is in the connecting state.
     *
     * @method isConnecting
     *
     * @returns {Boolean}
     */
    isConnecting() {
        return this.connection.readyState === this.connection.CONNECTING;
    }

    /**
     * Creates the JSON-RPC payload and sends it to the node.
     *
     * @method send
     *
     * @param {String} method
     * @param {Array} parameters
     *
     * @returns {Promise<Object>}
     */
    send(method, parameters) {
        return this.sendPayload(JsonRpcMapper.toPayload(method, parameters)).then((response) => {
            const validationResult = JsonRpcResponseValidator.validate(response);

            if (validationResult instanceof Error) {
                throw validationResult;
            }

            return response.result;
        });
    }

    /**
     * Creates the JSON-RPC batch payload and sends it to the node.
     *
     * @method sendBatch
     *
     * @param {AbstractMethod[]} methods
     * @param {AbstractYOUChainModule} moduleInstance
     *
     * @returns Promise<Object[]>
     */
    sendBatch(methods, moduleInstance) {
        let payload = [];

        methods.forEach((method) => {
            method.beforeExecution(moduleInstance);
            payload.push(JsonRpcMapper.toPayload(method.rpcMethod, method.parameters));
        });

        return this.sendPayload(payload);
    }

    /**
     * Sends the JSON-RPC payload to the node.
     *
     * @method sendPayload
     *
     * @param {Object} payload
     *
     * @returns {Promise<any>}
     */
    sendPayload(payload) {
        return new Promise((resolve, reject) => {
            if (!this.isConnecting()) {
                let timeout, id;

                if (this.connection.readyState !== this.connection.OPEN) {
                    return reject(new Error('Connection error: Connection is not open on send()'));
                }

                this.connection.send(JSON.stringify(payload));

                if (this.timeout) {
                    timeout = setTimeout(() => {
                        reject(new Error('Connection error: Timeout exceeded'));
                    }, this.timeout);
                }

                if (isArray(payload)) {
                    id = payload[0].id;
                } else {
                    id = payload.id;
                }

                this.once(id, (response) => {
                    if (timeout) {
                        clearTimeout(timeout);
                    }

                    return resolve(response);
                });

                return;
            }

            this.on('connect', () => {
                this.sendPayload(payload)
                    .then(resolve)
                    .catch(reject);

                this.removeAllListeners('connect');
            });
        });
    }
}
