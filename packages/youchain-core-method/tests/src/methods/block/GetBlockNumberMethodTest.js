import * as Utils from 'youchain-utils';
import AbstractCallMethod from '../../../../lib/methods/AbstractCallMethod';
import GetBlockNumberMethod from '../../../../src/methods/block/GetBlockNumberMethod';

// Mocks
jest.mock('Utils');

/**
 * GetBlockNumberMethod test
 */
describe('GetBlockNumberMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetBlockNumberMethod(Utils, null);
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractCallMethod);

        expect(method.rpcMethod).toEqual('you_blockNumber');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(Utils);

        expect(method.formatters).toEqual(null);
    });

    it('afterExecution should map theresponse', () => {
        Utils.hexToNumber.mockReturnValueOnce(100);

        expect(method.afterExecution('0x0')).toEqual(100);

        expect(Utils.hexToNumber).toHaveBeenCalledWith('0x0');
    });
});
