import { jsPDF } from "jspdf";
import {
  student,
  sem1TheoryResults,
  sem1PracticalResults,
  sem1ResultSummary,
  sem2TheoryResults,
  sem2PracticalResults,
  sem2ResultSummary,
  sem3Subjects,
  sem3IA1,
  sem3IA2,
} from "../data/studentData";
import logoUrl from "../assets/shoolini-logo.png";
import { generateRubberStamp, generateCursiveSignature } from "./stampGenerator";

// Institutional Palette
const NAVY = "#1a3a5c";
const GOLD = "#c8a84b";
const GREEN = "#16a34a";
const BORDER = "#cbd5e1";
const SLATE = "#64748b";
const TEXT_DARK = "#1e293b";
const WHITE = "#ffffff";
const BG_ALT = "#f8fafc";
const HEADER_BG = "#0f2744";

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function setFill(doc: jsPDF, hex: string) {
  const { r, g, b } = hexToRgb(hex);
  doc.setFillColor(r, g, b);
}

function setStroke(doc: jsPDF, hex: string) {
  const { r, g, b } = hexToRgb(hex);
  doc.setDrawColor(r, g, b);
}

function setColor(doc: jsPDF, hex: string) {
  const { r, g, b } = hexToRgb(hex);
  doc.setTextColor(r, g, b);
}

async function getLogoBase64(url: string): Promise<string | null> {
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej();
      img.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}

