'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const Order = require('./order.js');

class OrderList extends StateList {
    constructor(ctx) {
        super(ctx,'org.ordernet.orderlist');
        this.use(Order);
    }

    async addOrder(order) {
        return this.addState(order);
    }

    async cancelOrder(order) {
        return this.updateState(order);
    }

    async getOrder(orderKey) {
        return this.getState(orderKey);
    }

    async purchaseOrder(order) {
        return this.updateState(order);
    }

    async deliverOrder(order) {
        return this.updateState(order);
    }


}

module.exports = OrderList;