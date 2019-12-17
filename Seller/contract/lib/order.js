'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

const currentState = {
    CREATED: 1,
    CANCELLED: 2,
    PURCHASED: 3,
    DELIVERED: 4
}

class Order extends State {

    constructor(obj) {
        super(Order.getClass(),[obj.order_id]);
        Object.assign(this,obj);
    }
    static fromBuffer(buffer) {
        return Order.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }
    getProduct() {
        return this.product_id;
    }
    setProduct(product_Id) {
        return this.product_id=product_Id;
    }
    getUser() {
        return this.user_id;
    }
    setUser(UserId) {
        return this.user_id=UserId;
    }
    getOrderId() {
        return this.order_id;
    }
    setOrderId(OrderId) {
        return this.order_id=OrderId;
    }
    setCreated(){
        return this.currentStatus = currentState.CREATED
    }
    setCancelled(){
        return this.currentStatus = currentState.CANCELLED
    }
    setDelivered(){
        return this.currentStatus = currentState.DELIVERED
    }
    setPurchased(){
        return this.currentStatus = currentState.PURCHASED
    }
    getCurrentState(){
        return this.currentStatus
    }
    // getebalance() {
    //     return this.ebalance;
    // }
    // setebalance(newebalance) {
    //     return this.ebalance=newebalance;
    // }
    // gettbalance() {
    //     return this.tbalance;
    // }
    // settbalance(newtbalance) {
    //     return this.tbalance=newtbalance;
    // }
    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Order);
    }

    static createInstance(product_id, user_id, order_id, currentStatus) {
        return new Order({product_id, user_id, order_id, currentStatus});
    }

    static getClass() {
        return 'org.ordernet.order';
    }


}

module.exports = Order;