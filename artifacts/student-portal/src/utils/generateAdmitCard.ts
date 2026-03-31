import { jsPDF } from "jspdf";
import { student } from "../data/studentData";
import { PDF_COLORS, PAGE_GEOMETRY, getWhiteLogoBase64, drawHLine, drawStandardFooter } from "./pdfCommon";
import logoUrl from "../assets/shoolini-logo.png";

// ── Column geometry (must sum to CW = 180) ──────────────────────────────────
// Subject=55, Date=32, Time=32, Duration=20, Room=22, InvCode=19  →  total=180
const COL = {
  sub:  { x: PAGE_GEOMETRY.MARGIN,       w: 55, cx: PAGE_GEOMETRY.MARGIN + 27.5 },
  date: { x: PAGE_GEOMETRY.MARGIN + 55,  w: 32, cx: PAGE_GEOMETRY.MARGIN + 71   },
  time: { x: PAGE_GEOMETRY.MARGIN + 87,  w: 32, cx: PAGE_GEOMETRY.MARGIN + 103  },
  dur:  { x: PAGE_GEOMETRY.MARGIN + 119, w: 20, cx: PAGE_GEOMETRY.MARGIN + 129  },
  room: { x: PAGE_GEOMETRY.MARGIN + 139, w: 22, cx: PAGE_GEOMETRY.MARGIN + 150  },
  inv:  { x: PAGE_GEOMETRY.MARGIN + 161, w: 19, cx: PAGE_GEOMETRY.MARGIN + 170.5 },
};

function vLine(doc: jsPDF, x: number, y1: number, y2: number) {
  doc.setDrawColor(221, 225, 231); doc.setLineWidth(0.2);
  doc.line(x, y1, x, y2);
}

// ── Public interface ─────────────────────────────────────────────────────────
export interface AdmitCardScheduleRow {
  subject: string;
  date: string;
  time: string;
  duration: string;
  room: string;
  invigilatorCode?: string;
}

/**
 * Asynchronously generates and saves an Admit Card PDF for a student.
 * @param params Object containing student schedule and exam metadata.
 */
