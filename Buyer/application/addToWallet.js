/*
 *  SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const uname= process.argv[2];
const num = process.argv[3];
const certkey=process.argv[4];
console.log(uname);
console.log(num);

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const path = require('path');

const fixtures = path.resolve(__dirname, '../../artifacts');

// A wallet stores a collection of identities
const wallet = new FileSystemWallet('../identity/user/'+uname+'/wallet');

async function main() {

    // Main try/catch block
    try {

        // Identity to credentials to be stored in the wallet
        const credPath = path.join(fixtures, '/crypto-config/peerOrganizations/buyer.example.com/users/User'+num+'@buyer.example.com');
        const cert = fs.readFileSync(path.join(credPath, '/msp/signcerts/User'+num+'@buyer.example.com-cert.pem')).toString();
        //const key = fs.readFileSync(path.join(credPath, '/msp/keystore/57cc2abf2ffb9e5ba496892e51ede431959f2e5594f805b3277666a9f71b5837_sk')).toString();
        const key = fs.readFileSync(path.join(credPath, '/msp/keystore/'+certkey)).toString();
        // Load credentials into wallet
        const identityLabel = 'User'+num+'@buyer.example.com';
        const identity = X509WalletMixin.createIdentity('BuyerMSP', cert, key);

        await wallet.import(identityLabel, identity);

    } catch (error) {
        console.log(`Error adding to wallet. ${error}`);
        console.log(error.stack);
    }
}

main().then(() => {
    console.log('done');
}).catch((e) => {
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});