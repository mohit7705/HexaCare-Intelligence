// services/reportEngine.ts

import { generateStellarHash } from "./generateStellarHash";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import jsPDF from "jspdf";
import QRCode from "qrcode";

/* ==============================
   🔧 LOGO LOADER (HIGH QUALITY)
================================ */
const loadLogo = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = "/images/hexacare-logo.png";
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");

      // upscale for better PDF clarity
      const scale = 2;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas error");

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = reject;
  });
};

/* ==============================
   🟦 WATERMARK
================================ */
const addWatermark = (pdf: jsPDF, logo: string) => {
  pdf.saveGraphicsState();
  (pdf as any).setGState(new (pdf as any).GState({ opacity: 0.04 }));
  pdf.addImage(logo, "PNG", 30, 90, 150, 150);
  pdf.restoreGraphicsState();
};

/* ==============================
   🔳 QR GENERATOR
================================ */
const generateQR = async (payload: any): Promise<string> => {
  return QRCode.toDataURL(JSON.stringify(payload), {
    errorCorrectionLevel: "H",
    width: 300,
  });
};

/* ==============================
   1️⃣ SAVE REPORT (SAFE + ROBUST)
================================ */
export const generateReport = async ({
  toolId,
  toolName,
  input,
  result,
}: {
  toolId: string;
  toolName: string;
  input: any;
  result: { risk: string; message: string };
}) => {
  if (!auth.currentUser) return;

  const recordHash = generateStellarHash({
    toolId,
    toolName,
    input,
    result,
    user: auth.currentUser.uid,
  });

  let txHash: string | null = null;

  try {
    const response = await fetch("/api/trustchain/write", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hash: recordHash }),
    });

    const stellarResult = await response.json();
    if (stellarResult?.success && stellarResult?.txHash) {
      txHash = stellarResult.txHash;
    }
  } catch {
    console.warn("Stellar write failed, continuing safely");
  }

  await addDoc(
    collection(db, "users", auth.currentUser.uid, "history"),
    {
      toolId,
      toolName,
      input,
      result,
      txHash,
      createdAt: serverTimestamp(),
    }
  );
};

/* ==============================
   2️⃣ FULL HISTORY PDF
================================ */
export const downloadHistoryPDF = async () => {
  if (!auth.currentUser) return alert("Please login first");

  const snapshot = await getDocs(
    query(
      collection(db, "users", auth.currentUser.uid, "history"),
      orderBy("createdAt", "desc")
    )
  );

  if (snapshot.empty) return alert("No reports available");

  const logo = await loadLogo();
  const pdf = new jsPDF("p", "mm", "a4");
  let y = 20;

  addWatermark(pdf, logo);

  // 🔷 HEADER LOGO (LARGE & CENTERED)
  pdf.addImage(logo, "PNG", 55, y, 100, 36);
  y += 50;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("AI Health Screening Report", 105, y, { align: "center" });
  y += 10;

  pdf.setFontSize(11);
  pdf.setTextColor(90);
  pdf.text(
    "HexaCare Intelligence · Blockchain-Verified Medical Report",
    105,
    y,
    { align: "center" }
  );
  y += 15;

  pdf.setDrawColor(200);
  pdf.line(20, y, 190, y);
  y += 12;

  for (const [index, docSnap] of snapshot.docs.entries()) {
    const data = docSnap.data();

    if (y > 250) {
      pdf.addPage();
      addWatermark(pdf, logo);
      y = 20;
    }

    // 🧾 REPORT CARD
    pdf.setFillColor(245, 247, 250);
    pdf.rect(15, y - 6, 180, 58, "F");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(0);
    pdf.text(`Report #${index + 1}`, 20, y + 4);

    pdf.setFontSize(11);
    pdf.text(`Tool: ${data.toolName}`, 20, y + 14);
    pdf.text(`Risk Level: ${data.result?.risk}`, 20, y + 22);

    const txText = data.txHash ?? "Not recorded on blockchain";
    pdf.setFontSize(10);
    pdf.setTextColor(80);
    pdf.text(`Stellar Tx Hash: ${txText}`, 20, y + 30);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0);
    const summary = pdf.splitTextToSize(
      data.result?.message || "",
      170
    );
    pdf.text(summary, 20, y + 40);

    if (data.txHash) {
      const qr = await generateQR({
        tool: data.toolName,
        risk: data.result?.risk,
        txHash: data.txHash,
      });
      pdf.addImage(qr, "PNG", 155, y + 18, 30, 30);
    }

    y += 70;
  }

  pdf.setFontSize(9);
  pdf.setTextColor(150);
  pdf.text(
    "Generated by HexaCare Intelligence • Verified via Blockchain",
    105,
    290,
    { align: "center" }
  );

  pdf.save("HexaCare_Health_Report.pdf");
};

/* ==============================
   3️⃣ SINGLE REPORT PDF
================================ */
export const downloadSingleReportPDF = async (report: any) => {
  if (!auth.currentUser) return alert("Please login first");

  const logo = await loadLogo();
  const pdf = new jsPDF("p", "mm", "a4");

  addWatermark(pdf, logo);

  // 🔷 HEADER
  pdf.addImage(logo, "PNG", 55, 20, 100, 36);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("AI Health Screening Report", 105, 70, { align: "center" });

  pdf.setFontSize(11);
  pdf.setTextColor(90);
  pdf.text(
    "HexaCare Intelligence · Blockchain-Verified",
    105,
    80,
    { align: "center" }
  );

  let y = 100;

  pdf.setFillColor(245, 247, 250);
  pdf.rect(15, y - 6, 180, 55, "F");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.setTextColor(0);
  pdf.text(`Tool: ${report.toolName}`, 20, y + 6);
  pdf.text(`Risk Level: ${report.result?.risk}`, 20, y + 16);

  const txText = report.txHash ?? "Not recorded on blockchain";
  pdf.setFontSize(10);
  pdf.setTextColor(80);
  pdf.text(`Stellar Tx Hash: ${txText}`, 20, y + 26);

  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(0);
  const summary = pdf.splitTextToSize(
    report.result?.message || "",
    170
  );
  pdf.text(summary, 20, y + 38);

  if (report.txHash) {
    const qr = await generateQR({
      tool: report.toolName,
      risk: report.result?.risk,
      txHash: report.txHash,
    });
    pdf.addImage(qr, "PNG", 155, 230, 30, 30);
  }

  pdf.setFontSize(9);
  pdf.setTextColor(150);
  pdf.text(
    "Generated by HexaCare Intelligence • Verified via Blockchain",
    105,
    290,
    { align: "center" }
  );

  pdf.save(`${report.toolName}_Report.pdf`);
};
