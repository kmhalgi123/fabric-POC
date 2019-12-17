echo "Usage ./start.sh {ordererip}"
sk="$(find ../artifacts/crypto-config/peerOrganizations/seller.example.com/ca/ -name '*_sk' | cut -d '/' -f 7)"

#myipaddress="$(ifconfig enp4s0 | grep inet | awk '{print $2}'| cut -f2 -d:)"
ip=$1 sk=$sk docker-compose -f ./docker-compose.yml up -d 
echo "Sleeping for 15 seconds"
sleep 15
num=1
for i in `seq 0 $num`
do
    echo "Seller peer$i joining samplehannel"
    docker exec -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@seller.example.com/msp" peer$i.seller.example.com peer channel fetch config -c samplechannel -o orderer1.example.com:7050
    #=================================================
    docker exec -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@seller.example.com/msp" peer$i.seller.example.com peer channel join -b samplechannel_config.block -o orderer1.example.com:7050
done