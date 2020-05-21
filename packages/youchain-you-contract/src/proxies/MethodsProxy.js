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
import isFunction from 'lodash/isFunction';

export default class MethodsProxy {
    /**
     * @param {AbstractContract} contract
     * @param {AbiModel} abiModel
     * @param {MethodFactory} methodFactory
     * @param {MethodEncoder} methodEncoder
     * @param {MethodOptionsValidator} methodOptionsValidator
     * @param {MethodOptionsMapper} methodOptionsMapper
     * @param {PromiEvent} PromiEvent
     *
     * @constructor
     */
    constructor(
        contract,
        abiModel,
        methodFactory,
        methodEncoder,
        methodOptionsValidator,
        methodOptionsMapper,
        PromiEvent
    ) {
        this.contract = contract;
        this.abiModel = abiModel;
        this.methodFactory = methodFactory;
        this.methodEncoder = methodEncoder;
        this.methodOptionsValidator = methodOptionsValidator;
        this.methodOptionsMapper = methodOptionsMapper;
        this.PromiEvent = PromiEvent;

        return new Proxy(this, {
            /**
             * Checks if a contract event exists by the given name and
             * returns the subscription otherwise it throws an error
             *
             * @param {MethodsProxy} target
             * @param {String} name
             *
             * @returns {Function|Error}
             */
            get: (target, name) => {
                if (this.abiModel.hasMethod(name)) {
                    let abiItemModel = this.abiModel.getMethod(name);

                    let requestType = abiItemModel.requestType;

                    // TODO: Improve the requestType detection and defining of the call/send method.
                    if (isArray(abiItemModel)) {
                        requestType = abiItemModel[0].requestType;
                    }

                    // TODO: Find a better solution for the handling of the contractMethodParameters
                    /* eslint-disable no-inner-declarations */
                    function anonymousFunction() {
                        let methodArguments = [...arguments];

                        // Because of the possibility to overwrite the contract data if I call contract.deploy()
                        // have I to check here if it is a contract deployment. If this call is a contract deployment
                        // then I have to set the right contract data and to map the arguments.
                        // TODO: Change API or improve this
                        if (!isArray(abiItemModel) && abiItemModel.isOfType('constructor')) {
                            if (methodArguments[0]['data']) {
                                target.contract.options.data = methodArguments[0]['data'];
                            }

                            if (methodArguments[0]['arguments']) {
                                abiItemModel.contractMethodParameters = methodArguments[0]['arguments'];
                            }

                            return anonymousFunction;
                        }

                        // If there exists more than one method with this name then find the correct abiItemModel
                        if (isArray(abiItemModel)) {
                            const abiItemModelFound = abiItemModel.some((model) => {
                                model.contractMethodParameters = methodArguments;

                                try {
                                    model.givenParametersLengthIsValid();
                                } catch (error) {
                                    return false;
                                }

                                abiItemModel = model;
                                return true;
                            });

                            if (!abiItemModelFound) {
                                throw new Error(`Methods with name "${name}" found but the given parameters are wrong`);
                            }

                            return anonymousFunction;
                        }

                        abiItemModel.contractMethodParameters = methodArguments;

                        return anonymousFunction;
                    }

                    anonymousFunction[requestType] = function() {
                        if (abiItemModel.isOfType('constructor')) {
                            return target.executeMethod(abiItemModel, arguments, 'contract-deployment');
                        }

                        return target.executeMethod(abiItemModel, arguments, requestType);
                    };

                    anonymousFunction[requestType].request = function() {
                        return target.createMethod(abiItemModel, arguments, requestType);
                    };

                    anonymousFunction.estimateGas = function() {
                        return target.executeMethod(abiItemModel, arguments, 'estimate');
                    };

                    anonymousFunction.encodeABI = function() {
                        return target.methodEncoder.encode(abiItemModel, target.contract.options.data);
                    };

                    return anonymousFunction;
                    /* eslint-enable no-inner-declarations */
                }

                if (target[name]) {
                    return target[name];
                }
            }
        });
    }

    /**
     * Executes the RPC method with the methodController
     *
     * @param {AbiItemModel} abiItemModel
     * @param {IArguments} methodArguments
     * @param {String} requestType
     *
     * @returns {Promise|PromiEvent|String|Boolean}
     */
    executeMethod(abiItemModel, methodArguments, requestType) {
        let method;

        try {
            method = this.createMethod(abiItemModel, methodArguments, requestType);
        } catch (error) {
            const promiEvent = new this.PromiEvent();

            method = this.methodFactory.createMethodByRequestType(abiItemModel, this.contract, requestType);
            method.arguments = methodArguments;

            promiEvent.reject(error);
            promiEvent.emit('error', error);

            if (isFunction(method.callback)) {
                method.callback(error, null);
            }

            return promiEvent;
        }

        if (requestType === 'call' || requestType === 'estimate') {
            return method.execute(this.contract);
        }

        // TODO: The promiEvent will just be used for send methods I could move this logic directly to the AbstractSendMethod
        // TODO: Because of this I could remove the promievent module because it's just used in the SendTransaction- & SendRawTransaction method.
        return method.execute(this.contract, new this.PromiEvent());
    }

    /**
     * Creates the rpc method, encodes the contract method and validate the objects.
     *
     * @param {AbiItemModel} abiItemModel
     * @param {IArguments} methodArguments
     * @param {String} requestType
     *
     * @returns {AbstractMethod}
     */
    createMethod(abiItemModel, methodArguments, requestType) {
        abiItemModel.givenParametersLengthIsValid();

        // Get correct rpc method model
        const method = this.methodFactory.createMethodByRequestType(abiItemModel, this.contract, requestType);
        method.arguments = methodArguments;

        // If no parameters are given for the you_call or you_send* methods then it will set a empty options object.
        if (!method.parameters[0]) {
            method.parameters[0] = {};
        }

        // Encode contract method
        method.parameters[0]['data'] = this.methodEncoder.encode(abiItemModel, this.contract.options.data);

        // Set default options in the TxObject if required
        method.parameters[0] = this.methodOptionsMapper.map(this.contract, method.parameters[0]);

        // Validate TxObject
        this.methodOptionsValidator.validate(abiItemModel, method);

        return method;
    }
}
