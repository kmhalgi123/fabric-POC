echo "Creating Genesis Block"
export FABRIC_CFG_PATH=$PWD
configtxgen -profile SampleOrdererGenesis -outputBlock ./sample-genesis.block

echo "Creating CommonChannel"
configtxgen -profile SampleChannel -outputCreateChannelTx ./sample-channel.tx -channelID samplechannel