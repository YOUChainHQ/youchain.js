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

import {BN, sha3} from 'youchain-utils';

// $ExpectType string
sha3('234');
// $ExpectType string
sha3(new BN(3));

// $ExpectError
sha3(['string']);
// $ExpectError
sha3(234);
// $ExpectError
sha3([4]);
// $ExpectError
sha3({});
// $ExpectError
sha3(true);
// $ExpectError
sha3(null);
// $ExpectError
sha3(undefined);
