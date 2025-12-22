import sys
import json
from stellar_sdk import Server

HORIZON_URL = "https://horizon-testnet.stellar.org"
server = Server(HORIZON_URL)

input_data = json.loads(sys.stdin.read())
hash_value = input_data.get("hash")

transactions = server.transactions().order(desc=True).limit(50).call()

found = False
ledger = None

for tx in transactions["_embedded"]["records"]:
    if tx.get("memo") == hash_value[:28]:
        found = True
        ledger = tx.get("ledger")
        break

print(json.dumps({
    "valid": found,
    "ledger": ledger
}))
