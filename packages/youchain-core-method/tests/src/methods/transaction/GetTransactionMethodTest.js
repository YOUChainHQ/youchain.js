import {formatters} from 'youchain-core-helpers';
import GetTransactionMethod from '../../../../src/methods/transaction/GetTransactionMethod';
import AbstractCallMethod from '../../../../lib/methods/AbstractCallMethod';

// Mocks
jest.mock('formatters');

/**
 * GetTransactionMethod test
 */
describe('GetTransactionMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetTransactionMethod(null, formatters);
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractCallMethod);

        expect(method.rpcMethod).toEqual('you_getTransactionByHash');

        expect(method.parametersAmount).toEqual(1);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });

    it('afterExecution should map the response', () => {
        formatters.outputTransactionFormatter.mockReturnValueOnce({empty: false});

        expect(method.afterExecution({})).toHaveProperty('empty', false);

        expect(formatters.outputTransactionFormatter).toHaveBeenCalledWith({});
    });
});
