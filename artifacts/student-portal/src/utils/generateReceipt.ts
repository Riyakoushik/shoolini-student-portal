import { jsPDF } from "jspdf";
import { student } from "../data/studentData";
import type { FeeRecord } from "../data/studentData";
import logoUrl from "../assets/shoolini-logo.png";

// ── RGB palette ──────────────────────────────────────────────────────────────
const NR = 26, NG = 58, NB = 92;
const GR = 200, GG = 168, GB = 75;
const GNR = 22, GNG = 163, GNB = 74;
const SR = 100, SG = 116, SB = 139;
const DR = 30, DG = 42, DB = 58;

const PW = 210;
const PH = 297;
const L = 15;
const R = 195;
const CW = 180;

// Column x-positions for fee table
const FEE_COL_LABEL = L + 2;               // left-aligned label
const FEE_COL_AMT_X = R - 2;               // right-aligned amount

async function getLogoBase64(url: string): Promise<string | null> {
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise<void>((res, rej) => {
      img.onload = () => res(); img.onerror = () => rej(); img.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0);
    const id = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = id.data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] > 10) { d[i] = 255; d[i + 1] = 255; d[i + 2] = 255; }
    }
    ctx.putImageData(id, 0, 0);
    return canvas.toDataURL("image/png");
  } catch { return null; }
}

function hLine(doc: jsPDF, y: number, r: number, g: number, b: number, lw = 0.4) {
  doc.setDrawColor(r, g, b); doc.setLineWidth(lw);
  doc.line(L, y, R, y);
}

function fmtRs(n: number) {
  return "Rs. " + n.toLocaleString("en-IN");
}

