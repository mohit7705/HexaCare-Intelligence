import sys
import json
from stellar_sdk import Server, Keypair, TransactionBuilder, Network

# ⚠️ Use TESTNET for now
HORIZON_URL = "https://horizon-testnet.stellar.org"
NETWORK_PASSPHRASE = Network.TESTNET_NETWORK_PASSPHRASE

# ⚠️ Replace with your funded testnet secret key
SECRET_KEY = "PASTE_YOUR_TESTNET_SECRET_KEY_HERE"

server = Server(HORIZON_URL)
source_keypair = Keypair.from_secret(SECRET_KEY)
source_account = server.load_account(source_keypair.public_key)

# Read input from Node.js
input_data = json.loads(sys.stdin.read())
hash_value = input_data.get("hash")

tx = (
    TransactionBuilder(
        source_account=source_account,
        network_passphrase=NETWORK_PASSPHRASE,
        base_fee=100
    )
    .add_text_memo(hash_value[:28])  # Stellar memo limit
    .set_timeout(30)
    .build()
)

tx.sign(source_keypair)
response = server.submit_transaction(tx)

print(json.dumps({
    "txHash": response["hash"]
}))
