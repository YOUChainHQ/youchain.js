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

export default class EventLogDecoder {
    /**
     * @param {AbiCoder} abiCoder
     *
     * @constructor
     */
    constructor(abiCoder) {
        this.abiCoder = abiCoder;
    }

    /**
     * Decodes the event subscription response
     *
     * @method decode
     *
     * @param {AbiItemModel} abiItemModel
     * @param {Object} response
     *
     * @returns {Object}
     */
    decode(abiItemModel, response) {
        let argTopics = response.topics;

        if (!abiItemModel.anonymous) {
            argTopics = response.topics.slice(1);
        }

        response.returnValues = this.abiCoder.decodeLog(abiItemModel.getInputs(), response.data, argTopics);
        response.event = abiItemModel.name;
        response.signature = abiItemModel.signature;
        response.raw = {
            data: response.data,
            topics: response.topics
        };

        if (abiItemModel.anonymous || !response.topics[0]) {
            response.signature = null;
        }

        delete response.data;
        delete response.topics;

        return response;
    }
}
