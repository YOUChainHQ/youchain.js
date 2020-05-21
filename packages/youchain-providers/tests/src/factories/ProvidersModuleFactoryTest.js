// Module mocks
import ProvidersModuleFactory from '../../../src/factories/ProvidersModuleFactory';
import BatchRequest from '../../../src/batch-request/BatchRequest';
import ProviderResolver from '../../../src/resolvers/ProviderResolver';
import ProviderDetector from '../../../src/detectors/ProviderDetector';
import HttpProvider from '../../../src/providers/HttpProvider';
import WebsocketProvider from '../../../src/providers/WebsocketProvider';
import IpcProvider from '../../../src/providers/IpcProvider';
import {XMLHttpRequest as XHR} from 'xhr2-cookies';
import {w3cwebsocket as W3CWebsocket} from 'websocket';

jest.mock('xhr2-cookies');
jest.mock('websocket');

// Mocks
jest.mock('../../../src/batch-request/BatchRequest');
jest.mock('../../../src/resolvers/ProviderResolver');
jest.mock('../../../src/detectors/ProviderDetector');
jest.mock('../../../src/providers/HttpProvider');
jest.mock('../../../src/providers/WebsocketProvider');
jest.mock('../../../src/providers/IpcProvider');

/**
 * ProvidersModuleFactory test
 */
describe('ProvidersModuleFactoryTest', () => {
    let providersModuleFactory;

    beforeEach(() => {
        providersModuleFactory = new ProvidersModuleFactory();
    });

    it('createBatchRequest returns instance of BatchRequest', () => {
        expect(providersModuleFactory.createBatchRequest({})).toBeInstanceOf(BatchRequest);
    });

    it('createProviderResolver returns instance of ProviderResolver', () => {
        expect(providersModuleFactory.createProviderResolver()).toBeInstanceOf(ProviderResolver);
    });

    it('createProviderDetector returns instance of ProviderDetector', () => {
        expect(providersModuleFactory.createProviderDetector()).toBeInstanceOf(ProviderDetector);
    });

    it('createHttpProvider returns instance of HttpProvider', () => {
        expect(providersModuleFactory.createHttpProvider('', {})).toBeInstanceOf(HttpProvider);
    });

    it('createXMLHttpRequest returns instance of XMLHttpRequest', () => {
        expect(providersModuleFactory.createXMLHttpRequest('', 0, [{name: 'name', value: 'value'}], {})).toBeInstanceOf(
            XHR
        );

        expect(XHR).toHaveBeenCalledTimes(1);

        const xhrMock = XHR.mock.instances[0];

        expect(xhrMock.nodejsSet).toHaveBeenCalledWith({});

        expect(xhrMock.open).toHaveBeenCalledWith('POST', '', true);

        expect(xhrMock.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json');

        expect(xhrMock.setRequestHeader).toHaveBeenCalledWith('name', 'value');

        expect(xhrMock.timeout).toEqual(0);

        expect(xhrMock.withCredentials).toEqual(true);
    });

    it('createWebsocketProvider returns instance of WebsocketProvider', () => {
        expect(
            providersModuleFactory.createWebsocketProvider('ws://username:password@hallo:5544', {
                protocol: 'string',
                clientConfig: 'string'
            })
        ).toBeInstanceOf(WebsocketProvider);

        expect(W3CWebsocket).toHaveBeenCalledWith(
            'ws://username:password@hallo:5544',
            'string',
            null,
            {authorization: Buffer.from([186, 199, 171, 157, 169, 158, 165, 171, 44, 194, 138, 221])},
            null,
            'string'
        );
    });

    it('createIpcProvider returns instance of IpcProvider', () => {
        const net = {
            connect: jest.fn((path) => {
                expect(path).toEqual({path: 'path'});
            })
        };

        expect(providersModuleFactory.createIpcProvider('path', net)).toBeInstanceOf(IpcProvider);

        expect(net.connect).toHaveBeenCalled();
    });
});
