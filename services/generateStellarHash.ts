// services/generateStellarHash.ts
import crypto from "crypto";

interface StellarHashPayload {
  toolId: string;
  toolName: string;
  input: any;
  result: {
    risk: string;
    message: string;
  };
  user: string;
}

export const generateStellarHash = (payload: StellarHashPayload): string => {
  // Convert payload to stable string
  const data = JSON.stringify(payload);

  // Generate SHA-256 hash (64 hex chars)
  return crypto.createHash("sha256").update(data).digest("hex");
};
