/* eslint-disable quote-props */
/* eslint-disable quotes */
/* eslint-disable linebreak-style */
/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const Order = require('./order.js');
const OrderList = require('./orderlist.js');
const currentState = require('./order.js')

/**
 * A custom context provides easy access to list of all commercial papers
 */
class OrderContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.orderList = new OrderList(this);
    }

}

/**
 * Define commercial paper smart contract by extending Fabric Contract class
 *
 */
class OrderContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.ordernet.order');
    }

    /**
     * Define a custom context for commercial paper
    */
    createContext() {
        return new OrderContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    /**
     * Issue commercial paper
     *
     * @param {Context} ctx the transaction context
     * @param {String} user_id commercial paper issuer
     * @param {String} product_id
     * @param {String} order_id
    */
    async create(ctx, product_id,user_id, order_id) {

        // create an instance of the paper
        let order = Order.createInstance(product_id,user_id,order_id,currentState.CREATED);

        // Smart contract, rather than paper, moves paper into ISSUED state
        // paper.setIssued();

        // Newly issued paper is owned by the issuer
        // paper.setOwner(issuer);

        // Add the paper to the list of all similar commercial papers in the ledger world state
        await ctx.orderList.addOrder(order);

        // Must return a serialized paper to caller of smart contract
        return order.toBuffer();
    }
    /**
     * Fetch Account
     * @param {Context} ctx 
     * @param {String} order_id
     */
    async fetchOrder(ctx,order_id)
    {
        let orderKey = Order.makeKey([order_id]);
        let order = await ctx.orderList.getOrder(orderKey);
        return order.toBuffer();

    }

    //  /**
    //  * Query All
    //  *
    //  * @param {Context} ctx the transaction context
    //  * @param {String} issuer commercial paper issuer
    // */
//    async queryAll(ctx) {
            
//         let queryString = {"selector": {}};

//         let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
//         return queryResults;

//     }

    /** 
     * Change ebalance of account
     * @param {Context} ctx the transaction context
     * @param {String} order_id
    */
   async orderCancel(ctx, order_id) {
        let orderKey = Order.makeKey([order_id]);
        let order = await ctx.orderList.getOrder(orderKey);
        //account.ebalance = account.ebalance + parseFloat(change);
        order.setCancelled();
        await ctx.orderList.updateOrder(order);
        return order.toBuffer();
       
   }

    /** 
     * Change ebalance of account
     * @param {Context} ctx the transaction context
     * @param {String} user_id commercial paper issuer
     * @param {String} product_id
     * @param {String} order_id
    */
    async orderPurchased(ctx, order_id) {
        let orderKey = Order.makeKey([order_id]);
        let order = await ctx.orderList.getOrder(orderKey);
        //account.ebalance = account.ebalance + parseFloat(change);
        order.setPurchased();
        await ctx.orderList.updateOrder(order);
        return order.toBuffer();
    
    }

    /** 
     * Change ebalance of account
     * @param {Context} ctx the transaction context
     * @param {String} order_id
    */
    async orderDelivered(ctx, order_id) {
        let orderKey = Order.makeKey([order_id]);
        let order = await ctx.orderList.getOrder(orderKey);
        //account.ebalance = account.ebalance + parseFloat(change);
        order.setDelivered();
        await ctx.orderList.updateOrder(order);
        return order.toBuffer();

    }

    /** 
     * Change ebalance of account
     * @param {Context} ctx the transaction context
     * @param {String} order1_id commercial paper issuer
     * @param {String} order_id
    */

    async backOrder(ctx, order_id, order1_id) {
        let orderKey = Order.makeKey([order_id]);
        let order = await ctx.orderList.getOrder(orderKey);
        //account.ebalance = account.ebalance + parseFloat(change);
        let user = order.getUser();
        let product = order.getProduct();
        let newOrder = Order.createInstance(product,user,order1_id,currentState.CREATED);
        await ctx.orderList.addOrder(order);
        return order.toBuffer();

    }
//     /** 
//      * Decrease ebalance of account
//      * @param {Context} ctx the transaction context
//      * @param {String} owner the owner of the account
//      * @param {String} name the name of the account owner
//      * @param {String} change the change in ebalance
//     */
//    async ebalanceDecrease(ctx, owner, name, change) {
//         let accountKey = Account.makeKey([owner,name]);
//         let account = await ctx.accountList.getAccount(accountKey);
//         //account.ebalance = account.ebalance - parseFloat(change);
//         let current=account.getebalance();
//         if(current-parseFloat(change)>=0){
//             account.setebalance(current-parseFloat(change));
//         }
//         else
//         {
//             throw new Error("Cannot transact balance too low");
//         }

//         await ctx.accountList.updateAccount(account);
//         return account.toBuffer();
       
//    }
//     /** 
//      * Increase tbalance of account
//      * @param {Context} ctx the transaction context
//      * @param {String} owner the owner of the account
//      * @param {String} name the name of the account owner
//      * @param {String} change the change in ebalance
//     */
//    async tbalanceIncrease(ctx, owner, name, change) {
//         let accountKey = Account.makeKey([owner,name]);
//         let account = await ctx.accountList.getAccount(accountKey);
//         //account.tbalance = account.tbalance + parseFloat(change);
//         let current=account.gettbalance();
//         account.settbalance(current+parseFloat(change));
//         await ctx.accountList.updateAccount(account);
//         return account.toBuffer();
   
//     }
//     /** 
//      * Decrease tbalance of account
//      * @param {Context} ctx the transaction context
//      * @param {String} owner the owner of the account
//      * @param {String} name the name of the account owner
//      * @param {String} change the change in ebalance
//     */
//     async tbalanceDecrease(ctx, owner, name,change) {
//         let accountKey = Account.makeKey([owner,name]);
//         let account = ctx.accountList.getAccount(accountKey);
//         account.tbalance = account.tbalance - parseFloat(change);
//         await ctx.accountList.updateAccount(account);
//         return account.toBuffer();
    
//     }
//     /**
//      * Evaluate a queryString
//      *
//      * @param {Context} ctx the transaction context
//      * @param {String} queryString the query string to be evaluated
//     */    
//    async queryWithQueryString(ctx, queryString) {

//         console.log("query String");
//         console.log(JSON.stringify(queryString));

//         let resultsIterator = await ctx.stub.getQueryResult(queryString);

//         let allResults = [];

//         while (true) {
//             let res = await resultsIterator.next();

//             if (res.value && res.value.value.toString()) {
//                 let jsonRes = {};

//                 console.log(res.value.value.toString('utf8'));

//                 jsonRes.Key = res.value.key;

//                 try {
//                     jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
//                 } catch (err) {
//                     console.log(err);
//                     jsonRes.Record = res.value.value.toString('utf8');
//                 }

//                 allResults.push(jsonRes);
//             }
//             if (res.done) {
//                 console.log('end of data');
//                 await resultsIterator.close();
//                 console.info(allResults);
//                 console.log(JSON.stringify(allResults));
//                 return JSON.stringify(allResults);
//             }
//         }

//     }

}

module.exports = OrderContract;