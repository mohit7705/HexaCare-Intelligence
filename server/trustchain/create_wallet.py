from stellar_sdk import Keypair

# Generate a random keypair
keypair = Keypair.random()

print("PUBLIC KEY (Safe to share):")
print(keypair.public_key)

print("\nSECRET KEY (Keep this private):")
print(keypair.secret)