export async function downloadReceipt(payment: FeeRecord): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const logo = await getLogoBase64(logoUrl);
  const feeItems = payment.feeItems ?? [];
  const total = feeItems.reduce((s, f) => s + f.amountNum, 0);
  const receiptNo = payment.receiptNo ?? payment.id ?? "N/A";
  const fileName = `Receipt_${receiptNo}_KoushikThalari.pdf`;

  // ── HEADER ────────────────────────────────────────────────────────────────
  doc.setFillColor(NR, NG, NB);
  doc.rect(0, 0, PW, 48, "F");

  // Logo circle — radius 9, center (20,11), above gold line at y=30
  doc.setFillColor(255, 255, 255);
  doc.ellipse(20, 11, 9, 9, "F");
  if (logo) { try { doc.addImage(logo, "PNG", 12, 3, 16, 16); } catch { /* ok */ } }
  else {
    doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(NR, NG, NB);
    doc.text("SU", 20, 13, { align: "center" });
  }

  doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.setTextColor(255, 255, 255);
  doc.text("FEE PAYMENT RECEIPT", R, 14, { align: "right" });

  doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(200, 210, 225);
  doc.text("Shoolini University of Biotechnology and Management Sciences", R, 20, { align: "right" });
  doc.text("Kasauli Hills, Solan, Himachal Pradesh \u2014 173229", R, 25.5, { align: "right" });

  doc.setDrawColor(GR, GG, GB); doc.setLineWidth(0.8);
  doc.line(0, 30, PW, 30);

  doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(GR, GG, GB);
  doc.text("NAAC B+  |  UGC Certified  |  Est. 2009", R, 36, { align: "right" });

  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(255, 255, 255);
  doc.text(`Receipt No: ${receiptNo}`, L, 44);
  doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(200, 210, 225);
  doc.text(
    `Generated: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}`,
    R, 44, { align: "right" }
  );

  doc.setDrawColor(GR, GG, GB); doc.setLineWidth(1);
  doc.line(0, 48, PW, 48);

  // ── STUDENT + PAYMENT INFO (two columns) ──────────────────────────────────
  let y = 56;
  const MID = L + CW / 2;   // 105

  doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(NR, NG, NB);
  doc.text("STUDENT INFORMATION", L, y);
  doc.text("PAYMENT DETAILS", MID + 2, y);
  y += 2;
  hLine(doc, y, GR, GG, GB, 0.4);
  y += 5;

  const leftFields: [string, string][] = [
    ["STUDENT NAME", student.name],
    ["ROLL NUMBER", student.rollNo],
    ["ENROLLMENT NO", student.enrollmentNo],
    ["PROGRAM", student.program],
    ["DEPARTMENT", student.department],
    ["BATCH", student.batch],
    ["CURRENT SEMESTER", `Semester ${student.currentSemester}`],
  ];
  const rightFields: [string, string][] = [
    ["RECEIPT NO", receiptNo],
    ["PAYMENT DATE", payment.date ?? "\u2014"],
    ["PAYMENT MODE", payment.paymentMode ?? "\u2014"],
    ["TRANSACTION ID", payment.txnId ?? "\u2014"],
    ["SEMESTER", payment.semester ?? payment.desc],
    ["STATUS", "PAID"],
  ];

  const ROW_H = 9;
  for (let i = 0; i < Math.max(leftFields.length, rightFields.length); i++) {
    if (leftFields[i]) {
      doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(SR, SG, SB);
      doc.text(leftFields[i][0], L, y);
      doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(DR, DG, DB);
      doc.text(leftFields[i][1], L, y + 4.5);
    }
    if (rightFields[i]) {
      doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(SR, SG, SB);
      doc.text(rightFields[i][0], MID + 2, y);
      const isStatus = rightFields[i][0] === "STATUS";
      doc.setFont("helvetica", "bold"); doc.setFontSize(8.5);
      doc.setTextColor(isStatus ? GNR : DR, isStatus ? GNG : DG, isStatus ? GNB : DB);
      doc.text(rightFields[i][1], MID + 2, y + 4.5);
    }
    y += ROW_H;
  }

  y += 4;
  hLine(doc, y, 221, 225, 231);
  y += 8;

  // ── FEE BREAKDOWN TABLE ───────────────────────────────────────────────────
  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(NR, NG, NB);
  doc.text("FEE BREAKDOWN", L, y);
  y += 2;
  hLine(doc, y, GR, GG, GB, 0.4);
  y += 5;

  // Table header
  const TBL_ROW_H = 8;
  doc.setFillColor(241, 245, 249);
  doc.rect(L, y - 3.5, CW, TBL_ROW_H, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(SR, SG, SB);
  doc.text("FEE COMPONENT", FEE_COL_LABEL, y + 1);
  doc.text("AMOUNT", FEE_COL_AMT_X, y + 1, { align: "right" });
  hLine(doc, y + TBL_ROW_H - 3.5, 221, 225, 231);
  y += TBL_ROW_H;

  // Data rows
  feeItems.forEach((item, idx) => {
    const ry = y + idx * TBL_ROW_H;
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(L, ry - 3.5, CW, TBL_ROW_H, "F");
    }
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(DR, DG, DB);
    doc.text(item.label, FEE_COL_LABEL, ry + 1);
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(DR, DG, DB);
    doc.text(item.amount, FEE_COL_AMT_X, ry + 1, { align: "right" });
    doc.setDrawColor(221, 225, 231); doc.setLineWidth(0.2);
    doc.line(L, ry + TBL_ROW_H - 3.5, R, ry + TBL_ROW_H - 3.5);
  });

  y += feeItems.length * TBL_ROW_H + 4;

  // Total row
  doc.setFillColor(NR, NG, NB);
  doc.rect(L, y - 3, CW, 11, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(255, 255, 255);
  doc.text("TOTAL AMOUNT PAID", FEE_COL_LABEL, y + 4);
  doc.text(fmtRs(total), FEE_COL_AMT_X, y + 4, { align: "right" });
  y += 18;

  // ── PAYMENT CONFIRMED STAMP ────────────────────────────────────────────────
  const STAMP_W = 80;
  const STAMP_X = (PW - STAMP_W) / 2;
  doc.setFillColor(220, 252, 231);
  doc.setDrawColor(GNR, GNG, GNB); doc.setLineWidth(0.5);
  doc.roundedRect(STAMP_X, y, STAMP_W, 13, 2, 2, "FD");
  doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(GNR, GNG, GNB);
  doc.text("PAYMENT CONFIRMED", PW / 2, y + 9, { align: "center" });
  y += 18;

  doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(SR, SG, SB);
  doc.text(`UPI Transaction ID: ${payment.txnId ?? "N/A"}`, PW / 2, y, { align: "center" });
  y += 12;

  // ── FOOTER ────────────────────────────────────────────────────────────────
  hLine(doc, y, GR, GG, GB, 0.6);
  y += 5;

  doc.setFont("helvetica", "italic"); doc.setFontSize(7.5); doc.setTextColor(SR, SG, SB);
  doc.text("This is a computer-generated receipt and does not require a physical signature.", PW / 2, y, { align: "center" });
  y += 4.5;
  doc.text("Payment verified via UPI. Transaction ID is proof of payment.", PW / 2, y, { align: "center" });
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.text("Registrar: registrar@shooliniuniversity.com   |   Phone: +91 7018007000", PW / 2, y, { align: "center" });

  doc.setFillColor(NR, NG, NB);
  doc.rect(0, PH - 8, PW, 8, "F");
  doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(200, 210, 225);
  doc.text(
    "Shoolini University of Biotechnology and Management Sciences  |  shooliniuniversity.com",
    PW / 2, PH - 3.5, { align: "center" }
  );

  doc.save(fileName);
}
