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

import isArray from 'lodash/isArray';
import {SendTransactionMethod} from 'youchain-core-method';

export default class SendContractMethod extends SendTransactionMethod {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {TransactionConfirmationWorkflow} transactionConfirmationWorkflow
     * @param {Accounts} accounts
     * @param {TransactionSigner} transactionSigner
     * @param {AllEventsLogDecoder} allEventsLogDecoder
     * @param {AbiModel} abiModel
     *
     * @constructor
     */
    constructor(
        utils,
        formatters,
        transactionConfirmationWorkflow,
        accounts,
        transactionSigner,
        allEventsLogDecoder,
        abiModel
    ) {
        super(utils, formatters, transactionConfirmationWorkflow, accounts, transactionSigner);
        this.allEventsLogDecoder = allEventsLogDecoder;
        this.abiModel = abiModel;
    }

    /**
     * This method will be executed after the RPC request.
     *
     * @method afterExecution
     *
     * @param {Object} response
     *
     * @returns {Object}
     */
    afterExecution(response) {
        if (isArray(response.logs)) {
            response.events = {};

            response.logs.forEach((log, index) => {
                log = this.allEventsLogDecoder.decode(this.abiModel, log);

                if (log.event) {
                    if (response.events[log.event]) {
                        if (isArray(response.events[log.event])) {
                            response.events[log.event].push(log);

                            return;
                        }

                        response.events[log.event] = [response.events[log.event], log];

                        return;
                    }

                    response.events[log.event] = log;

                    return;
                }

                response.events[index] = log;
            });

            delete response.logs;
        }

        return response;
    }
}