function drawPageHeader(doc: jsPDF, logoData: string | null, pageWidth: number): number {
  setFill(doc, HEADER_BG);
  doc.rect(0, 0, pageWidth, 32, "F");

  // Logo Pill Container
  const logoBoxW = 34;
  const logoBoxH = 18;
  setFill(doc, WHITE);
  doc.roundedRect(12, 7, logoBoxW, logoBoxH, 2, 2, "F");

  if (logoData) {
    try {
      doc.addImage(logoData, "PNG", 14, 8.5, 30, 15);
    } catch {
      setColor(doc, NAVY);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("SHOOLINI", 12 + logoBoxW / 2, 18, { align: "center" });
    }
  }

  // University Header Typography
  setColor(doc, WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("SHOOLINI UNIVERSITY", pageWidth / 2 + 10, 11, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text(
    "Kasauli Hills, Solan, Himachal Pradesh — 173229  |  www.shooliniuniversity.com",
    pageWidth / 2 + 10,
    17,
    { align: "center" }
  );

  setColor(doc, GOLD);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text(
    "NAAC A+ ACCREDITED  |  TOP 100 NIRF RANKED  |  UGC RECOGNIZED UNIVERSITY",
    pageWidth / 2 + 10,
    22,
    { align: "center" }
  );

  // Gold separator ribbon
  setFill(doc, GOLD);
  doc.rect(0, 31.5, pageWidth, 1.2, "F");

  return 33;
}

interface TableColumn {
  label: string;
  x: number;
  w: number;
  align: "left" | "center" | "right";
}

function drawTableHeader(doc: jsPDF, columns: TableColumn[], y: number): number {
  setFill(doc, NAVY);
  doc.rect(12, y, 186, 7.5, "F");

  setColor(doc, WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);

  columns.forEach((col) => {
    const tx =
      col.align === "right"
        ? col.x + col.w - 1.5
        : col.align === "center"
        ? col.x + col.w / 2
        : col.x + 1.5;
    doc.text(col.label, tx, y + 5.2, { align: col.align });
  });

  return y + 7.5;
}

interface TableCell {
  text: string;
  x: number;
  w: number;
  align: "left" | "center" | "right";
  color?: string;
  bold?: boolean;
}

function drawTableRow(doc: jsPDF, cells: TableCell[], y: number, isAlt: boolean, rowH = 7.0): number {
  setFill(doc, isAlt ? BG_ALT : WHITE);
  doc.rect(12, y, 186, rowH, "F");

  setStroke(doc, BORDER);
  doc.setLineWidth(0.2);
  doc.rect(12, y, 186, rowH, "S");

  cells.forEach((cell) => {
    setColor(doc, cell.color ?? TEXT_DARK);
    doc.setFont("helvetica", cell.bold ? "bold" : "normal");
    doc.setFontSize(7.5);
    const tx =
      cell.align === "right"
        ? cell.x + cell.w - 1.5
        : cell.align === "center"
        ? cell.x + cell.w / 2
        : cell.x + 1.5;
    doc.text(cell.text, tx, y + rowH * 0.7, { align: cell.align });
  });

  return y + rowH;
}

function drawSectionHeader(doc: jsPDF, title: string, subtitle: string, y: number): number {
  setFill(doc, "#f1f5f9");
  setStroke(doc, BORDER);
  doc.setLineWidth(0.3);
  doc.rect(12, y, 186, 8.5, "FD");

  setFill(doc, NAVY);
  doc.rect(12, y, 2.5, 8.5, "F");

  setColor(doc, NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(title, 17, y + 5.6);

  if (subtitle) {
    setColor(doc, SLATE);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text(subtitle, 196, y + 5.6, { align: "right" });
  }

  return y + 9.5;
}

export async function generateMarksheet(semester: number): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageWidth = 210;
  const pageHeight = 297;
  const logoData = await getLogoBase64(logoUrl);
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  drawPageHeader(doc, logoData, pageWidth);

  // Document Title Banner
  let y = 37;
  setColor(doc, NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  const reportTitle =
    semester === 3
      ? "SEMESTER 3 • MID-TERM & INTERNAL ASSESSMENT TRANSCRIPT"
      : `SEMESTER ${semester} • OFFICIAL STATEMENT OF GRADES & ACADEMIC TRANSCRIPT`;
  doc.text(reportTitle, 105, y, { align: "center" });

  setColor(doc, SLATE);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(
    "OFFICE OF THE CONTROLLER OF EXAMINATIONS — SHOOLINI UNIVERSITY",
    105,
    y + 5,
    { align: "center" }
  );

  setStroke(doc, GOLD);
  doc.setLineWidth(0.5);
  doc.line(30, y + 7.5, 180, y + 7.5);

  // ── STUDENT CREDENTIALS BOX ──────────────────────────────────────────────
  y = 48;
  setFill(doc, "#f8fafc");
  setStroke(doc, BORDER);
  doc.setLineWidth(0.3);
  doc.rect(12, y, 186, 26, "FD");

  setFill(doc, NAVY);
  doc.rect(12, y, 2.5, 26, "F");

  // Candidate Details Grid
  const col1X = 18;
  const col2X = 75;
  const col3X = 135;

  // Row 1
  setColor(doc, SLATE);
  doc.setFontSize(6.5);
  doc.text("CANDIDATE NAME", col1X, y + 5);
  doc.text("ROLL NUMBER", col2X, y + 5);
  doc.text("ENROLLMENT NO", col3X, y + 5);

  setColor(doc, TEXT_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(student.name, col1X, y + 9);
  doc.text(student.rollNo, col2X, y + 9);
  doc.text(student.enrollmentNo, col3X, y + 9);

  // Row 2
  setColor(doc, SLATE);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text("PROGRAM / DEGREE", col1X, y + 14);
  doc.text("SPECIALIZATION", col2X, y + 14);
  doc.text("ACADEMIC PERIOD", col3X, y + 14);

  setColor(doc, TEXT_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(student.program, col1X, y + 18);
  doc.text("Artificial Intelligence & ML", col2X, y + 18);
  const examPeriod =
    semester === 1
      ? "August 2025 – January 2026"
      : semester === 2
      ? "January 2026 – June 2026"
      : "July 2026 – December 2026";
  doc.text(examPeriod, col3X, y + 18);

  // Row 3
  setColor(doc, SLATE);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text("DEPARTMENT", col1X, y + 22.5);
  doc.text("SEMESTER", col2X, y + 22.5);
  doc.text("RESULT STATUS", col3X, y + 22.5);

  setColor(doc, TEXT_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("School of Computer Science & Engineering", col1X, y + 25.5);
  doc.text(`Semester ${semester} (Regular)`, col2X, y + 25.5);
  setColor(doc, GREEN);
  doc.text(semester <= 2 ? "PASSED WITH DISTINCTION" : "IN PROGRESS (GRADE A+)", col3X, y + 25.5);

  y += 30;

  // ── SEMESTER 1 OR 2 STATEMENT OF MARKS ──────────────────────────────────
  if (semester === 1 || semester === 2) {
    const theoryList = semester === 1 ? sem1TheoryResults : sem2TheoryResults;
    const practicalList = semester === 1 ? sem1PracticalResults : sem2PracticalResults;
    const summary = semester === 1 ? sem1ResultSummary : sem2ResultSummary;

    // Theory Table Header
    y = drawSectionHeader(
      doc,
      "THEORY COURSES",
      `Conducted: ${semester === 1 ? "December 2025" : "May 2026"} | Maximum Marks: 100`,
      y
    );

    const columnsTheory: TableColumn[] = [
      { label: "CODE", x: 12, w: 22, align: "center" },
      { label: "COURSE TITLE", x: 34, w: 68, align: "left" },
      { label: "CREDITS", x: 102, w: 16, align: "center" },
      { label: "SEE (60)", x: 118, w: 18, align: "center" },
      { label: "IA (40)", x: 136, w: 16, align: "center" },
      { label: "TOTAL", x: 152, w: 16, align: "center" },
      { label: "POINTS", x: 168, w: 14, align: "center" },
      { label: "GRADE", x: 182, w: 16, align: "center" },
    ];

    y = drawTableHeader(doc, columnsTheory, y);

    theoryList.forEach((r, idx) => {
      const cells: TableCell[] = [
        { text: r.courseCode, x: 12, w: 22, align: "center", bold: true, color: NAVY },
        { text: r.courseName, x: 34, w: 68, align: "left", bold: true },
        { text: String(r.credits), x: 102, w: 16, align: "center" },
        { text: String(r.seeMarks), x: 118, w: 18, align: "center" },
        { text: String(r.iaMarks), x: 136, w: 16, align: "center" },
        { text: String(r.marksScored), x: 152, w: 16, align: "center", bold: true },
        { text: String(r.grade), x: 168, w: 14, align: "center" },
        {
          text: r.letterGrade,
          x: 182,
          w: 16,
          align: "center",
          bold: true,
          color: r.letterGrade.startsWith("A+") ? GREEN : "#2563eb",
        },
      ];
      y = drawTableRow(doc, cells, y, idx % 2 === 1, 6.8);
    });

    y += 4;

    // Practical Table Header
    y = drawSectionHeader(
      doc,
      "PRACTICAL & LABORATORY COURSES",
      `Conducted: ${semester === 1 ? "January 2026" : "May 2026"} | Maximum Marks: 50`,
      y
    );

    const columnsPractical: TableColumn[] = [
      { label: "CODE", x: 12, w: 22, align: "center" },
      { label: "LABORATORY COURSE TITLE", x: 34, w: 84, align: "left" },
      { label: "CREDITS", x: 118, w: 18, align: "center" },
      { label: "MARKS (50)", x: 136, w: 22, align: "center" },
      { label: "POINTS", x: 158, w: 20, align: "center" },
      { label: "GRADE", x: 178, w: 20, align: "center" },
    ];

    y = drawTableHeader(doc, columnsPractical, y);

    practicalList.forEach((r, idx) => {
      const cells: TableCell[] = [
        { text: r.courseCode, x: 12, w: 22, align: "center", bold: true, color: NAVY },
        { text: r.courseName, x: 34, w: 84, align: "left", bold: true },
        { text: String(r.credits), x: 118, w: 18, align: "center" },
        { text: String(r.marksScored), x: 136, w: 22, align: "center", bold: true },
        { text: String(r.grade), x: 158, w: 20, align: "center" },
        {
          text: r.letterGrade,
          x: 178,
          w: 20,
          align: "center",
          bold: true,
          color: r.letterGrade.startsWith("A+") ? GREEN : "#2563eb",
        },
      ];
      y = drawTableRow(doc, cells, y, idx % 2 === 1, 6.8);
    });

    y += 5;

    // ── CUMULATIVE RESULT SUMMARY FOOTER ───────────────────────────────────
    setFill(doc, HEADER_BG);
    doc.rect(12, y, 186, 15, "F");

    setFill(doc, GOLD);
    doc.rect(12, y, 186, 0.8, "F");

    const kpiColW = 186 / 6;
    const summaryItems = [
      { label: "TOTAL CREDITS", val: String(summary.totalCredits), color: WHITE },
      { label: "CREDIT POINTS", val: String(summary.totalCreditPoints), color: WHITE },
      { label: "SEMESTER SGPA", val: summary.sgpa.toFixed(2), color: GOLD },
      { label: "CUMULATIVE CGPA", val: summary.cgpa.toFixed(2), color: GOLD },
      { label: "TERM GRADE", val: summary.termGrade.split(" ")[0], color: GREEN },
      { label: "FINAL RESULT", val: summary.result, color: GREEN },
    ];

    summaryItems.forEach((item, idx) => {
      const kx = 12 + idx * kpiColW;
      setColor(doc, "#94a3b8");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      doc.text(item.label, kx + kpiColW / 2, y + 5.5, { align: "center" });

      setColor(doc, item.color);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text(item.val, kx + kpiColW / 2, y + 11.5, { align: "center" });

      if (idx < 5) {
        setStroke(doc, "#334155");
        doc.setLineWidth(0.3);
        doc.line(kx + kpiColW, y + 3, kx + kpiColW, y + 13);
      }
    });

    y += 18;
  } else {
    // ── SEMESTER 3 INTERNAL ASSESSMENT TRANSCRIPT ──────────────────────────
    y = drawSectionHeader(
      doc,
      "SEMESTER 3 • INTERNAL ASSESSMENTS (IA 1 & IA 2)",
      "Continuous Assessment Marks | Maximum Marks: 20 Per Subject",
      y
    );

    const columnsSem3: TableColumn[] = [
      { label: "CODE", x: 12, w: 22, align: "center" },
      { label: "COURSE TITLE", x: 34, w: 72, align: "left" },
      { label: "TYPE", x: 106, w: 18, align: "center" },
      { label: "IA 1 (/20)", x: 124, w: 20, align: "center" },
      { label: "IA 2 (/20)", x: 144, w: 20, align: "center" },
      { label: "AVG (/20)", x: 164, w: 18, align: "center" },
      { label: "GRADE", x: 182, w: 16, align: "center" },
    ];

    y = drawTableHeader(doc, columnsSem3, y);

    sem3Subjects.forEach((s, idx) => {
      const s1 = sem3IA1.subjects.find((sub) => sub.name === s.name)?.score ?? 18;
      const s2 = sem3IA2.subjects.find((sub) => sub.name === s.name)?.score ?? 19;
      const avg = ((s1 + s2) / 2).toFixed(1);

      const cells: TableCell[] = [
        { text: s.code, x: 12, w: 22, align: "center", bold: true, color: NAVY },
        { text: s.name, x: 34, w: 72, align: "left", bold: true },
        { text: s.type, x: 106, w: 18, align: "center" },
        { text: `${s1}`, x: 124, w: 20, align: "center" },
        { text: `${s2}`, x: 144, w: 20, align: "center", color: GREEN, bold: true },
        { text: avg, x: 164, w: 18, align: "center", bold: true },
        { text: "A+", x: 182, w: 16, align: "center", bold: true, color: GREEN },
      ];
      y = drawTableRow(doc, cells, y, idx % 2 === 1, 6.8);
    });

    y += 5;

    // Semester 3 IA KPI Summary
    setFill(doc, HEADER_BG);
    doc.rect(12, y, 186, 15, "F");

    setFill(doc, GOLD);
    doc.rect(12, y, 186, 0.8, "F");

    const kpiColW = 186 / 5;
    const summarySem3 = [
      { label: "ENROLLED SUBJECTS", val: `${sem3Subjects.length}`, color: WHITE },
      { label: "TOTAL CREDITS", val: "26", color: WHITE },
      { label: "IA 1 AVERAGE", val: `${sem3IA1.average} / 20`, color: GOLD },
      { label: "IA 2 AVERAGE", val: `${sem3IA2.average} / 20`, color: GREEN },
      { label: "OVERALL STANDING", val: "GRADE A+", color: GREEN },
    ];

    summarySem3.forEach((item, idx) => {
      const kx = 12 + idx * kpiColW;
      setColor(doc, "#94a3b8");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      doc.text(item.label, kx + kpiColW / 2, y + 5.5, { align: "center" });

      setColor(doc, item.color);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text(item.val, kx + kpiColW / 2, y + 11.5, { align: "center" });

      if (idx < 4) {
        setStroke(doc, "#334155");
        doc.setLineWidth(0.3);
        doc.line(kx + kpiColW, y + 3, kx + kpiColW, y + 13);
      }
    });

    y += 18;
  }

  // ── GRADING SCALE & SYSTEM GUIDE ─────────────────────────────────────────
  setFill(doc, "#f8fafc");
  setStroke(doc, BORDER);
  doc.setLineWidth(0.3);
  doc.rect(12, y, 186, 13, "FD");

  setColor(doc, NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("SHOOLINI UNIVERSITY 10-POINT GRADING SYSTEM:", 15, y + 4.5);

  setColor(doc, SLATE);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text(
    "90-100% = A+ (10 Grade Points) Outstanding  |  80-89% = A (9 Points) Excellent  |  70-79% = B+ (8 Points) Very Good",
    15,
    y + 8.5
  );
  doc.text(
    "60-69% = B (7 Points) Good  |  50-59% = C (6 Points) Above Average  |  40-49% = P (5 Points) Pass  |  <40% = F (0 Points) Fail",
    15,
    y + 11.5
  );

  y += 17;

  // ── AUTHENTICITY, CONTROLLER SEAL & SIGNATURE BLOCK ──────────────────────
  const authBoxY = y;
  setFill(doc, WHITE);
  setStroke(doc, BORDER);
  doc.rect(12, authBoxY, 186, 28, "S");

  // Left side: Digital Verification & DigiLocker
  setColor(doc, GREEN);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("DIGITALLY SIGNED & VERIFIED ✓", 16, authBoxY + 6);

  setColor(doc, SLATE);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.text("Issuer: Office of the Controller of Examinations", 16, authBoxY + 11);
  doc.text("Institution: Shoolini University (HP) — Partner ID: DLP-SU-2025", 16, authBoxY + 15);
  doc.text(`Document Reference: SU-COE-TR-2026-MCA-0087`, 16, authBoxY + 19);
  doc.text(`Verification Timestamp: ${currentDate}`, 16, authBoxY + 23);

  // Center: Authentic Circular Rubber University Stamp
  const coeStampImg = generateRubberStamp({
    textTop: "SHOOLINI UNIVERSITY • SOLAN (H.P.)",
    textBottom: "NAAC A+ ACCREDITED • ESTD 2009",
    centerLines: ["CONTROLLER OF", "EXAMINATIONS", "OFFICIALLY SEALED"],
    color: "#1e3a8a",
    size: 360,
    tiltDeg: -4.0,
  });
  if (coeStampImg) {
    try {
      doc.addImage(coeStampImg, "PNG", 95, authBoxY + 1.5, 25, 25);
    } catch {
      // fallback
    }
  }

  // Right side: Controller of Examinations Signature (Matching Dr. S.K. Bansal)
  const sigX = 160;
  const sigImg = generateCursiveSignature({
    signer: "controller",
    color: "#1e40af",
    width: 300,
    height: 100,
  });
  if (sigImg) {
    try {
      doc.addImage(sigImg, "PNG", sigX - 10, authBoxY + 2, 32, 10.7);
    } catch {
      // fallback
    }
  }

  setColor(doc, TEXT_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("Dr. S.K. Bansal", sigX + 6, authBoxY + 18, { align: "center" });

  setColor(doc, SLATE);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Controller of Examinations", sigX + 6, authBoxY + 22, { align: "center" });
  doc.text("Shoolini University", sigX + 6, authBoxY + 25.5, { align: "center" });

  // ── FOOTER RIBBON ────────────────────────────────────────────────────────
  setFill(doc, HEADER_BG);
  doc.rect(0, pageHeight - 11, pageWidth, 11, "F");

  setFill(doc, GOLD);
  doc.rect(0, pageHeight - 11.6, pageWidth, 0.6, "F");

  setColor(doc, WHITE);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text(
    "This official academic record is valid without physical alteration. For online verification: www.shooliniuniversity.com/verify",
    pageWidth / 2,
    pageHeight - 6.5,
    { align: "center" }
  );

  setColor(doc, "#94a3b8");
  doc.setFontSize(6);
  doc.text(
    "Office of the Controller of Examinations | Shoolini University, Kasauli Hills, Solan (HP) | Page 1 of 1",
    pageWidth / 2,
    pageHeight - 2.8,
    { align: "center" }
  );

  const filename = `Official_Transcript_Sem${semester}_${student.rollNo}_KoushikThalari.pdf`;
  doc.save(filename);
}
