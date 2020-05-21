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

import {Network} from 'youchain-net';

const network = new Network('http://localhost:5000');

// $ExpectType Promise<string>
network.getNetworkType((error, returnValue) => {
    console.log(returnValue);
});

// $ExpectType Promise<number>
network.getId();
// $ExpectType Promise<number>
network.getId((error: Error, id: number) => {
    console.log(id);
});

// $ExpectType Promise<boolean>
network.isListening();
// $ExpectType Promise<boolean>
network.isListening((error: Error, listening: boolean) => {
    console.log(listening);
});

// $ExpectType Promise<number>
network.getPeerCount();
// $ExpectType Promise<number>
network.getPeerCount((error: Error, peerCount: number) => {
    console.log(peerCount);
});

// $ExpectType Promise<number[]>
network.listShards();
// $ExpectType Promise<number[]>
network.listShards((error: Error, shards: number[]) => {
    console.log(shards);
});
