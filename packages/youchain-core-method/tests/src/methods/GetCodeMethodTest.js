import {formatters} from 'youchain-core-helpers';
import AbstractCallMethod from '../../../lib/methods/AbstractCallMethod';
import GetCodeMethod from '../../../src/methods/GetCodeMethod';

// Mocks
jest.mock('formatters');

/**
 * GetCodeMethod test
 */
describe('GetCodeMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetCodeMethod(null, formatters);
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractCallMethod);

        expect(method.rpcMethod).toEqual('you_getCode');

        expect(method.parametersAmount).toEqual(2);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });

    it('beforeExecution should call the inputAddressFormatter and inputDefaultBlockNumberFormatter method', () => {
        method.parameters = ['string', 100];

        formatters.inputAddressFormatter.mockReturnValueOnce('0x0');

        formatters.inputDefaultBlockNumberFormatter.mockReturnValueOnce('0x0');

        method.beforeExecution({});

        expect(method.parameters[0]).toEqual('0x0');

        expect(method.parameters[1]).toEqual('0x0');

        expect(formatters.inputAddressFormatter).toHaveBeenCalledWith('string');

        expect(formatters.inputDefaultBlockNumberFormatter).toHaveBeenCalledWith(100, {});
    });

    it('calls beforeExecution without a callback instead of the optional parameter', () => {
        const callback = jest.fn();
        method.parameters = ['string', callback];

        formatters.inputAddressFormatter.mockReturnValueOnce('0x0');

        formatters.inputDefaultBlockNumberFormatter.mockReturnValueOnce('0x0');

        method.beforeExecution({defaultBlock: 'latest'});

        expect(method.callback).toEqual(callback);

        expect(method.parameters[0]).toEqual('0x0');

        expect(method.parameters[1]).toEqual('0x0');

        expect(formatters.inputAddressFormatter).toHaveBeenCalledWith('string');

        expect(formatters.inputDefaultBlockNumberFormatter).toHaveBeenCalledWith('latest', {defaultBlock: 'latest'});
    });
});
