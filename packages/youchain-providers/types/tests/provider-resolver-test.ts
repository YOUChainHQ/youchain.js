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

import * as net from 'net';
import {ProviderResolver, ProvidersModuleFactory, HttpProvider} from 'youchain-providers';

const options = {
    timeout: 20000,
    headers: [
        {
            name: 'Access-Control-Allow-Origin',
            value: '*'
        }
    ]
};
const provider = new HttpProvider('http://localhost:8283', options);

const providersModuleFactory = new ProvidersModuleFactory();
const providerResolver = new ProviderResolver(providersModuleFactory);

// $ExpectType provider
providerResolver.resolve(provider, new net.Socket());
