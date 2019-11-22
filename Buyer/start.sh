echo "Usage: ./start.sh {ordererip}"
ip=$1
 utilitysk="$(find ../artifacts/crypto-config/peerOrganizations/buyer.example.com/ca/ -name '*_sk' | cut -d '/' -f 7)"
echo $utilitysk
echo $ip
ip=$ip sk=$utilitysk docker-compose -f ./docker-compose.yml up -d
echo "Sleeping for 15 seconds"
sleep 25

echo "Creating Sample Channel"
docker exec peer0.buyer.example.com peer channel create -o orderer0.example.com:7050 -c samplechannel -f /etc/hyperledger/configtx/sample-channel.tx

echo "Sleeping for 5 seconds"
sleep 5

docker exec -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@buyer.example.com/msp" peer0.buyer.example.com peer channel fetch 0 -o orderer0.example.com:7050 -c samplechannel
