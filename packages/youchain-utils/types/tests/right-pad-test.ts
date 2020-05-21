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

import {BN, rightPad} from 'youchain-utils';

const bigNumber = new BN(3);

// $ExpectType string
rightPad('0x3456ff', 20);
// $ExpectType string
rightPad(0x3456ff, 20);
// $ExpectType string
rightPad('Hello', 20, 'x');

// $ExpectError
rightPad(bigNumber, 20);
// $ExpectError
rightPad(['string'], 20);
// $ExpectError
rightPad([4], 20);
// $ExpectError
rightPad({}, 20);
// $ExpectError
rightPad(true, 20);
// $ExpectError
rightPad(null, 20);
// $ExpectError
rightPad(undefined, 20);
// $ExpectError
rightPad('0x3456ff', bigNumber);
// $ExpectError
rightPad('0x3456ff', ['string']);
// $ExpectError
rightPad('0x3456ff', [4]);
// $ExpectError
rightPad('0x3456ff', {});
// $ExpectError
rightPad('0x3456ff', true);
// $ExpectError
rightPad('0x3456ff', null);
// $ExpectError
rightPad('0x3456ff', undefined);
// $ExpectError
rightPad('Hello', 20, bigNumber);
// $ExpectError
rightPad('Hello', 20, ['string']);
// $ExpectError
rightPad('Hello', 20, [4]);
// $ExpectError
rightPad('Hello', 20, {});
// $ExpectError
rightPad('Hello', 20, true);
// $ExpectError
rightPad('Hello', 20, null);
