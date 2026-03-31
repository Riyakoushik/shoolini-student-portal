import { jsPDF } from "jspdf";
import { offerLetterData, student } from "../data/studentData";
import logoUrl from "../assets/shoolini-logo.png";

// ── RGB palette ──────────────────────────────────────────────────────────────
const NR = 26,  NG = 58,  NB = 92;
const GR = 200, GG = 168, GB = 75;
const GNR = 22, GNG = 163, GNB = 74;
const SR = 100, SG = 116, SB = 139;
const DR = 30,  DG = 42,  DB = 58;

const PW  = 210;
const PH  = 297;
const L   = 15;
const R   = 195;
const CW  = 180;
const SAFE_BOTTOM = PH - 22;   // stop adding content below this

async function getLogoBase64(url: string): Promise<string | null> {
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise<void>((res, rej) => {
      img.onload = () => res(); img.onerror = () => rej(); img.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width  = img.naturalWidth  || img.width;
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

function checkBreak(doc: jsPDF, y: number, needed: number, logo: string | null): number {
  if (y + needed > SAFE_BOTTOM) {
    // Draw mini footer on current page
    doc.setFillColor(NR, NG, NB);
    doc.rect(0, PH - 8, PW, 8, "F");
    doc.setFont("helvetica", "normal"); doc.setFontSize(6); doc.setTextColor(200, 210, 225);
    doc.text(
      "Shoolini University of Biotechnology and Management Sciences  |  shooliniuniversity.com",
      PW / 2, PH - 3.5, { align: "center" }
    );
    doc.addPage();
    // Minimal header on continuation pages
    doc.setFillColor(NR, NG, NB);
    doc.rect(0, 0, PW, 14, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(255, 255, 255);
    doc.text("SHOOLINI UNIVERSITY  |  JOINING OFFER LETTER (continued)", PW / 2, 9, { align: "center" });
    return 20;
  }
  return y;
}

function sectionHeading(doc: jsPDF, y: number, text: string): number {
  doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(NR, NG, NB);
  doc.text(text, L, y);
  y += 2;
  hLine(doc, y, GR, GG, GB, 0.4);
  return y + 5;
}

function tableHeader(
  doc: jsPDF,
  y: number,
  cols: { label: string; x: number; w: number }[],
): number {
  const H = 8;
  doc.setFillColor(241, 245, 249);
  doc.rect(L, y - 4, CW, H, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(SR, SG, SB);
  cols.forEach(c => doc.text(c.label, c.x + 2, y + 0.5));
  hLine(doc, y + H - 4, 221, 225, 231);
  return y + H - 0.5;
}

export async function downloadOfferLetter(): Promise<void> {
  const doc  = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const ol   = offerLetterData;
  const logo = await getLogoBase64(logoUrl);

  // ── PAGE 1 HEADER ────────────────────────────────────────────────────────
  doc.setFillColor(NR, NG, NB);
  doc.rect(0, 0, PW, 50, "F");

  doc.setFillColor(255, 255, 255);
  doc.ellipse(20, 11, 9, 9, "F");
  if (logo) { try { doc.addImage(logo, "PNG", 12, 3, 16, 16); } catch { /* ok */ } }
  else {
    doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(NR, NG, NB);
    doc.text("SU", 20, 13, { align: "center" });
  }

  doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.setTextColor(255, 255, 255);
  doc.text("JOINING OFFER LETTER", R, 14, { align: "right" });

  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(200, 210, 225);
  doc.text("Shoolini University of Biotechnology and Management Sciences", R, 21, { align: "right" });
  doc.text("Kasauli Hills, Solan, Himachal Pradesh \u2014 173229", R, 27, { align: "right" });

  doc.setDrawColor(GR, GG, GB); doc.setLineWidth(0.8);
  doc.line(0, 32, PW, 32);

  doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(GR, GG, GB);
  doc.text("NAAC B+  |  UGC Certified  |  Est. 2009", R, 37, { align: "right" });

  doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(255, 255, 255);
  doc.text(`Offer Letter No: ${ol.offerLetterNo}`, L, 44);
  doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(200, 210, 225);
  doc.text(`Issue Date: ${ol.issueDate}`, R, 44, { align: "right" });

  doc.setDrawColor(GR, GG, GB); doc.setLineWidth(1);
  doc.line(0, 50, PW, 50);

  let y = 58;

  // ── OPENING PARAGRAPH ──────────────────────────────────────────────────────
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(DR, DG, DB);
  const prose = [
    "Dear Koushik Thalari,",
    "",
    "On behalf of Shoolini University of Biotechnology and Management Sciences, we are pleased",
    "to offer you admission to the Master of Computer Applications (MCA) program with",
    "specialization in Artificial Intelligence & Machine Learning (Batch 2025\u20132027). This",
    "offer is subject to verification of your original documents and all admission requirements.",
  ];
  prose.forEach(line => {
    doc.text(line, L, y);
    y += line === "" ? 3 : 5.5;
  });
  y += 4;

  // ── SECTION A: ADMISSION DETAILS ──────────────────────────────────────────
  y = sectionHeading(doc, y, "ADMISSION DETAILS");

  const admDetails: [string, string][] = [
    ["OFFER LETTER NO",        ol.offerLetterNo],
    ["ISSUE DATE",             ol.issueDate],
    ["STUDENT NAME",           student.name],
    ["ROLL NUMBER",            student.rollNo],
    ["ENROLLMENT NO",          student.enrollmentNo],
    ["COLLEGE ADMIN NO",       student.collegeAdminNo],
    ["PROGRAM",                student.program],
    ["SPECIALIZATION",         student.specialization],
    ["BATCH",                  student.batch],
    ["REPORTING DATE",         `${ol.reportingDate} (9:00 AM \u2014 Admin Block)`],
    ["ORIENTATION DATE",       ol.orientationDate],
    ["CLASSES BEGIN",          ol.classesBegin],
    ["FATHER\u2019S NAME",     ol.fatherName],
    ["MOTHER\u2019S NAME",     ol.motherName],
    ["PHONE",                  student.phone],
    ["PERSONAL EMAIL",         student.personalEmail],
    ["ACADEMIC ADVISOR",       ol.academicAdvisor],
    ["DBA REFERENCE",          ol.dbaReference],
    ["DIGILOCKER CONSENT ID",  ol.digiLockerConsentId],
  ];

  const MID = L + CW / 2;    // 105 — value column
  const ADM_ROW = 8.5;

  admDetails.forEach(([label, value], idx) => {
    y = checkBreak(doc, y, ADM_ROW, logo);
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(L, y - 3.5, CW, ADM_ROW, "F");
    }
    doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(SR, SG, SB);
    doc.text(label, L + 2, y + 0.5);
    doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(DR, DG, DB);
    const safe = doc.splitTextToSize(value, CW / 2 - 4)[0] as string;
    doc.text(safe, MID, y + 0.5);
    hLine(doc, y + ADM_ROW - 4, 221, 225, 231, 0.3);
    y += ADM_ROW;
  });

  y += 6;

  // ── SECTION B: DOCUMENT VERIFICATION ──────────────────────────────────────
  y = checkBreak(doc, y, 40, logo);
  y = sectionHeading(doc, y, "DOCUMENT SUBMISSION & VERIFICATION STATUS");

  const docCols = [
    { label: "DOCUMENT",      x: L,                w: CW * 0.55 },
    { label: "SUBMITTED VIA", x: L + CW * 0.55,    w: CW * 0.25 },
    { label: "STATUS",        x: L + CW * 0.80,    w: CW * 0.20 },
  ];
  y = tableHeader(doc, y, docCols);

  const DOC_ROW = 7.5;
  ol.documents.forEach((d, idx) => {
    y = checkBreak(doc, y, DOC_ROW, logo);
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(L, y - 3, CW, DOC_ROW, "F");
    }
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(DR, DG, DB);
    doc.text(d.doc, docCols[0].x + 2, y + 1);
    doc.setTextColor(SR, SG, SB);
    doc.text(d.via, docCols[1].x + 2, y + 1);
    doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(GNR, GNG, GNB);
    doc.text("Verified", docCols[2].x + 2, y + 1);
    hLine(doc, y + DOC_ROW - 3, 221, 225, 231, 0.3);
    y += DOC_ROW;
  });

  y += 4;
  doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(SR, SG, SB);
  doc.text(`DigiLocker Partner ID: ${ol.digiLockerPartnerId}  |  DBA Ref: ${ol.dbaRefNo}  |  Verified: ${ol.verificationDate}`, L, y);
  y += 4.5;
  doc.setFont("helvetica", "italic"); doc.setFontSize(7.5);
  doc.text("Physical originals to be presented on the reporting day (11 August 2025).", L, y);
  y += 10;

  // ── SECTION C: FEE STRUCTURE ───────────────────────────────────────────────
  y = checkBreak(doc, y, 40, logo);
  y = sectionHeading(doc, y, "PROGRAM FEE STRUCTURE \u2014 MCA AI/ML (BATCH 2025\u20132027)");

  // Simplified 4-column fee table to avoid overflow: Semester | Tuition | Exam+Lab+Lib | Total
  const feeColsSimple = [
    { label: "SEMESTER",  x: L,           w: 40 },
    { label: "TUITION",   x: L + 40,      w: 38 },
    { label: "OTHER FEES",x: L + 78,      w: 68 },
    { label: "TOTAL",     x: L + 146,     w: 34 },
  ];
  y = tableHeader(doc, y, feeColsSimple);

  function fmtRs(n: number) { return "Rs. " + n.toLocaleString("en-IN"); }

  const FEE_ROW = 8;
  ol.semesterFees.forEach((row, idx) => {
    y = checkBreak(doc, y, FEE_ROW, logo);
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(L, y - 3.5, CW, FEE_ROW, "F");
    }
    const otherFees = row.exam + row.lab + row.library + row.activity;
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(DR, DG, DB);
    doc.text(row.sem,              feeColsSimple[0].x + 2, y + 1);
    doc.text(fmtRs(row.tuition),   feeColsSimple[1].x + 2, y + 1);
    doc.text(fmtRs(otherFees),     feeColsSimple[2].x + 2, y + 1);
    doc.setFont("helvetica", "bold");
    doc.text(fmtRs(row.total),     feeColsSimple[3].x + 2, y + 1);
    hLine(doc, y + FEE_ROW - 4, 221, 225, 231, 0.3);
    y += FEE_ROW;
  });

  // Grand total row
  y = checkBreak(doc, y, 12, logo);
  doc.setFillColor(NR, NG, NB);
  doc.rect(L, y - 3, CW, 11, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(255, 255, 255);
  doc.text("GRAND TOTAL (All Semesters)", L + 2, y + 4.5);
  doc.text(fmtRs(ol.grandTotal), R - 2, y + 4.5, { align: "right" });
  y += 16;

  // ── SECTION D: PAYMENT SCHEDULE ────────────────────────────────────────────
  y = checkBreak(doc, y, 20, logo);
  y = sectionHeading(doc, y, "PAYMENT SCHEDULE");

  const schCols = [
    { label: "INSTALLMENT",  x: L,           w: 40 },
    { label: "DUE DATE",     x: L + 40,      w: 38 },
    { label: "AMOUNT",       x: L + 78,      w: 38 },
    { label: "DESCRIPTION",  x: L + 116,     w: 64 },
  ];
  y = tableHeader(doc, y, schCols);

  const SCH_ROW = 8;
  ol.paymentSchedule.forEach((ps, idx) => {
    y = checkBreak(doc, y, SCH_ROW, logo);
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(L, y - 3.5, CW, SCH_ROW, "F");
    }
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(DR, DG, DB);
    doc.text(ps.installment, schCols[0].x + 2, y + 1);
    doc.text(ps.dueDate,     schCols[1].x + 2, y + 1);
    doc.setFont("helvetica", "bold");
    doc.text(ps.amount,      schCols[2].x + 2, y + 1);
    doc.setFont("helvetica", "normal"); doc.setTextColor(SR, SG, SB);
    const desc = doc.splitTextToSize(ps.description, schCols[3].w - 4)[0] as string;
    doc.text(desc, schCols[3].x + 2, y + 1);
    hLine(doc, y + SCH_ROW - 4, 221, 225, 231, 0.3);
    y += SCH_ROW;
  });

  y += 5;
  doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(SR, SG, SB);
  doc.text(`Payment Mode: UPI — ${ol.upiId}  |  DD in favour of: ${ol.ddFavorOf}`, L, y);
  y += 10;

  // ── SECTION E: DIGILOCKER STEPS ────────────────────────────────────────────
  y = checkBreak(doc, y, 40, logo);
  y = sectionHeading(doc, y, "DIGILOCKER & DBA VERIFICATION STEPS");

  ol.digiLockerSteps.forEach((step, idx) => {
    const estimatedH = 16;
    y = checkBreak(doc, y, estimatedH, logo);
    doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(GNR, GNG, GNB);
    doc.text(`Step ${step.step}: ${step.label}`, L + 4, y);
    doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(SR, SG, SB);
    const lines = doc.splitTextToSize(step.detail, CW - 8) as string[];
    lines.forEach((line: string, li: number) => {
      doc.text(line, L + 4, y + 4.5 + li * 4.5);
    });
    if (idx < ol.digiLockerSteps.length - 1) {
      hLine(doc, y + 4.5 + lines.length * 4.5, 221, 225, 231, 0.3);
    }
    y += 4.5 + lines.length * 4.5 + 4;
  });

  y += 6;

  // ── SIGNATURE BLOCK ────────────────────────────────────────────────────────
  y = checkBreak(doc, y, 45, logo);
  hLine(doc, y, GR, GG, GB, 0.5);
  y += 8;

  doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(DR, DG, DB);
  doc.text("For Shoolini University of Biotechnology and Management Sciences", L, y);
  y += 10;

  // Two signature boxes
  const SIG_W = 52;
  doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.3);
  doc.rect(L,          y, SIG_W, 12, "S");
  doc.rect(L + CW / 2, y, SIG_W, 12, "S");
  y += 14;

  doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(DR, DG, DB);
  doc.text("Registrar",               L,          y);
  doc.text("Director \u2014 Admissions", L + CW / 2, y);
  y += 4;
  doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(SR, SG, SB);
  doc.text("Shoolini University", L,          y);
  doc.text("Shoolini University", L + CW / 2, y);
  y += 8;

  doc.setFont("helvetica", "italic"); doc.setFontSize(7.5); doc.setTextColor(SR, SG, SB);
  doc.text(`This is a digitally generated offer letter. DigiLocker Consent ID: ${ol.digiLockerConsentId}`, L, y);

  // ── NAVY FOOTER BAR ON ALL PAGES ────────────────────────────────────────────
  const totalPages = (doc as jsPDF & { internal: { getNumberOfPages: () => number } })
    .internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFillColor(NR, NG, NB);
    doc.rect(0, PH - 8, PW, 8, "F");
    doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(200, 210, 225);
    doc.text(
      "Shoolini University of Biotechnology and Management Sciences  |  shooliniuniversity.com",
      PW / 2, PH - 3.5, { align: "center" }
    );
  }

  doc.save(`OfferLetter_SU-MCA-2025-OL-${student.rollNo.slice(-5)}_KoushikThalari.pdf`);
}