export async function generateAdmitCard(params: {
  filename: string;
  examType: string;
  semester: number;
  examCenter?: string;
  centerCode?: string;
  schedule: AdmitCardScheduleRow[];
  isReleased?: boolean;
  unreleased?: boolean;
}): Promise<void> {
  const {
    filename, examType, semester, schedule,
    examCenter = "Shoolini University Main Campus, Solan",
    centerCode  = "SU-MCE-01",
    isReleased  = true,
    unreleased  = false,
  } = params;

  const doc  = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const logo = await getWhiteLogoBase64(logoUrl);

  // ── SECTION 1 — HEADER STRIP (y 0–38) ─────────────────────────────────────
  doc.setFillColor(PDF_COLORS.NAVY.r, PDF_COLORS.NAVY.g, PDF_COLORS.NAVY.b);
  doc.rect(0, 0, PAGE_GEOMETRY.WIDTH, 38, "F");

  // Logo circle — radius 9, center (20,11), stays above gold line at y=24
  doc.setFillColor(255, 255, 255);
  doc.ellipse(20, 11, 9, 9, "F");
  if (logo) {
    try { doc.addImage(logo, "PNG", 12, 3, 16, 16); } catch { /* ok */ }
  } else {
    doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(PDF_COLORS.NAVY.r, PDF_COLORS.NAVY.g, PDF_COLORS.NAVY.b);
    doc.text("SU", 20, 13, { align: "center" });
  }

  doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.setTextColor(255, 255, 255);
  doc.text("SHOOLINI UNIVERSITY", 105, 14, { align: "center" });

  doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(200, 210, 225);
  doc.text("Kasauli Hills, Solan, Himachal Pradesh \u2014 173229", 105, 20, { align: "center" });

  doc.setDrawColor(PDF_COLORS.GOLD.r, PDF_COLORS.GOLD.g, PDF_COLORS.GOLD.b); doc.setLineWidth(0.8);
  doc.line(0, 24, PAGE_GEOMETRY.WIDTH, 24);

  doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.setTextColor(PDF_COLORS.GOLD.r, PDF_COLORS.GOLD.g, PDF_COLORS.GOLD.b);
  doc.text("ADMIT CARD / HALL TICKET", 105, 30, { align: "center" });

  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(255, 255, 255);
  doc.text(`${examType.toUpperCase()} \u2014 SEMESTER ${semester}`, 105, 36, { align: "center" });

  // ── UNRELEASED WATERMARK ───────────────────────────────────────────────────
  if (unreleased) {
    doc.setFont("helvetica", "bold"); doc.setFontSize(36); doc.setTextColor(180, 40, 40);
    doc.setGState(new (doc as any).GState({ opacity: 0.08 }));
    doc.text("TO BE RELEASED", 105, 155, { align: "center", angle: 35 });
    doc.setGState(new (doc as any).GState({ opacity: 1 }));
    doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.setTextColor(180, 40, 40);
    doc.text("ADMIT CARD NOT YET RELEASED", 105, 65, { align: "center" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(PDF_COLORS.SLATE.r, PDF_COLORS.SLATE.g, PDF_COLORS.SLATE.b);
    doc.text("This admit card will be available once released by the Examination Board.", 105, 74, { align: "center" });
    doc.text("Please check back closer to the examination date.", 105, 81, { align: "center" });
    drawStandardFooter(doc); doc.save(filename); return;
  }

  // ── SECTION 2 — NOTICE BAR (y 42–50) ──────────────────────────────────────
  doc.setFillColor(254, 249, 238);
  doc.setDrawColor(PDF_COLORS.GOLD.r, PDF_COLORS.GOLD.g, PDF_COLORS.GOLD.b); doc.setLineWidth(0.3);
  doc.rect(PAGE_GEOMETRY.MARGIN, 42, PAGE_GEOMETRY.CONTENT, 8, "FD");
  doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(217, 119, 6);
  doc.text(
    "IMPORTANT: This admit card must be produced at the examination hall. Roll No must match ID proof.",
    105, 47, { align: "center" }
  );

  // ── SECTION 3 — STUDENT INFO (left x 15–130) + PHOTO BOX (right x 138–195) ──
  // Photo placeholder box: x=138, y=52, w=57, h=68
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(221, 225, 231); doc.setLineWidth(0.5);
  doc.rect(138, 52, 57, 68, "FD");

  doc.setLineDashPattern([2, 2], 0);
  doc.setDrawColor(PDF_COLORS.SLATE.r, PDF_COLORS.SLATE.g, PDF_COLORS.SLATE.b); doc.setLineWidth(0.3);
  doc.rect(140, 54, 53, 64, "S");
  doc.setLineDashPattern([], 0);

  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(PDF_COLORS.SLATE.r, PDF_COLORS.SLATE.g, PDF_COLORS.SLATE.b);
  doc.text("PHOTO", 166.5, 82, { align: "center" });
  doc.setFontSize(7); doc.setTextColor(148, 163, 184);
  doc.text("(Passport size)", 166.5, 88, { align: "center" });

  // Student details — 8 fields, each 9mm tall (label=3mm, value=4.5mm, gap=1.5mm)
  const fields: [string, string][] = [
    ["STUDENT NAME", student.name],
    ["ROLL NUMBER",  student.rollNo],
    ["ENROLLMENT NO",student.enrollmentNo],
    ["REGISTRATION", student.registrationNo],
    ["PROGRAM",      student.program],
    ["DEPARTMENT",   student.department],
    ["SEMESTER",     `Semester ${semester}  |  Batch: ${student.batch}`],
    ["EXAM CENTER",  examCenter],
    ["CENTER CODE",  centerCode],
    ["ACADEMIC YEAR","2025\u20132026"],
  ];

  let fy = 57;
  fields.forEach(([lbl, val]) => {
    doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(PDF_COLORS.SLATE.r, PDF_COLORS.SLATE.g, PDF_COLORS.SLATE.b);
    doc.text(lbl, PAGE_GEOMETRY.MARGIN, fy);
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(PDF_COLORS.DARK.r, PDF_COLORS.DARK.g, PDF_COLORS.DARK.b);
    const safe = doc.splitTextToSize(val, 118)[0] as string;
    doc.text(safe, PAGE_GEOMETRY.MARGIN, fy + 4.5);
    fy += 9;
  });
  // fy ≈ 57 + 8×9 = 129

  // University seal — below photo box (photo bottom = 52+68 = 120)
  const SEAL_CX = 166.5;
  const SEAL_CY = 136;
  doc.setDrawColor(PDF_COLORS.NAVY.r, PDF_COLORS.NAVY.g, PDF_COLORS.NAVY.b); doc.setLineWidth(0.5);
  doc.ellipse(SEAL_CX, SEAL_CY, 14, 14, "S");
  doc.setDrawColor(PDF_COLORS.GOLD.r, PDF_COLORS.GOLD.g, PDF_COLORS.GOLD.b); doc.setLineWidth(0.3);
  doc.ellipse(SEAL_CX, SEAL_CY, 11, 11, "S");
  doc.setFont("helvetica", "bold"); doc.setFontSize(5.5); doc.setTextColor(PDF_COLORS.NAVY.r, PDF_COLORS.NAVY.g, PDF_COLORS.NAVY.b);
  doc.text("UNIVERSITY", SEAL_CX, SEAL_CY - 1, { align: "center" });
  doc.text("SEAL",       SEAL_CX, SEAL_CY + 3.5, { align: "center" });

  // Divider after info block
  drawHLine(doc, 155, 221, 225, 231, 0.3);

  // ── SECTION 4 — EXAMINATION SCHEDULE TABLE ────────────────────────────────
  doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(PDF_COLORS.NAVY.r, PDF_COLORS.NAVY.g, PDF_COLORS.NAVY.b);
  doc.text("EXAMINATION SCHEDULE", PAGE_GEOMETRY.MARGIN, 162);

  // Table header
  const TH = 167; // table header top
  const TH_H = 9;
  doc.setFillColor(PDF_COLORS.NAVY.r, PDF_COLORS.NAVY.g, PDF_COLORS.NAVY.b);
  doc.rect(PAGE_GEOMETRY.MARGIN, TH, PAGE_GEOMETRY.CONTENT, TH_H, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(255, 255, 255);
  doc.text("SUBJECT",   COL.sub.x + 2,  TH + 6);
  doc.text("DATE",      COL.date.cx,     TH + 6, { align: "center" });
  doc.text("TIME",      COL.time.cx,     TH + 6, { align: "center" });
  doc.text("DURATION",  COL.dur.cx,      TH + 6, { align: "center" });
  doc.text("ROOM",      COL.room.cx,     TH + 6, { align: "center" });
  doc.text("INV. CODE", COL.inv.cx,      TH + 6, { align: "center" });

  // Data rows
  const ROW_H = 9;
  let rowY = TH + TH_H;
  schedule.forEach((row, i) => {
    if (i % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(PAGE_GEOMETRY.MARGIN, rowY, PAGE_GEOMETRY.CONTENT, ROW_H, "F");
    }
    const subj = row.subject.length > 26 ? row.subject.substring(0, 25) + "\u2026" : row.subject;
    doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(PDF_COLORS.DARK.r, PDF_COLORS.DARK.g, PDF_COLORS.DARK.b);
    doc.text(subj, COL.sub.x + 2, rowY + 6);

    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(PDF_COLORS.DARK.r, PDF_COLORS.DARK.g, PDF_COLORS.DARK.b);
    doc.text(row.date,                          COL.date.cx, rowY + 6, { align: "center" });
    doc.text(row.time,                          COL.time.cx, rowY + 6, { align: "center" });
    doc.text(row.duration,                      COL.dur.cx,  rowY + 6, { align: "center" });
    doc.text(row.room,                          COL.room.cx, rowY + 6, { align: "center" });
    doc.text(row.invigilatorCode ?? "INV-00",   COL.inv.cx,  rowY + 6, { align: "center" });

    doc.setDrawColor(221, 225, 231); doc.setLineWidth(0.2);
    doc.line(PAGE_GEOMETRY.MARGIN, rowY + ROW_H, PAGE_GEOMETRY.RIGHT, rowY + ROW_H);
    rowY += ROW_H;
  });

  // Vertical column separators for the full table height
  [COL.date.x, COL.time.x, COL.dur.x, COL.room.x, COL.inv.x].forEach(sx => {
    vLine(doc, sx, TH, rowY);
  });

  // ── SECTION 5 — INSTRUCTIONS ───────────────────────────────────────────────
  let iy = rowY + 7;
  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(PDF_COLORS.NAVY.r, PDF_COLORS.NAVY.g, PDF_COLORS.NAVY.b);
  doc.text("IMPORTANT INSTRUCTIONS", PAGE_GEOMETRY.MARGIN, iy);
  iy += 5;

  const instructions = [
    "1. Bring a valid government-issued photo ID (Aadhaar Card / Passport) along with this admit card.",
    "2. Mobile phones, smart watches, or any electronic devices are strictly prohibited in the exam hall.",
    "3. Report at least 30 minutes before the scheduled start time of the examination.",
    "4. Students are not allowed to enter the hall after 15 minutes from the start of the exam.",
    "5. Use only blue or black ballpoint pen. Pencil is permitted only for diagrams and rough work.",
    "6. Do not communicate with other students or exchange stationery during the examination.",
    "7. Any form of malpractice will result in immediate disqualification and disciplinary action.",
    "8. This admit card is non-transferable and valid only for the examination session mentioned above.",
  ];
  doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(55, 65, 81);
  instructions.forEach(line => { doc.text(line, PAGE_GEOMETRY.MARGIN, iy); iy += 5.5; });

  // ── SECTION 6 — SIGNATURE BLOCK ───────────────────────────────────────────
  const sy = iy + 4;

  // Left — student signature
  doc.setDrawColor(148, 163, 184); doc.setLineWidth(0.3);
  doc.line(PAGE_GEOMETRY.MARGIN, sy, PAGE_GEOMETRY.MARGIN + 55, sy);
  doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(PDF_COLORS.SLATE.r, PDF_COLORS.SLATE.g, PDF_COLORS.SLATE.b);
  doc.text("Student Signature:", PAGE_GEOMETRY.MARGIN, sy + 4);

  // Centre — valid stamp
  doc.setFillColor(220, 252, 231);
  doc.setDrawColor(22, 163, 74); doc.setLineWidth(0.5);
  doc.roundedRect(80, sy - 5, 50, 12, 3, 3, "FD");
  doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(21, 128, 61);
  doc.text(
    isReleased ? "ADMIT CARD VALID" : "PENDING RELEASE",
    105, sy + 2.5, { align: "center" }
  );

  // Right — Controller signature
  doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(PDF_COLORS.DARK.r, PDF_COLORS.DARK.g, PDF_COLORS.DARK.b);
  doc.text("Dr. K.L. Sharma", PAGE_GEOMETRY.RIGHT, sy - 4, { align: "right" });
  doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(PDF_COLORS.SLATE.r, PDF_COLORS.SLATE.g, PDF_COLORS.SLATE.b);
  doc.text("Controller of Examinations", PAGE_GEOMETRY.RIGHT, sy + 1, { align: "right" });
  doc.text("Shoolini University",        PAGE_GEOMETRY.RIGHT, sy + 6, { align: "right" });

  drawStandardFooter(doc);
  doc.save(filename);
}
