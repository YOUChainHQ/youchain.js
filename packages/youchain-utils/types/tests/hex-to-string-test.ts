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

import {BN, hexToString} from 'youchain-utils';

// $ExpectType string
hexToString('0x49206861766520313030e282ac');
// $ExpectType string
hexToString(0x49206861766520313030e282ac);

// $ExpectError
hexToString(new BN(3));
// $ExpectError
hexToString(['string']);
// $ExpectError
hexToString([4]);
// $ExpectError
hexToString({});
// $ExpectError
hexToString(true);
// $ExpectError
hexToString(null);
// $ExpectError
hexToString(undefined);
