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

import AbstractCallMethod from '../../../lib/methods/AbstractCallMethod';

export default class GetBlockTransactionCountMethod extends AbstractCallMethod {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     *
     * @constructor
     */
    constructor(utils, formatters) {
        super('you_getBlockTransactionCountByNumber', 1, utils, formatters);
    }

    /**
     * This method will be executed before the RPC request.
     *
     * @method beforeExecution
     *
     * @param {AbstractYOUChainModule} moduleInstance
     */
    beforeExecution(moduleInstance) {
        if (this.isHash(this.parameters[0])) {
            this.rpcMethod = 'you_getBlockTransactionCountByHash';
        }

        this.parameters[0] = this.formatters.inputBlockNumberFormatter(this.parameters[0]);
    }

    /**
     * This method will be executed after the RPC request.
     *
     * @method afterExecution
     *
     * @param {Object} response
     *
     * @returns {Number}
     */
    afterExecution(response) {
        return this.utils.hexToNumber(response);
    }
}
