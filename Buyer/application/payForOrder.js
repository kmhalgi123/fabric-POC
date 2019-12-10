'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
const Order = require('../contract/lib/order.js');

// A wallet stores a collection of identities for use
//const wallet = new FileSystemWallet('../user/isabella/wallet');
const wallet = new FileSystemWallet('../identity/user/user1/wallet');

// Main program function
async function main() {

    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        // Specify userName for network access
        // const userName = 'isabella.issuer@magnetocorp.com';
        const userName = 'User1@buyer.example.com';

        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/networkConnection.yaml', 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled:false, asLocalhost: true }
        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        // Access PaperNet network
        console.log('Use network channel: samplechannel.');

        const network = await gateway.getNetwork('samplechannel');

        // Get addressability to commercial paper contract
        console.log('Use org.papernet.account smart contract.');

        const contract = await network.getContract('ordercontract', 'org.ordernet.order');

        // issue commercial paper
        console.log('Submit commercial paper collect transaction.');

        let results = await contract.submitTransaction('orderPurchased','order');
        console.log(results);
        

        console.log(Order.fromBuffer(results));

        let resultsObject = (Order.fromBuffer(results));

        console.log(resultsObject.currentStatus);
        // let current_time = new Date().toISOString().toString();
        //const issueResponse = await contract.submitTransaction('collectoffer');
        //const issueResponse = await contract.submitTransaction('collectByOwner','Digibank');
        // const issueResponse = await contract.submitTransaction ('getsinglestate', 'Digibank', '2019-05-17T23:25:30.843Z');
        // console.log(issueResponse.length);
        // console.log(typeof issueResponse);
        // console.log(issueResponse);
        // console.log(issueResponse.toString('utf8'));
        // console.log(JSON.parse(issueResponse.toString()));
        console.log('Create Issue transaction response.');
        //console.log(JSON.parse(JSON.stringify(issueResponse)));
        // let paper = CommercialPaper.fromBuffer(issueResponse);
        // console.log(typeof paper);
        // console.log(JSON.stringify(paper));
        //console.log(paper);
        console.log('Transaction complete.');

    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
}
main().then(() => {

    console.log('Issue program complete.');

}).catch((e) => {

    console.log('Issue program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});