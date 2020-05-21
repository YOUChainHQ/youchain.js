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

import {BN, stringToHex} from 'youchain-utils';

// $ExpectType string
stringToHex('I have 100£');

// $ExpectError
stringToHex(232);
// $ExpectError
stringToHex(new BN(3));
// $ExpectError
stringToHex(['string']);
// $ExpectError
stringToHex([4]);
// $ExpectError
stringToHex({});
// $ExpectError
stringToHex(true);
// $ExpectError
stringToHex(null);
// $ExpectError
stringToHex(undefined);
