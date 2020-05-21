import {formatters} from 'youchain-core-helpers';
import UnlockAccountMethod from '../../../../src/methods/personal/UnlockAccountMethod';
import AbstractCallMethod from '../../../../lib/methods/AbstractCallMethod';

// Mocks
jest.mock('formatters');

/**
 * UnlockAccountMethod test
 */
describe('UnlockAccountMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new UnlockAccountMethod(null, formatters);
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractCallMethod);

        expect(method.rpcMethod).toEqual('personal_unlockAccount');

        expect(method.parametersAmount).toEqual(3);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });

    it('beforeExecution should call inputSignFormatter and inputAddressFormatter', () => {
        method.parameters = ['0x0'];

        formatters.inputAddressFormatter.mockReturnValueOnce('0x00');

        method.beforeExecution();

        expect(formatters.inputAddressFormatter).toHaveBeenCalledWith('0x0');

        expect(method.parameters[0]).toEqual('0x00');
    });
});
