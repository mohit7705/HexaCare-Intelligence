import StellarSdk from "stellar-sdk";

// TESTNET server
const server = new StellarSdk.Horizon.Server(
  "https://horizon-testnet.stellar.org"
);

// ⚠️ NEVER expose this in frontend
const SECRET_KEY = process.env.STELLAR_SECRET_KEY;
const NETWORK = StellarSdk.Networks.TESTNET;

export async function writeHashToStellar(hashValue) {
  try {
    if (!SECRET_KEY) {
      throw new Error("Missing STELLAR_SECRET_KEY in .env");
    }

    const sourceKeypair = StellarSdk.Keypair.fromSecret(SECRET_KEY);
    const account = await server.loadAccount(sourceKeypair.publicKey());

    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK,
    })
      .addOperation(
        StellarSdk.Operation.manageData({
          name: "hexacare_record",
          value: hashValue,
        })
      )
      .setTimeout(180)
      .build();

    tx.sign(sourceKeypair);

    const result = await server.submitTransaction(tx);

    return {
      success: true,
      txHash: result.hash,
    };
  } catch (error) {
    console.error("Stellar write error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
