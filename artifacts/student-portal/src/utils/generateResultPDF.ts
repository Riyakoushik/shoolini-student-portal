import { jsPDF } from "jspdf";
import { student } from "../data/studentData";
import logoUrl from "../assets/shoolini-logo.png";

// ── RGB palette ──────────────────────────────────────────────────────────────
const NR = 26, NG = 58, NB = 92;          // #1a3a5c  navy
const GR = 200, GG = 168, GB = 75;           // #c8a84b  gold
const SR = 100, SG = 116, SB = 139;          // #64748b  slate
const DR = 30, DG = 42, DB = 58;           // #1e2a3a  dark

const GNR = 22, GNG = 163, GNB = 74;        // #16a34a  green  (A+)
const BLR = 37, BLG = 99, BLB = 235;       // #2563eb  blue   (A)
const AMR = 217, AMG = 119, AMB = 6;         // #d97706  amber  (B+)
const RER = 220, REG = 38, REB = 38;        // #dc2626  red    (B)
const PUR = 124, PUG = 58, PUB = 237;       // #7c3aed  purple (awaited)

const PW = 210;
const L = 15;
const R = 195;
const CW = 180;

// ── Grade colour helper ──────────────────────────────────────────────────────
function gradeRGB(grade: string): [number, number, number] {
  if (grade === "A+" || grade === "O") return [GNR, GNG, GNB];
  if (grade === "A") return [BLR, BLG, BLB];
  if (grade === "B+") return [AMR, AMG, AMB];
  return [RER, REG, REB];
}

// ── Shared helpers ────────────────────────────────────────────────────────────
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

function hLine(doc: jsPDF, y: number, r: number, g: number, b: number, lw = 0.3) {
  doc.setDrawColor(r, g, b); doc.setLineWidth(lw);
  doc.line(L, y, R, y);
}

function drawPageHeader(
  doc: jsPDF,
  logo: string | null,
  title: string,
) {
  // Navy strip y=0..36
  doc.setFillColor(NR, NG, NB);
  doc.rect(0, 0, PW, 36, "F");

  // Logo circle — radius 9, center (20,11), fully above gold line at y=22
  doc.setFillColor(255, 255, 255);
  doc.ellipse(20, 11, 9, 9, "F");
  if (logo) {
    try { doc.addImage(logo, "PNG", 12, 3, 16, 16); } catch { /* ok */ }
  } else {
    doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(NR, NG, NB);
    doc.text("SU", 20, 13, { align: "center" });
  }

  doc.setFont("helvetica", "bold"); doc.setFontSize(17); doc.setTextColor(255, 255, 255);
  doc.text("SHOOLINI UNIVERSITY", 105, 12, { align: "center" });

  doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(200, 210, 225);
  doc.text("Kasauli Hills, Solan, Himachal Pradesh \u2014 173229", 105, 18, { align: "center" });

  doc.setDrawColor(GR, GG, GB); doc.setLineWidth(0.8);
  doc.line(0, 22, PW, 22);

  doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(GR, GG, GB);
  doc.text("OFFICE OF EXAMINATIONS", 105, 27, { align: "center" });

  // Document title (only once — in the header strip)
  doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(255, 255, 255);
  doc.text(title, 105, 33, { align: "center" });
}

function drawDocumentMeta(
  doc: jsPDF,
  examPeriod: string,
  isAwaited: boolean,
  isToBeReleased = false,
) {
  // Light meta bar  y=40..47
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(221, 225, 231); doc.setLineWidth(0.3);
  doc.rect(L, 40, CW, 7, "FD");

  doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(SR, SG, SB);
  doc.text(`Examination Period: ${examPeriod}`, L + 3, 45);

  // Badge
  let bgR: number, bgG: number, bgB: number;
  let bdR: number, bdG: number, bdB: number;
  let badgeText: string;
  if (isToBeReleased) {
    bgR = 255; bgG = 251; bgB = 235;
    bdR = AMR; bdG = AMG; bdB = AMB;
    badgeText = "TO BE RELEASED";
  } else if (isAwaited) {
    bgR = 237; bgG = 233; bgB = 254;
    bdR = PUR; bdG = PUG; bdB = PUB;
    badgeText = "RESULT AWAITED";
  } else {
    bgR = 220; bgG = 252; bgB = 231;
    bdR = GNR; bdG = GNG; bdB = GNB;
    badgeText = "\u2713 VERIFIED";
  }
  doc.setFillColor(bgR, bgG, bgB);
  doc.setDrawColor(bdR, bdG, bdB); doc.setLineWidth(0.4);
  doc.roundedRect(R - 40, 41, 39, 5.5, 1, 1, "FD");
  doc.setFont("helvetica", "bold"); doc.setFontSize(6.5); doc.setTextColor(bdR, bdG, bdB);
  doc.text(badgeText, R - 20.5, 45, { align: "center" });
}

