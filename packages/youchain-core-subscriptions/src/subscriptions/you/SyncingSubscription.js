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

import AbstractSubscription from '../../../lib/subscriptions/AbstractSubscription';

export default class SyncingSubscription extends AbstractSubscription {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {AbstractYOUChainModule} moduleInstance
     *
     * @constructor
     */
    constructor(utils, formatters, moduleInstance) {
        super('you_subscribe', 'syncing', null, utils, formatters, moduleInstance);
        this.isSyncing = null;
    }

    /**
     * This method will be executed on each new subscription item.
     *
     * @method onNewSubscriptionItem
     *
     * @param {any} subscriptionItem
     *
     * @returns {Object}
     */
    onNewSubscriptionItem(subscriptionItem) {
        const isSyncing = subscriptionItem.result.syncing;

        if (this.isSyncing === null) {
            this.isSyncing = isSyncing;
            this.emit('changed', this.isSyncing);
        }

        if (this.isSyncing === true && isSyncing === false) {
            this.isSyncing = isSyncing;
            this.emit('changed', this.isSyncing);
        }

        if (this.isSyncing === false && isSyncing === true) {
            this.isSyncing = isSyncing;
            this.emit('changed', this.isSyncing);
        }

        return this.formatters.outputSyncingFormatter(subscriptionItem);
    }
}
