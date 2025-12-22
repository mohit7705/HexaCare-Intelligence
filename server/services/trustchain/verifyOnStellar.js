import * as StellarSdk from "stellar-sdk";

// Connect to Stellar TESTNET
const server = new StellarSdk.Horizon.Server(
  "https://horizon-testnet.stellar.org"
);

/**
 * Verify whether a Stellar transaction exists
 */
export const verifyOnStellar = async (txHash) => {
  try {
    const tx = await server.transactions().transaction(txHash).call();

    return {
      success: true,
      hash: tx.hash,
      ledger: tx.ledger,
      createdAt: tx.created_at,
    };
  } catch (error) {
    return {
      success: false,
      message: "Transaction not found or invalid",
    };
  }
};