function drawStudentBlock(doc: jsPDF, y: number, semester: number): number {
  // Outer rect with navy left accent
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(221, 225, 231); doc.setLineWidth(0.5);
  doc.rect(L, y, CW, 32, "FD");
  doc.setFillColor(NR, NG, NB);
  doc.rect(L, y, 3, 32, "F");

  const LX = L + 6;
  const RX = 110;

  function lv(label: string, value: string, lx: number, ly: number, maxW = 80) {
    doc.setFont("helvetica", "normal"); doc.setFontSize(6.5); doc.setTextColor(SR, SG, SB);
    doc.text(label, lx, ly);
    doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(DR, DG, DB);
    const v = doc.splitTextToSize(value, maxW)[0] as string;
    doc.text(v, lx, ly + 5);
  }

  // Row 1 (y+6, y+12)
  lv("STUDENT NAME", "Koushik Thalari", LX, y + 6);
  lv("DEPARTMENT", "School of Computer Science & Engineering", RX, y + 6, 80);
  // Row 2 (y+14, y+20)
  lv("ROLL NUMBER", student.rollNo, LX, y + 14);
  lv("SEMESTER", `Semester ${semester}  |  Academic Year: 2025\u20132026`, RX, y + 14, 80);
  // Row 3 (y+22, y+28)
  lv("PROGRAM", "MCA (AI / ML Specialization)", LX, y + 22);
  lv("GENERATED ON", "28 March 2026", RX, y + 22);

  return y + 32;
}

