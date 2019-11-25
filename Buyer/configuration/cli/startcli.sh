#docker-compose -f docker-compose.yml up -d 
echo "Usage: ./startcli.sh {ordererip} {version}" 
ip=$1 docker-compose -f docker-compose.yml up -d
sleep 2 

num=1

for i in `seq 0 $num`
do
	docker exec cliBuyer$i peer chaincode install -n ordercontract -v ${2:-01} -p /opt/gopath/src/github.com/contract -l node
	# sleep 2
	# #docker exec cliUtility$i peer chaincode instantiate -n papercontract -v ${1:-01} -l node -c '{"Args":["org.papernet.commercialpaper:instantiate"]}' -C commonchannel -P "AND ('UtilityMSP.member','SolarMSP.member','BatteryMSP.member','CosumerMSP.member')"
	# docker exec cliUtility$i peer chaincode install -n accountcontract -v ${2:-01} -p /opt/gopath/src/github.com/contract -l node
	# docker exec cliUtility$i peer chaincode install -n baccountcontract -v ${2:-01} -p /opt/gopath/src/github.com/contract -l node
	# docker exec cliUtility$i peer chaincode install -n caccountcontract -v ${2:-01} -p /opt/gopath/src/github.com/contract -l node
	# sleep 2
	#docker exec cliUtility$i peer chaincode instantiate -n accountcontract -v ${1:-01} -l node -c '{"Args":["org.papernet.account:instantiate"]}' -C commonchannel -P "AND ('UtilityMSP.member','SolarMSP.member','BatteryMSP.member','CosumerMSP.member')"
done

docker exec cliBuyer0 peer chaincode instantiate -n ordercontract -v ${2:-01} -l node -c '{"Args":["org.ordernet.order:instantiate"]}' -C samplechannel -P "OR ('BuyerMSP.member')"
#docker exec cliUtility0 peer chaincode instantiate -n papercontract -v ${2:-01} -l node -c '{"Args":["org.papernet.commercialpaper:instantiate"]}' -C commonchannel -P "OR ('UtilityMSP.member')"
# docker exec cliBuyer0 peer chaincode instantiate -n ordercontract -v ${2:-01} -l node -c '{"Args":["org.ordernet.order:instantiate"]}' -C samplechannel -P "OR ('BuyerMSP.member')"
#docker exec cliUtility0 peer chaincode instantiate -n accountcontract -v ${2:-01} -l node -c '{"Args":["org.papernet.account:instantiate"]}' -C commonchannel -P "AND ('UtilityMSP.member')"