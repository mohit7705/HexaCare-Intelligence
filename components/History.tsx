import { downloadSingleReportPDF } from "../services/reportEngine";

import { useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

interface HistoryItem {
  id: string;
  toolName: string;
  input: any; // ✅ REQUIRED for single PDF
  result: {
    risk: string;
    message: string;
    guidance?: string;
  };
  createdAt: any;
}

const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔑 Wait for Firebase Auth to be READY
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setHistory([]);
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "users", user.uid, "history"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        const records: HistoryItem[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        }));

        setHistory(records);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-black text-[#001e3c] mb-8">
        Health History
      </h1>

      {loading && (
        <p className="text-gray-500 italic">Loading history...</p>
      )}

      {!loading && history.length === 0 && (
        <div className="p-8 rounded-2xl bg-white/60 border text-center text-gray-500">
          No history yet. Use any health tool to see records here.
        </div>
      )}

      <div className="space-y-6">
        {history.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-white/70 border shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-bold text-[#001e3c]">
                {item.toolName}
              </h2>
              <span className="text-xs text-gray-400">
                {item.createdAt?.toDate
                  ? item.createdAt.toDate().toLocaleString()
                  : "—"}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-2">
              <strong>Risk:</strong> {item.result?.risk}
            </p>

            <p className="text-sm text-gray-500 italic">
              {item.result?.message}
            </p>

            {item.result?.guidance && (
              <p className="text-xs text-gray-400 mt-2">
                {item.result.guidance}
              </p>
            )}

            {/* ✅ SINGLE REPORT PDF DOWNLOAD */}
            <button
              onClick={() => downloadSingleReportPDF(item)}
              className="mt-4 px-4 py-2 text-sm font-semibold
             border border-gray-300 rounded-lg
             text-gray-700 bg-white
             hover:bg-gray-50 transition"
            >
              Download this report (PDF)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
