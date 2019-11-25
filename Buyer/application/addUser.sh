num=3

for i in `seq 1 3`
do
    certkey="$(find ../../artifacts/crypto-config/peerOrganizations/buyer.example.com/users/User$i@buyer.example.com/msp/keystore/ -name '*_sk' | cut -d '/' -f 11)"
    echo $certkey
    node addToWallet.js "user$i" $i $certkey
done