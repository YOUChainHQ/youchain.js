import {AbstractYOUChainModule} from 'youchain-core';
import {PromiEvent} from 'youchain-core-promievent';
import MethodProxy from '../../../src/proxy/MethodProxy';
import AbstractMethodFactory from '../../../lib/factories/AbstractMethodFactory';
import AbstractMethod from '../../../lib/methods/AbstractMethod';

// Mocks
jest.mock('AbstractYOUChainModule');
jest.mock('PromiEvent');
jest.mock('../../../lib/factories/AbstractMethodFactory');
jest.mock('../../../lib/methods/AbstractMethod');

/**
 * MethodProxy test
 */
describe('MethodProxyTest', () => {
    let methodProxy, moduleInstanceMock, methodFactoryMock, methodMock;

    beforeEach(() => {
        new AbstractMethodFactory({}, {}, {}, {});
        methodFactoryMock = AbstractMethodFactory.mock.instances[0];

        new AbstractYOUChainModule();
        moduleInstanceMock = AbstractYOUChainModule.mock.instances[0];

        new AbstractMethod('TEST', 0, {}, {}, {});
        methodMock = AbstractMethod.mock.instances[0];
    });

    it('methodProxy return property from target', () => {
        moduleInstanceMock.defaultGasPrice = 100;

        methodFactoryMock.hasMethod.mockReturnValueOnce(false);

        methodProxy = new MethodProxy(moduleInstanceMock, methodFactoryMock);

        expect(methodProxy.defaultGasPrice).toEqual(100);

        expect(methodFactoryMock.hasMethod).toHaveBeenCalledWith('defaultGasPrice');
    });

    it('methodProxy throws error because the property is defined on the target and as method', () => {
        moduleInstanceMock.myMethod = 100;

        methodFactoryMock.hasMethod.mockReturnValueOnce(true);

        methodProxy = new MethodProxy(moduleInstanceMock, methodFactoryMock);

        try {
            /* eslint-disable no-unused-vars */
            const test = methodProxy.myMethod;
            /* eslint-enable no-unused-vars */
        } catch (error) {
            expect(methodFactoryMock.hasMethod).toHaveBeenCalledWith('myMethod');

            expect(error.message).toEqual(
                'Duplicated method myMethod. This method is defined as RPC call and as Object method.'
            );
        }
    });

    it('the methodProxy executes the AbstractCallMethod myMethod and it returns the expected value', () => {
        methodMock.parameters = [];
        methodMock.parametersAmount = 0;

        methodMock.execute.mockReturnValueOnce(100);
        methodMock.Type = 'CALL';

        methodFactoryMock.hasMethod.mockReturnValueOnce(true);

        methodFactoryMock.createMethod.mockReturnValueOnce(methodMock);

        methodProxy = new MethodProxy(moduleInstanceMock, methodFactoryMock);

        const response = methodProxy.myMethod();

        expect(response).toEqual(100);

        expect(methodFactoryMock.hasMethod).toHaveBeenCalledWith('myMethod');

        expect(methodFactoryMock.createMethod).toHaveBeenCalledWith('myMethod');

        expect(methodMock.execute).toHaveBeenCalledWith(moduleInstanceMock);
    });

    it('calls the AbstractSendMethod myMethod and returns the expected value', () => {
        methodMock.parameters = [];
        methodMock.parametersAmount = 0;

        methodMock.execute.mockReturnValueOnce(100);
        methodMock.Type = 'SEND';

        methodFactoryMock.hasMethod.mockReturnValueOnce(true);

        methodFactoryMock.createMethod.mockReturnValueOnce(methodMock);

        methodProxy = new MethodProxy(moduleInstanceMock, methodFactoryMock);

        const response = methodProxy.myMethod();

        expect(response).toEqual(100);

        expect(methodFactoryMock.hasMethod).toHaveBeenCalledWith('myMethod');

        expect(methodFactoryMock.createMethod).toHaveBeenCalledWith('myMethod');

        expect(methodMock.execute).toHaveBeenCalledWith(moduleInstanceMock, PromiEvent.mock.instances[0]);
    });

    it('methodProxy throws error because of invalid parameter length', () => {
        methodMock.parameters = [];
        methodMock.parametersAmount = 2;

        methodMock.execute.mockReturnValueOnce(100);

        methodFactoryMock.hasMethod.mockReturnValueOnce(true);

        methodFactoryMock.createMethod.mockReturnValueOnce(methodMock);

        methodProxy = new MethodProxy(moduleInstanceMock, methodFactoryMock);

        try {
            methodProxy.myMethod();
        } catch (error) {
            expect(methodFactoryMock.hasMethod).toHaveBeenCalledWith('myMethod');

            expect(methodFactoryMock.createMethod).toHaveBeenCalledWith('myMethod');

            expect(error.message).toEqual('Invalid parameters length the expected length would be 2 and not 0');
        }
    });
});
