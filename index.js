/* eslint-disable key-spacing */

class HistoryCounter {
    constructor(opts) {
        this.history  = [];
        this.counters = {};
        this.historyCountLimit = 10e3;
        this.historyTimeLimit  = 60e3;
        this.fields = {
            id:    'id',
            time:  'time',
            count: 'count',
        };

        Object.assign(this, opts || {});
    }

    checkCount(id, max) {
        return this.pushCounter(id, 1) > max;
    }

    pushCounter(id, inc) {
        const data = {};

        data[this.fields.id] = id;
        data[this.fields.time] = Date.now();
        data[this.fields.count] = inc;

        this.push(data);
        return this.countGet(data);
    }

    push(data) {
        data[this.fields.time] = Date.now();
        this.history.push(data);
        this.countIncr(data[this.fields.id], data[this.fields.count]);
        this.clean();
    }

    clean() {
        const history = this.history;
        const maxCount = this.historyCountLimit;
        const expireTime = Date.now() - this.historyTimeLimit;
        const timeKey = this.fields.time;
        const index = history.findIndex((item) => item[timeKey] > expireTime);

        if (index !== -1) {
            const oldItems = history.splice(0, index);
            this.countIncrList(oldItems);
        }

        if (history.length > maxCount) {
            const oldItems = history.splice(0, history.length - maxCount);
            this.countIncrList(oldItems);
        }
    }

    countGet(data) {
        const id = data[this.fields.id];
        return this.counters[id] || 0;
    }

    countIncrList(items) {
        const countKey = this.fields.count;
        const idKey = this.fields.id;
        let index = items.length;
        let item;

        while (index--) {
            item = items[index];
            this.countIncr(item[idKey], -item[countKey]);
        }
    }

    countIncr(key, value) {
        if (!this.counters[key]) {
            this.counters[key] = 0;
        }

        this.counters[key] += value;

        if (!this.counters[key]) {
            delete this.counters[key];
        }

        return this.counters[key] || 0;
    }
}

module.exports = HistoryCounter;
