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

import isFunction from 'lodash/isFunction';
import AbstractCallMethod from '../../../lib/methods/AbstractCallMethod';

export default class GetTransactionCountMethod extends AbstractCallMethod {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     *
     * @constructor
     */
    constructor(utils, formatters) {
        super('you_getTransactionCount', 2, utils, formatters);
    }

    /**
     * This method will be executed before the effective execution.
     *
     * @method beforeExecution
     *
     * @param {AbstractYOUChainModule} moduleInstance
     */
    beforeExecution(moduleInstance) {
        this.parameters[0] = this.formatters.inputAddressFormatter(this.parameters[0]);

        // Optional second parameter 'defaultBlock' could also be the callback
        if (isFunction(this.parameters[1])) {
            this.callback = this.parameters[1];
            this.parameters[1] = moduleInstance.defaultBlock;
        }

        this.parameters[1] = this.formatters.inputDefaultBlockNumberFormatter(this.parameters[1], moduleInstance);
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