function drawMarksheetTable(
  doc: jsPDF,
  y: number,
  rows: MarksheetRow[],
  isAwaited: boolean,
): { y: number; totalScore: number; totalMax: number } {
  const showFaculty = rows.some(r => r.faculty);
  const showDate = rows.some(r => r.date);

  // Column widths that always sum to CW=180
  let wSub = 90;
  let wFac = 0;
  let wDat = 0;
  const wSco = 25;
  const wMax = 25;
  const wGrd = 40;

  if (showFaculty && showDate) { wSub = 50; wFac = 38; wDat = 27; }
  else if (showFaculty) { wSub = 65; wFac = 50; }
  else if (showDate) { wSub = 72; wDat = 43; }

  // Column center-x positions
  const xSub = L;
  const xFac = xSub + wSub;
  const xDat = xFac + wFac;
  const xSco = xDat + wDat;
  const xMax = xSco + wSco;
  const xGrd = xMax + wMax;

  const cxSco = xSco + wSco / 2;
  const cxMax = xMax + wMax / 2;
  const cxGrd = xGrd + wGrd / 2;

  // Header row
  const THEAD_H = 9;
  doc.setFillColor(NR, NG, NB);
  doc.rect(L, y, CW, THEAD_H, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(255, 255, 255);
  doc.text("SUBJECT", xSub + 2, y + 6);
  if (showFaculty) doc.text("FACULTY", xFac + 2, y + 6);
  if (showDate) doc.text("EXAM DATE", xDat + 2, y + 6);
  doc.text("SCORE", cxSco, y + 6, { align: "center" });
  doc.text("MAX", cxMax, y + 6, { align: "center" });
  doc.text("GRADE", cxGrd, y + 6, { align: "center" });

  y += THEAD_H;

  // Data rows
  const ROW_H = 10;
  let totalScore = 0;
  let totalMax = 0;

  rows.forEach((row, i) => {
    const ry = y + i * ROW_H;
    if (i % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(L, ry, CW, ROW_H, "F");
    }
    doc.setDrawColor(221, 225, 231); doc.setLineWidth(0.2);
    doc.line(L, ry + ROW_H, R, ry + ROW_H);

    // Subject
    doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(DR, DG, DB);
    const subj = doc.splitTextToSize(row.subject, wSub - 4)[0] as string;
    doc.text(subj, xSub + 2, ry + 6.5);

    // Faculty
    if (showFaculty) {
      doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(SR, SG, SB);
      const fac = doc.splitTextToSize(row.faculty ?? "\u2014", wFac - 4)[0] as string;
      doc.text(fac, xFac + 2, ry + 6.5);
    }

    // Date
    if (showDate) {
      doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(SR, SG, SB);
      doc.text(row.date ?? "\u2014", xDat + 2, ry + 6.5);
    }

    // Score
    if (isAwaited || row.score === undefined) {
      doc.setFont("helvetica", "italic"); doc.setFontSize(8.5); doc.setTextColor(PUR, PUG, PUB);
      doc.text("Awaited", cxSco, ry + 6.5, { align: "center" });
    } else {
      doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(DR, DG, DB);
      doc.text(String(row.score), cxSco, ry + 6.5, { align: "center" });
      totalScore += row.score;
    }

    // Max
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(SR, SG, SB);
    doc.text(String(row.maxMarks), cxMax, ry + 6.5, { align: "center" });
    totalMax += row.maxMarks;

    // Grade — coloured
    if (row.grade && !isAwaited) {
      const [r_, g_, b_] = gradeRGB(row.grade);
      doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(r_, g_, b_);
      doc.text(row.grade, cxGrd, ry + 6.5, { align: "center" });
    } else {
      doc.setFont("helvetica", "italic"); doc.setFontSize(8.5); doc.setTextColor(PUR, PUG, PUB);
      doc.text("\u2014", cxGrd, ry + 6.5, { align: "center" });
    }
  });

  y += rows.length * ROW_H;

  // Total row
  doc.setFillColor(NR, NG, NB);
  doc.rect(L, y, CW, 10, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(255, 255, 255);
  doc.text("TOTAL", xSub + 2, y + 7);
  if (!isAwaited) {
    doc.text(String(totalScore), cxSco, y + 7, { align: "center" });
  } else {
    doc.setFont("helvetica", "italic");
    doc.text("\u2014", cxSco, y + 7, { align: "center" });
  }
  doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(200, 210, 225);
  doc.text(String(totalMax), cxMax, y + 7, { align: "center" });

  y += 10;
  return { y, totalScore, totalMax };
}

function drawSignatureBlock(doc: jsPDF, y: number): number {
  doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(SR, SG, SB);
  doc.text("Generated: 28 March 2026", L, y);

  doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(SR, SG, SB);
  doc.text("_______________________", R, y, { align: "right" });
  doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(DR, DG, DB);
  doc.text("Dr. S.K. Bansal", R, y + 6, { align: "right" });
  doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(SR, SG, SB);
  doc.text("University Registrar", R, y + 11, { align: "right" });
  doc.text("Shoolini University", R, y + 16, { align: "right" });

  return y + 20;
}

function drawPageFooter(doc: jsPDF) {
  doc.setDrawColor(GR, GG, GB); doc.setLineWidth(0.5);
  doc.line(0, 275, PW, 275);
  doc.setFont("helvetica", "normal"); doc.setFontSize(6.5); doc.setTextColor(SR, SG, SB);
  doc.text(
    "Registrar, Shoolini University  |  registrar@shooliniuniversity.com  |  +91 7018007000",
    105, 279, { align: "center" }
  );
  doc.text(
    "NAAC B+  |  UGC Certified  |  Established 2009  |  shooliniuniversity.com",
    105, 284, { align: "center" }
  );
  doc.setFillColor(NR, NG, NB);
  doc.rect(0, 288, PW, 9, "F");
  doc.setFont("helvetica", "normal"); doc.setFontSize(6); doc.setTextColor(255, 255, 255);
  doc.text(
    "Shoolini University of Biotechnology and Management Sciences  |  shooliniuniversity.com",
    105, 293.5, { align: "center" }
  );
}

// ── Public types ─────────────────────────────────────────────────────────────
export interface MarksheetRow {
  subject: string;
  score?: number;
  maxMarks: number;
  grade?: string;
  faculty?: string;
  date?: string;
}

// ── generateMarksheetPDF ─────────────────────────────────────────────────────
export async function generateMarksheetPDF(params: {
  filename: string;
  title: string;
  subtitle?: string;
  semester: number;
  examPeriod: string;
  rows: MarksheetRow[];
  isAwaited?: boolean;
  watermarkText?: string;
  gradeScale?: string;
}): Promise<void> {
  const {
    filename, title, semester, examPeriod, rows,
    isAwaited = false, watermarkText, gradeScale,
  } = params;

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const logo = await getLogoBase64(logoUrl);

  // Header — title appears only here (not repeated below)
  drawPageHeader(doc, logo, title);

  // Optional diagonal watermark for awaited results
  if (isAwaited && watermarkText) {
    doc.setFont("helvetica", "bold"); doc.setFontSize(40); doc.setTextColor(PUR, PUG, PUB);
    doc.setGState(new (doc as any).GState({ opacity: 0.07 }));
    doc.text(watermarkText, 105, 148, { align: "center", angle: 45 });
    doc.setGState(new (doc as any).GState({ opacity: 1 }));
  }

  // Meta bar with exam period + badge
  drawDocumentMeta(doc, examPeriod, isAwaited);

  // Student details block
  let y = 50;
  y = drawStudentBlock(doc, y, semester) + 6;

  // Results table
  const { y: afterTable } = drawMarksheetTable(doc, y, rows, isAwaited);
  y = afterTable + 8;

  // Grade scale
  if (gradeScale) {
    doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(SR, SG, SB);
    doc.text(`Grade Scale: ${gradeScale}`, 105, y, { align: "center" });
    y += 10;
  }

  hLine(doc, y, 221, 225, 231);
  y += 6;

  drawSignatureBlock(doc, y);
  drawPageFooter(doc);
  doc.save(`DetailedResult_Sem${semester}_${student.rollNo}_KoushikThalari.pdf`);
}

// ── generatePracticalSchedulePDF ─────────────────────────────────────────────
export async function generatePracticalSchedulePDF(params: {
  filename: string;
  semester: number;
  rows: { subject: string; date: string; time: string; room: string; duration: string }[];
}): Promise<void> {
  const { filename, semester, rows } = params;

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const logo = await getLogoBase64(logoUrl);

  drawPageHeader(doc, logo, "PRACTICAL EXAMINATION SCHEDULE");
  drawDocumentMeta(doc, semester === 1 ? "Jan 16 \u2013 Jan 17, 2026" : "May 22 \u2013 May 24, 2026", false);

  let y = 50;
  y = drawStudentBlock(doc, y, semester) + 8;

  // Column geometry: Sub=80, Date=35, Time=33, Room=22, Dur=10 → total=180
  const PCOL = {
    sub: { x: L, w: 80, cx: L + 40 },
    date: { x: L + 80, w: 35, cx: L + 97.5 },
    time: { x: L + 115, w: 33, cx: L + 131.5 },
    room: { x: L + 148, w: 20, cx: L + 158 },
    dur: { x: L + 168, w: 12, cx: L + 174 },
  };

  // Header
  doc.setFillColor(NR, NG, NB);
  doc.rect(L, y, CW, 9, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(255, 255, 255);
  doc.text("SUBJECT", PCOL.sub.x + 2, y + 6);
  doc.text("DATE", PCOL.date.cx, y + 6, { align: "center" });
  doc.text("TIME", PCOL.time.cx, y + 6, { align: "center" });
  doc.text("ROOM", PCOL.room.cx, y + 6, { align: "center" });
  doc.text("DURATION", PCOL.dur.cx, y + 6, { align: "center" });
  y += 9;

  const ROW_H = 10;
  rows.forEach((row, i) => {
    if (i % 2 === 1) { doc.setFillColor(248, 250, 252); doc.rect(L, y, CW, ROW_H, "F"); }
    doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(DR, DG, DB);
    doc.text(row.subject, PCOL.sub.x + 2, y + 6.5);
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(DR, DG, DB);
    doc.text(row.date, PCOL.date.cx, y + 6.5, { align: "center" });
    doc.text(row.time, PCOL.time.cx, y + 6.5, { align: "center" });
    doc.text(row.room, PCOL.room.cx, y + 6.5, { align: "center" });
    doc.text(row.duration, PCOL.dur.cx, y + 6.5, { align: "center" });
    doc.setDrawColor(221, 225, 231); doc.setLineWidth(0.2);
    doc.line(L, y + ROW_H, R, y + ROW_H);
    y += ROW_H;
  });

  y += 10;
  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(NR, NG, NB);
  doc.text("Instructions:", L, y); y += 5;
  const instrs = [
    "1. Students must bring their admit card / hall ticket to the examination hall.",
    "2. Lab equipment will be provided. Personal electronic devices are not allowed.",
    "3. Report 30 minutes before the scheduled time. Late entry is not permitted.",
    "4. Viva voce will be conducted along with the practical examination.",
  ];
  doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(55, 65, 81);
  instrs.forEach(t => { doc.text(t, L, y); y += 5.5; });

  hLine(doc, y + 6, 221, 225, 231);
  drawSignatureBlock(doc, y + 12);
  drawPageFooter(doc);
  doc.save(`SU_PracticalSchedule_Sem${semester}_${student.rollNo}_KoushikThalari.pdf`);
}
