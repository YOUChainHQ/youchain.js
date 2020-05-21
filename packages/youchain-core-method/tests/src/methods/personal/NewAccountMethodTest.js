import * as Utils from 'youchain-utils';
import AbstractCallMethod from '../../../../lib/methods/AbstractCallMethod';
import NewAccountMethod from '../../../../src/methods/personal/NewAccountMethod';

// Mocks
jest.mock('Utils');

/**
 * NewAccountMethod test
 */
describe('NewAccountMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new NewAccountMethod(Utils, null);
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractCallMethod);

        expect(method.rpcMethod).toEqual('personal_newAccount');

        expect(method.parametersAmount).toEqual(1);

        expect(method.utils).toEqual(Utils);

        expect(method.formatters).toEqual(null);
    });

    it('afterExecution should map the response', () => {
        Utils.toChecksumAddress.mockReturnValueOnce('0x0');

        expect(method.afterExecution('0x0')).toEqual('0x0');

        expect(Utils.toChecksumAddress).toHaveBeenCalledWith('0x0');
    });
});
