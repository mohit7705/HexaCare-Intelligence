import { useState } from "react";
import "./VerifyReport.css";
import { auth } from "../../firebase";
import { saveHistory } from "../../services/saveHistory";

type Status = "idle" | "loading" | "verified" | "error";

const VerifyReport = () => {
  const [txHash, setTxHash] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const verifyReport = async () => {
    if (!txHash || txHash.trim().length < 20) {
      setStatus("error");
      setMessage("Please enter a valid Stellar transaction hash.");
      return;
    }

    setStatus("loading");
    setMessage("Verifying on Stellar blockchain...");

    try {
      const response = await fetch("/api/trustchain/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hash: txHash.trim() }),
      });

      const data = await response.json();

      // ✅ BACKEND RETURNS { success: boolean, valid?: boolean, message?: string }
      if (data.success && data.valid) {
        setStatus("verified");
        setMessage("Report successfully verified on Stellar Blockchain.");

        // ✅ SAVE VERIFICATION SUCCESS
        if (auth.currentUser) {
          await saveHistory(
            auth.currentUser.uid,
            "health_report_verification",
            "Health Report Verification",
            { transactionHash: txHash },
            {
              status: "Verified",
              message: "Report successfully verified on Stellar Blockchain.",
            }
          );
        }
      } else {
        setStatus("error");
        setMessage(
          data.message ||
            "Transaction found, but verification failed or record mismatch."
        );

        // ✅ SAVE VERIFICATION FAILURE
        if (auth.currentUser) {
          await saveHistory(
            auth.currentUser.uid,
            "health_report_verification",
            "Health Report Verification",
            { transactionHash: txHash },
            {
              status: "Invalid",
              message:
                data.message ||
                "Transaction found but verification failed.",
            }
          );
        }
      }
    } catch (error) {
      console.error("Verification error:", error);

      setStatus("error");
      setMessage(
        "Unable to verify this transaction. It may be invalid or not exist on Stellar."
      );

      // ✅ SAVE SYSTEM ERROR
      if (auth.currentUser) {
        await saveHistory(
          auth.currentUser.uid,
          "health_report_verification",
          "Health Report Verification",
          { transactionHash: txHash },
          {
            status: "Error",
            message:
              "Unable to verify this transaction. Network or blockchain error.",
          }
        );
      }
    }
  };

  return (
    <div className="trustchain-container">
      <div className="trustchain-card">
        <h1>Health Report Verification</h1>
        <p className="subtitle">
          HexaCare TrustChain · Blockchain-secured verification (Stellar)
        </p>

        <div className="status-list">
          <span>✅ Frontend running</span>
          <span>✅ Stellar Testnet</span>
          <span>✅ Backend verification active</span>
        </div>

        <input
          type="text"
          placeholder="Paste Stellar Transaction Hash"
          value={txHash}
          onChange={(e) => setTxHash(e.target.value)}
          disabled={status === "loading"}
        />

        <button onClick={verifyReport} disabled={status === "loading"}>
          {status === "loading" ? "Verifying..." : "Verify Report"}
        </button>

        {status === "loading" && (
          <div className="result loading">
            🔄 Verifying on Stellar blockchain…
          </div>
        )}

        {status === "verified" && (
          <div className="result success">
            ✅ {message}
          </div>
        )}

        {status === "error" && (
          <div className="result error">
            ❌ {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyReport;
