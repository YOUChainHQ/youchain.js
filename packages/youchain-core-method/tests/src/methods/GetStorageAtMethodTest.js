import {formatters} from 'youchain-core-helpers';
import * as Utils from 'youchain-utils';
import AbstractCallMethod from '../../../lib/methods/AbstractCallMethod';
import GetStorageAtMethod from '../../../src/methods/GetStorageAtMethod';

// Mocks
jest.mock('formatters');
jest.mock('Utils');

/**
 * GetStorageAtMethod test
 */
describe('GetStorageAtMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetStorageAtMethod(Utils, formatters);
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractCallMethod);

        expect(method.rpcMethod).toEqual('you_getStorageAt');

        expect(method.parametersAmount).toEqual(3);

        expect(method.utils).toEqual(Utils);

        expect(method.formatters).toEqual(formatters);
    });

    it(
        'beforeExecution should call the formatters.inputAddressFormatter, formatters.inputDefaultBlockNumberFormatter ' +
            'and utils.numberToHex method',
        () => {
            method.parameters = ['string', 100, 100];

            formatters.inputAddressFormatter.mockReturnValue('0x0');

            formatters.inputDefaultBlockNumberFormatter.mockReturnValueOnce('0x0');

            Utils.numberToHex.mockReturnValueOnce('0x0');

            method.beforeExecution({});

            expect(method.parameters[0]).toEqual('0x0');

            expect(method.parameters[1]).toEqual('0x0');

            expect(method.parameters[2]).toEqual('0x0');

            expect(formatters.inputAddressFormatter).toHaveBeenCalledWith('string');

            expect(formatters.inputDefaultBlockNumberFormatter).toHaveBeenCalledWith(100, {});

            expect(Utils.numberToHex).toHaveBeenCalledWith(100);
        }
    );

    it(
        'calls beforeExecution without a callback instead of the optional parameter and should call the inputAddressFormatter, inputDefaultBlockNumberFormatter ' +
            'and numberToHex method',
        () => {
            const callback = jest.fn();
            method.parameters = ['string', 100, callback];

            formatters.inputAddressFormatter.mockReturnValue('0x0');

            formatters.inputDefaultBlockNumberFormatter.mockReturnValueOnce('0x0');

            Utils.numberToHex.mockReturnValueOnce('0x0');

            method.beforeExecution({defaultBlock: 'latest'});

            expect(method.callback).toEqual(callback);

            expect(method.parameters[0]).toEqual('0x0');

            expect(method.parameters[1]).toEqual('0x0');

            expect(method.parameters[2]).toEqual('0x0');

            expect(formatters.inputAddressFormatter).toHaveBeenCalledWith('string');

            expect(formatters.inputDefaultBlockNumberFormatter).toHaveBeenCalledWith('latest', {
                defaultBlock: 'latest'
            });

            expect(Utils.numberToHex).toHaveBeenCalledWith(100);
        }
    );
});
