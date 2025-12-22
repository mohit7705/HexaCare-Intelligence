import * as StellarSdk from "stellar-sdk";

// 1. Connect to Stellar TESTNET
const server = new StellarSdk.Horizon.Server(
  "https://horizon-testnet.stellar.org"
);

// 2. Your PUBLIC wallet address (safe to expose)
const PUBLIC_KEY =
  "GBD6LONW2WFPTQTYGI2SSPE2MAEF6TGKUORDEYVF6BZ7L2NB4PQ7RVSD";

// 3. Read data stored on blockchain
export async function readHealthRecord() {
  try {
    const account = await server.loadAccount(PUBLIC_KEY);

    const data = account.data_attr;

    if (!data["hexacare_record"]) {
      return {
        success: false,
        message: "No health record found on blockchain",
      };
    }

    // Decode base64 → string
    const decodedValue = atob(data["hexacare_record"]);

    return {
      success: true,
      record: decodedValue,
    };
  } catch (error) {
    console.error("Stellar read error:", error);
    return {
      success: false,
      message: "Failed to read from Stellar",
    };
  }
}
