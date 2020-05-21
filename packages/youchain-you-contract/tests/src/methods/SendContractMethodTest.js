import * as Utils from 'youchain-utils';
import {formatters} from 'youchain-core-helpers';
import {Accounts} from 'youchain-you-accounts';
import {SendTransactionMethod} from 'youchain-core-method';
import TransactionConfirmationWorkflow from '../../__mocks__/TransactionConfirmationWorkflow';
import TransactionSigner from '../../__mocks__/TransactionSigner';
import AllEventsLogDecoder from '../../../src/decoders/AllEventsLogDecoder';
import SendContractMethod from '../../../src/methods/SendContractMethod';
import AbiModel from '../../../src/models/AbiModel';

// Mocks
jest.mock('Utils');
jest.mock('formatters');
jest.mock('Accounts');
jest.mock('../../../src/decoders/AllEventsLogDecoder');
jest.mock('../../../src/models/AbiItemModel');
jest.mock('../../../src/models/AbiModel');

/**
 * SendContractMethod test
 */
describe('SendContractMethodTest', () => {
    let sendContractMethod,
        transactionConfirmationWorkflowMock,
        accountsMock,
        transactionSignerMock,
        allEventsLogDecoderMock,
        abiModelMock;

    beforeEach(() => {
        transactionConfirmationWorkflowMock = new TransactionConfirmationWorkflow();

        new Accounts();
        accountsMock = Accounts.mock.instances[0];

        transactionSignerMock = new TransactionSigner();

        new AbiModel();
        abiModelMock = AbiModel.mock.instances[0];

        new AllEventsLogDecoder();
        allEventsLogDecoderMock = AllEventsLogDecoder.mock.instances[0];

        sendContractMethod = new SendContractMethod(
            Utils,
            formatters,
            transactionConfirmationWorkflowMock,
            accountsMock,
            transactionSignerMock,
            allEventsLogDecoderMock,
            abiModelMock
        );
    });

    it('constructor check', () => {
        expect(sendContractMethod.utils).toEqual(Utils);

        expect(sendContractMethod.formatters).toEqual(formatters);

        expect(sendContractMethod.transactionConfirmationWorkflow).toEqual(transactionConfirmationWorkflowMock);

        expect(sendContractMethod.accounts).toEqual(accountsMock);

        expect(sendContractMethod.transactionSigner).toEqual(transactionSignerMock);

        expect(sendContractMethod.allEventsLogDecoder).toEqual(allEventsLogDecoderMock);

        expect(sendContractMethod.abiModel).toEqual(abiModelMock);

        expect(sendContractMethod).toBeInstanceOf(SendTransactionMethod);
    });

    it('calls afterExecution and returns the expected result', () => {
        const response = {
            logs: [
                {
                    event: false
                },
                {
                    event: 'MyEvent'
                },
                {
                    event: 'MyEvent'
                },
                {
                    event: 'MyEvent'
                }
            ]
        };

        allEventsLogDecoderMock.decode.mockReturnValueOnce({event: false});

        allEventsLogDecoderMock.decode.mockReturnValueOnce({event: 'MyEvent'});

        allEventsLogDecoderMock.decode.mockReturnValueOnce({event: 'MyEvent'});

        allEventsLogDecoderMock.decode.mockReturnValueOnce({event: 'MyEvent'});

        const mappedResponse = sendContractMethod.afterExecution(response);

        expect(mappedResponse).toEqual({
            events: {
                0: {event: false},
                MyEvent: [
                    {
                        event: 'MyEvent'
                    },
                    {
                        event: 'MyEvent'
                    },
                    {
                        event: 'MyEvent'
                    }
                ]
            }
        });

        expect(allEventsLogDecoderMock.decode).toHaveBeenNthCalledWith(1, abiModelMock, {event: false});

        expect(allEventsLogDecoderMock.decode).toHaveBeenNthCalledWith(2, abiModelMock, {event: 'MyEvent'});

        expect(allEventsLogDecoderMock.decode).toHaveBeenNthCalledWith(3, abiModelMock, {event: 'MyEvent'});

        expect(allEventsLogDecoderMock.decode).toHaveBeenNthCalledWith(4, abiModelMock, {event: 'MyEvent'});
    });
});
