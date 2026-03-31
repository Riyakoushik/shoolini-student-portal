import { jsPDF } from "jspdf";
import { student } from "../data/studentData";
import logoUrl from "../assets/shoolini-logo.png";

const NAVY = "#1a3a5c";
const GOLD = "#c8a84b";
const GREEN = "#16a34a";
const RED = "#dc2626";
const PURPLE = "#7c3aed";
const AMBER = "#d97706";
const GRAY = "#f4f6f8";
const BORDER = "#dde1e7";
const SLATE = "#64748b";
const TEXT_DARK = "#1e2a3a";
const WHITE = "#ffffff";

// ── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

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

async function getInvertedLogo(url: string): Promise<string | null> {
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej();
      img.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = 60;
    canvas.height = 60;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, 60, 60);
    const imageData = ctx.getImageData(0, 0, 60, 60);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
      }
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}

function drawPageHeader(doc: jsPDF, logoData: string | null, pageWidth: number): number {
  setFill(doc, NAVY);
  doc.rect(0, 0, pageWidth, 28, "F");

  if (logoData) {
    doc.addImage(logoData, "PNG", 12, 3, 18, 18);
  }

  setColor(doc, WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("SHOOLINI UNIVERSITY", pageWidth / 2, 11, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(200, 210, 220); // 80% white opacity equivalent
  doc.text("Kasauli Hills, Solan, Himachal Pradesh \u2014 173229", pageWidth / 2, 17, { align: "center" });

  setFill(doc, GOLD);
  doc.rect(0, 28, pageWidth, 0.8, "F");

  return 29;
}

function drawSectionHeader(doc: jsPDF, text: string, y: number): number {
  setFill(doc, NAVY);
  doc.rect(14, y, 182, 9, "F");
  setColor(doc, WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(text, 17, y + 6.2);
  return y + 9;
}

interface Column {
  label: string;
  x: number;
  w: number;
  align: "left" | "center" | "right";
}

function drawTableHeader(doc: jsPDF, columns: Column[], y: number): number {
  const { r, g, b } = hexToRgb("#2d4f73");
  doc.setFillColor(r, g, b);
  doc.rect(14, y, 182, 8, "F");

  setColor(doc, WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);

  columns.forEach((col) => {
    const tx = col.align === "right" ? col.x + col.w - 1 : col.align === "center" ? col.x + col.w / 2 : col.x + 1;
    doc.text(col.label, tx, y + 5.5, { align: col.align });
  });

  return y + 8;
}

interface Cell {
  text: string;
  x: number;
  w: number;
  align: "left" | "center" | "right";
  color?: string;
  bold?: boolean;
}

function drawTableRow(doc: jsPDF, cells: Cell[], y: number, isAlt: boolean): number {
  if (isAlt) {
    setFill(doc, "#f8fafc");
  } else {
    setFill(doc, WHITE);
  }
  doc.rect(14, y, 182, 7.5, "F");

  setStroke(doc, BORDER);
  doc.rect(14, y, 182, 7.5, "S");

  cells.forEach((cell) => {
    setColor(doc, cell.color ?? TEXT_DARK);
    doc.setFont("helvetica", cell.bold ? "bold" : "normal");
    doc.setFontSize(7.5);
    const tx = cell.align === "right" ? cell.x + cell.w - 1 : cell.align === "center" ? cell.x + cell.w / 2 : cell.x + 1;
    doc.text(cell.text, tx, y + 5.2, { align: cell.align });
  });

  return y + 7.5;
}

function drawTotalRow(doc: jsPDF, cells: Cell[], y: number): number {
  setFill(doc, NAVY);
  doc.rect(14, y, 182, 9, "F");

  setColor(doc, WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);

  cells.forEach((cell) => {
    const tx = cell.align === "right" ? cell.x + cell.w - 1 : cell.align === "center" ? cell.x + cell.w / 2 : cell.x + 1;
    doc.text(cell.text, tx, y + 6, { align: cell.align });
  });

  return y + 9;
}

function checkPageBreak(doc: jsPDF, y: number, logoData: string | null, needed = 20): number {
  if (y + needed > 272) {
    doc.addPage();
    drawPageHeader(doc, logoData, 210);
    return 32;
  }
  return y;
}

function drawPageFooter(doc: jsPDF, pageNumber: number, totalPages: number, pageWidth: number, pageHeight: number) {
  setFill(doc, NAVY);
  doc.rect(0, 282, pageWidth, 15, "F");

  setColor(doc, WHITE);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text("registrar@shooliniuniversity.com  |  +91 7018007000", pageWidth / 2, 287, { align: "center" });

  doc.setFontSize(6);
  doc.text("NAAC B+  |  UGC Certified  |  Established 2009  |  shooliniuniversity.com", pageWidth / 2, 291, { align: "center" });

  doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - 8, 287, { align: "right" });
}

// ── KPI BOX HELPER ───────────────────────────────────────────────────────────

function drawKPIBox(doc: jsPDF, x: number, y: number, w: number, title: string, value: string, subValue: string, titleColor: string, valueColor: string, subValueColor: string, bgColor: string, borderColor: string) {
  setFill(doc, bgColor);
  setStroke(doc, borderColor);
  doc.rect(x, y, w, 22, "FD");

  setColor(doc, titleColor);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text(title, x + w / 2, y + 5, { align: "center" });

  setColor(doc, valueColor);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(title === "HIGHEST SCORE" || title === "LOWEST SCORE" ? 10 : 13);
  doc.text(value, x + w / 2, y + 13, { align: "center" });

  setColor(doc, subValueColor);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(subValue, x + w / 2, y + 19, { align: "center" });
}

// ── MAIN EXPORT ──────────────────────────────────────────────────────────────

export async function generateMarksheet(semester: number) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageWidth = 210;
  const pageHeight = 297;
  const logoData = await getInvertedLogo(logoUrl);
  const currentDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  let y = drawPageHeader(doc, logoData, pageWidth);

  // ── SUBHEADER BLOCK ────────────────────────────────────────────────────────
  setColor(doc, GOLD);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("OFFICE OF EXAMINATIONS", 105, 35, { align: "center" });

  setColor(doc, NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("ACADEMIC PERFORMANCE REPORT", 105, 42, { align: "center" });

  setFill(doc, GOLD);
  doc.rect(14, 45, 182, 0.6, "F");

  // ── EXAM PERIOD + VERIFIED STRIP ───────────────────────────────────────────
  setStroke(doc, BORDER);
  setFill(doc, "#fafbfc");
  doc.rect(14, 47, 182, 10, "FD");

  setColor(doc, SLATE);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const examPeriod = semester === 2 ? "Jan 2026 \u2013 June 2026" : "Aug 2025 \u2013 Jan 2026";
  doc.text(`Examination Period: ${examPeriod}`, 17, 54);

  // Verified Badge
  setStroke(doc, GREEN);
  setFill(doc, "#f0fdf4");
  doc.roundedRect(163, 49, 30, 6, 1, 1, "FD");
  setColor(doc, GREEN);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("\u2713  VERIFIED", 178, 53.5, { align: "center" });

  // ── STUDENT INFO BOX ───────────────────────────────────────────────────────
  y = 59;
  setFill(doc, "#f4f6f8");
  setStroke(doc, BORDER);
  doc.rect(14, y, 182, 30, "FD");

  setFill(doc, NAVY);
  doc.rect(14, y, 2, 30, "F");

  // Left Column
  setColor(doc, SLATE);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.text("STUDENT NAME", 20, y + 4);
  setColor(doc, TEXT_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(student.name, 20, y + 8);

  setColor(doc, SLATE);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.text("ROLL NUMBER", 20, y + 13);
  doc.text("ENROLLMENT NO", 52, y + 13);
  doc.text("REGISTRATION NO", 84, y + 13);

  setColor(doc, TEXT_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(student.rollNo, 20, y + 17);
  doc.text(student.enrollmentNo, 52, y + 17);
  doc.text(student.registrationNo, 84, y + 17);

  setColor(doc, SLATE);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.text("PROGRAM", 20, y + 22);
  setColor(doc, TEXT_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(student.program, 20, y + 26);

  // Right Column
  setStroke(doc, BORDER);
  doc.line(105, y + 2, 105, y + 28);

  setColor(doc, SLATE);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.text("DEPARTMENT", 107, y + 4);
  setColor(doc, TEXT_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(student.department, 107, y + 8);

  setColor(doc, SLATE);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.text("SEMESTER", 107, y + 13);
  setColor(doc, TEXT_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(`Semester ${semester} | Academic Year: 2025\u20132026`, 107, y + 17);

  setColor(doc, SLATE);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.text("GENERATED ON", 107, y + 22);
  setColor(doc, TEXT_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(currentDate, 107, y + 26);

  y = 91;

  if (semester === 2) {
    // ── SEMESTER 2 SECTIONS ──────────────────────────────────────────────────
    
    // SECTION 1: MID-TERM RESULTS
    y = checkPageBreak(doc, y, logoData, 80);
    y = drawSectionHeader(doc, "MID-TERM EXAMINATION RESULTS \u2014 MARCH 2026", y);
    
    setColor(doc, SLATE);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text("Examination Period: March 17\u201325, 2026  |  Maximum Marks: 100 per subject", 17, y + 6);
    y += 9;

    const cols2MT: Column[] = [
      { label: "SUBJECT",   x: 14,  w: 58, align: "left" },
      { label: "FACULTY",   x: 72,  w: 45, align: "left" },
      { label: "EXAM DATE", x: 117, w: 28, align: "left" },
      { label: "SCORE",     x: 145, w: 18, align: "center" },
      { label: "MAX",       x: 163, w: 15, align: "center" },
      { label: "GRADE",     x: 178, w: 18, align: "center" },
    ];
    y = drawTableHeader(doc, cols2MT, y);

    const rows2MT = [
      { subj: "Advanced Machine Learning", fac: "Dr. Priya Sharma",  date: "Mar 17, 2026", score: "85", max: "100", grade: "A+" },
      { subj: "Deep Learning",             fac: "Dr. Rajesh Kumar",  date: "Mar 18, 2026", score: "88", max: "100", grade: "A+" },
      { subj: "Natural Language Process.", fac: "Dr. Anita Desai",   date: "Mar 19, 2026", score: "82", max: "100", grade: "A+" },
      { subj: "Computer Vision",           fac: "Prof. Vikram Mehta", date: "Mar 20, 2026", score: "86", max: "100", grade: "A+" },
      { subj: "Data Analytics",            fac: "Dr. Suresh Patel",  date: "Mar 23, 2026", score: "84", max: "100", grade: "A+" },
      { subj: "Cloud Computing",           fac: "Prof. Meera Iyer",  date: "Mar 24, 2026", score: "83", max: "100", grade: "A+" },
      { subj: "Advanced Algorithms",       fac: "Dr. Arjun Reddy",   date: "Mar 25, 2026", score: "87", max: "100", grade: "A+" },
    ];

    rows2MT.forEach((row, i) => {
      y = drawTableRow(doc, [
        { text: row.subj,  x: 14,  w: 58, align: "left",   bold: true,  color: TEXT_DARK },
        { text: row.fac,   x: 72,  w: 45, align: "left",   bold: false, color: SLATE },
        { text: row.date,  x: 117, w: 28, align: "left",   bold: false, color: SLATE },
        { text: row.score, x: 145, w: 18, align: "center", bold: true,  color: NAVY },
        { text: row.max,   x: 163, w: 15, align: "center", bold: false, color: SLATE },
        { text: row.grade, x: 178, w: 18, align: "center", bold: true,  color: GREEN },
      ], y, i % 2 !== 0);
    });

    y = drawTotalRow(doc, [
      { text: "TOTAL", x: 14, w: 131, align: "left", bold: true },
      { text: "595",   x: 145, w: 18, align: "center", bold: true },
      { text: "700",   x: 163, w: 15, align: "center", bold: true },
      { text: "85.0%", x: 178, w: 18, align: "center", bold: true },
    ], y);
    y += 3;

    setColor(doc, SLATE);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.text("Grade Scale:  80\u2013100 = A+  |  70\u201379 = A  |  60\u201369 = B+  |  50\u201359 = B  |  <50 = F", 105, y + 5, { align: "center" });
    y += 10;

    // SECTION 2: PERFORMANCE ANALYSIS
    y = checkPageBreak(doc, y, logoData, 55);
    y = drawSectionHeader(doc, "PERFORMANCE ANALYSIS", y);
    y += 3;

    drawKPIBox(doc, 14, y, 58, "AVERAGE SCORE", "85.0 / 100", "85.0%", SLATE, NAVY, GREEN, "#eff6ff", "#bfdbfe");
    drawKPIBox(doc, 76, y, 58, "HIGHEST SCORE", "88 \u2014 Deep Learning", "A+ Grade", SLATE, NAVY, GREEN, "#f0fdf4", "#bbf7d0");
    drawKPIBox(doc, 138, y, 58, "LOWEST SCORE", "82 \u2014 NLP", "A+ Grade", SLATE, NAVY, AMBER, "#fffbeb", "#fde68a");
    y += 26;

    const colsRanking: Column[] = [
      { label: "RANK",    x: 14,  w: 14, align: "center" },
      { label: "SUBJECT", x: 28,  w: 58, align: "left" },
      { label: "SCORE",   x: 86,  w: 20, align: "center" },
      { label: "GRADE",   x: 106, w: 18, align: "center" },
      { label: "STATUS",  x: 124, w: 72, align: "center" },
    ];
    y = drawTableHeader(doc, colsRanking, y);
    const rankings = [
      { rank: "1", subj: "Deep Learning",             score: "88", grade: "A+", status: "Above Average", color: GREEN },
      { rank: "2", subj: "Advanced Algorithms",       score: "87", grade: "A+", status: "Above Average", color: GREEN },
      { rank: "3", subj: "Computer Vision",           score: "86", grade: "A+", status: "Above Average", color: GREEN },
      { rank: "4", subj: "Advanced Machine Learning", score: "85", grade: "A+", status: "Above Average", color: GREEN },
      { rank: "5", subj: "Data Analytics",            score: "84", grade: "A+", status: "At Average",    color: AMBER },
      { rank: "6", subj: "Cloud Computing",           score: "83", grade: "A+", status: "At Average",    color: AMBER },
      { rank: "7", subj: "Natural Language Process.", score: "82", grade: "A+", status: "Below Average", color: RED },
    ];
    rankings.forEach((r, i) => {
      y = drawTableRow(doc, [
        { text: r.rank,   x: 14,  w: 14, align: "center" },
        { text: r.subj,   x: 28,  w: 58, align: "left", bold: true },
        { text: r.score,  x: 86,  w: 20, align: "center", bold: true, color: NAVY },
        { text: r.grade,  x: 106, w: 18, align: "center", bold: true, color: r.color },
        { text: r.status, x: 124, w: 72, align: "center", bold: true, color: r.color },
      ], y, i % 2 !== 0);
    });
    y += 5;

    // SECTION 3: UPCOMING EXAMINATION SCHEDULE
    y = checkPageBreak(doc, y, logoData, 15);
    y = drawSectionHeader(doc, "UPCOMING EXAMINATION SCHEDULE \u2014 SEMESTER 2", y);
    y += 3;
    const colsSchedule: Column[] = [
      { label: "EXAM TYPE", x: 14,  w: 28, align: "left" },
      { label: "SUBJECT",   x: 42,  w: 58, align: "left" },
      { label: "DATE",      x: 100, w: 28, align: "left" },
      { label: "TIME",      x: 128, w: 30, align: "left" },
      { label: "ROOM",      x: 158, w: 20, align: "center" },
      { label: "STATUS",    x: 178, w: 18, align: "center" },
    ];
    y = drawTableHeader(doc, colsSchedule, y);
    const schedule = [
      { type: "Pre-Final", subj: "Advanced Machine Learning", date: "Apr 14, 2026", time: "10:00\u20131:00 PM", room: "Hall A" },
      { type: "Pre-Final", subj: "Deep Learning",             date: "Apr 15, 2026", time: "10:00\u20131:00 PM", room: "Hall A" },
      { type: "Final Exam", subj: "Advanced Machine Learning", date: "May 12, 2026", time: "10:00\u20131:00 PM", room: "Hall A" },
      { type: "Practical",  subj: "Lab Examinations (All)",    date: "Jun 2\u20133, 2026", time: "9:00 AM\u201312 PM", room: "Lab 1-3" },
    ];
    schedule.forEach((s, i) => {
      y = drawTableRow(doc, [
        { text: s.type, x: 14,  w: 28, align: "left" },
        { text: s.subj, x: 42,  w: 58, align: "left", bold: true },
        { text: s.date, x: 100, w: 28, align: "left" },
        { text: s.time, x: 128, w: 30, align: "left" },
        { text: s.room, x: 158, w: 20, align: "center" },
        { text: "Upcoming", x: 178, w: 18, align: "center", color: AMBER, bold: true },
      ], y, i % 2 !== 0);
    });
    y += 4;

    // SECTION 4: CURRENT SEMESTER STATUS
    y = checkPageBreak(doc, y, logoData, 40);
    y = drawSectionHeader(doc, "CURRENT SEMESTER STATUS", y);
    y += 4;
    drawKPIBox(doc, 14, y, 58, "ASSIGNMENTS", "13 / 18 Submitted", "5 Pending", SLATE, NAVY, AMBER, "#fffbeb", "#fde68a");
    drawKPIBox(doc, 76, y, 58, "ATTENDANCE", "97.87%", "46/47 Classes \u2713", SLATE, GREEN, GREEN, "#f0fdf4", "#bbf7d0");
    drawKPIBox(doc, 138, y, 58, "STANDING", "A+ Grade", "Excellent", SLATE, NAVY, GREEN, "#f0fdf4", "#bbf7d0");
    y += 28;

    setFill(doc, "#fffbeb");
    setStroke(doc, AMBER);
    doc.rect(14, y, 182, 16, "FD");
    setFill(doc, AMBER);
    doc.rect(14, y, 2, 16, "F");
    setColor(doc, AMBER);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("\u26A0  NOTE:", 19, y + 5);
    setColor(doc, TEXT_DARK);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text("Semester 2 is currently in progress. Final results will be declared after", 19, y + 10);
    doc.text("June 2026 upon completion of all examinations.", 19, y + 14);
    y += 20;

  } else {
    // ── SEMESTER 1 SECTIONS ──────────────────────────────────────────────────
    
    // SECTION 1: IA1 RESULTS
    y = checkPageBreak(doc, y, logoData, 50);
    y = drawSectionHeader(doc, "INTERNAL ASSESSMENT 1 \u2014 SEPTEMBER/OCTOBER 2025", y);
    setColor(doc, SLATE);
    doc.setFontSize(7.5);
    doc.text("Period: September 1 \u2013 October 1, 2025  |  Maximum Marks: 30 per subject", 17, y + 6);
    y += 9;
    const colsIA: Column[] = [
      { label: "SUBJECT",    x: 14,  w: 80, align: "left" },
      { label: "SCORE",      x: 94,  w: 20, align: "center" },
      { label: "MAX",        x: 114, w: 15, align: "center" },
      { label: "PERCENTAGE", x: 129, w: 32, align: "center" },
      { label: "GRADE",      x: 161, w: 35, align: "center" },
    ];
    y = drawTableHeader(doc, colsIA, y);
    const ia1Rows = [
      { subj: "Data Structures", score: 26 }, { subj: "Computer Networks", score: 25 },
      { subj: "Operating Systems", score: 26 }, { subj: "Software Engineering", score: 25 },
      { subj: "Web Technologies", score: 26 }, { subj: "Python Programming", score: 25 },
      { subj: "Mathematics for Computing", score: 26 }, { subj: "Database Management Systems", score: 25 }
    ];
    ia1Rows.forEach((r, i) => {
      const pct = ((r.score / 30) * 100).toFixed(1) + "%";
      y = drawTableRow(doc, [
        { text: r.subj, x: 14, w: 80, align: "left", bold: true },
        { text: String(r.score), x: 94, w: 20, align: "center", bold: true, color: NAVY },
        { text: "30", x: 114, w: 15, align: "center" },
        { text: pct, x: 129, w: 32, align: "center" },
        { text: "A+", x: 161, w: 35, align: "center", bold: true, color: GREEN }
      ], y, i % 2 !== 0);
    });
    y = drawTotalRow(doc, [
      { text: "TOTAL", x: 14, w: 80, align: "left", bold: true },
      { text: "204", x: 94, w: 20, align: "center" },
      { text: "240", x: 114, w: 15, align: "center" },
      { text: "85.0%", x: 129, w: 32, align: "center" },
      { text: "A+", x: 161, w: 35, align: "center" }
    ], y);
    y += 10;

    // SECTION 2: IA2 RESULTS
    y = checkPageBreak(doc, y, logoData, 50);
    y = drawSectionHeader(doc, "INTERNAL ASSESSMENT 2 \u2014 NOVEMBER 2025", y);
    y += 9;
    y = drawTableHeader(doc, colsIA, y);
    const ia2Rows = [
      { subj: "Data Structures", score: 27 }, { subj: "Computer Networks", score: 26 },
      { subj: "Operating Systems", score: 27 }, { subj: "Software Engineering", score: 26 },
      { subj: "Web Technologies", score: 27 }, { subj: "Python Programming", score: 26 },
      { subj: "Mathematics for Computing", score: 27 }, { subj: "Database Management Systems", score: 26 }
    ];
    ia2Rows.forEach((r, i) => {
      const pct = ((r.score / 30) * 100).toFixed(1) + "%";
      y = drawTableRow(doc, [
        { text: r.subj, x: 14, w: 80, align: "left", bold: true },
        { text: String(r.score), x: 94, w: 20, align: "center", bold: true, color: NAVY },
        { text: "30", x: 114, w: 15, align: "center" },
        { text: pct, x: 129, w: 32, align: "center" },
        { text: "A+", x: 161, w: 35, align: "center", bold: true, color: GREEN }
      ], y, i % 2 !== 0);
    });
    y = drawTotalRow(doc, [
      { text: "TOTAL", x: 14, w: 80, align: "left", bold: true },
      { text: "212", x: 94, w: 20, align: "center" },
      { text: "240", x: 114, w: 15, align: "center" },
      { text: "88.3%", x: 129, w: 32, align: "center" },
      { text: "A+", x: 161, w: 35, align: "center" }
    ], y);
    y += 5;

    // SECTION 3: IA COMBINED SUMMARY
    y = checkPageBreak(doc, y, logoData, 50);
    y = drawSectionHeader(doc, "COMBINED IA PERFORMANCE SUMMARY", y);
    y += 4;
    drawKPIBox(doc, 14, y, 58, "IA1 AVERAGE", "25.5 / 30", "85.0%", SLATE, NAVY, GREEN, WHITE, BORDER);
    drawKPIBox(doc, 76, y, 58, "IA2 AVERAGE", "26.5 / 30", "88.3%", SLATE, NAVY, GREEN, WHITE, BORDER);
    drawKPIBox(doc, 138, y, 58, "OVERALL AVG", "26.0 / 30", "86.7%", SLATE, NAVY, GREEN, WHITE, BORDER);
    y += 28;

    const colsImp: Column[] = [
      { label: "SUBJECT",     x: 14,  w: 75, align: "left" },
      { label: "IA1 SCORE",   x: 89,  w: 27, align: "center" },
      { label: "IA2 SCORE",   x: 116, w: 27, align: "center" },
      { label: "COMBINED",    x: 143, w: 27, align: "center" },
      { label: "IMPROVEMENT", x: 170, w: 26, align: "center" }
    ];
    y = drawTableHeader(doc, colsImp, y);
    ia1Rows.forEach((r, i) => {
      y = drawTableRow(doc, [
        { text: r.subj, x: 14, w: 75, align: "left", bold: true },
        { text: String(r.score), x: 89, w: 27, align: "center" },
        { text: String(ia2Rows[i].score), x: 116, w: 27, align: "center" },
        { text: ((r.score + ia2Rows[i].score) / 2).toFixed(1), x: 143, w: 27, align: "center", bold: true, color: NAVY },
        { text: "+1", x: 170, w: 26, align: "center", bold: true, color: GREEN }
      ], y, i % 2 !== 0);
    });
    y += 5;

    // SECTION 4: THEORY EXAM SCHEDULE
    y = checkPageBreak(doc, y, logoData, 15);
    y = drawSectionHeader(doc, "THEORY EXAMINATION SCHEDULE \u2014 DECEMBER 2025", y);
    const colsTheory: Column[] = [
      { label: "SUBJECT",   x: 14,  w: 65, align: "left" },
      { label: "EXAM DATE", x: 79,  w: 30, align: "left" },
      { label: "TIME",      x: 109, w: 35, align: "left" },
      { label: "ROOM",      x: 144, w: 22, align: "center" },
      { label: "STATUS",    x: 166, w: 30, align: "center" }
    ];
    y = drawTableHeader(doc, colsTheory, y);
    const theoryRows = [
      { subj: "Data Structures", date: "Dec 9, 2025", time: "10:00 AM\u20131:00 PM" },
      { subj: "Computer Networks", date: "Dec 11, 2025", time: "10:00 AM\u20131:00 PM" }
    ];
    theoryRows.forEach((r, i) => {
      y = drawTableRow(doc, [
        { text: r.subj, x: 14, w: 65, align: "left", bold: true },
        { text: r.date, x: 79, w: 30, align: "left" },
        { text: r.time, x: 109, w: 35, align: "left" },
        { text: "Hall A", x: 144, w: 22, align: "center" },
        { text: "Appeared", x: 166, w: 30, align: "center", color: GREEN, bold: true }
      ], y, i % 2 !== 0);
    });
    y += 5;

    // SECTION 6: RESULT STATUS
    y = checkPageBreak(doc, y, logoData, 40);
    y = drawSectionHeader(doc, "SEMESTER 1 \u2014 FINAL RESULT STATUS", y);
    y += 5;
    setFill(doc, "#ede9fe");
    setStroke(doc, PURPLE);
    doc.rect(14, y, 182, 30, "FD");
    setFill(doc, PURPLE);
    doc.rect(14, y, 2.5, 30, "F");
    setColor(doc, PURPLE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("RESULT AWAITED", 105, y + 10, { align: "center" });
    setColor(doc, TEXT_DARK);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Semester 1 final examination results are currently being processed", 105, y + 17, { align: "center" });
    doc.text("by the Office of Examinations. Expected declaration: April 2026", 105, y + 22, { align: "center" });
    setColor(doc, SLATE);
    doc.setFontSize(7.5);
    doc.text("Queries: examinations@shooliniuniversity.com", 105, y + 27, { align: "center" });
    y += 35;

    setFill(doc, "#f0fdf4");
    setStroke(doc, GREEN);
    doc.rect(14, y, 182, 12, "FD");
    setFill(doc, GREEN);
    doc.rect(14, y, 2.5, 12, "F");
    setColor(doc, GREEN);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("\u2713  Attendance: 107 / 108 classes attended = 99.07% \u2014 Eligible for Examination", 20, y + 8);
    y += 16;
  }

  // ── LAST PAGE ── SIGNATURE & DECLARATION ────────────────────────────────────
  y = checkPageBreak(doc, y, logoData, 55);
  setFill(doc, GOLD);
  doc.rect(14, y + 6, 182, 0.5, "F");
  y += 10;

  setFill(doc, "#f8fafc");
  setStroke(doc, BORDER);
  doc.rect(14, y, 182, 20, "FD");
  setColor(doc, SLATE);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("This is a computer-generated academic performance report issued by the Office of", 105, y + 7, { align: "center" });
  doc.text("Examinations, Shoolini University. Digitally verified and issued under the authority", 105, y + 12, { align: "center" });
  doc.text("of the University Registrar. For verification: registrar@shooliniuniversity.com", 105, y + 17, { align: "center" });
  y += 24;

  const signY = y;
  setColor(doc, GREEN);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("DigiLocker Verified \u2713", 14, signY);
  setColor(doc, SLATE);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Consent ID: DGL2025KT00487", 14, signY + 5);
  doc.text("DBA Ref: DBA/SU/2025/MCA/09871", 14, signY + 10);
  doc.text(`Roll No: ${student.rollNo}`, 14, signY + 15);

  setStroke(doc, "#94a3b8");
  doc.line(148, signY + 3, 196, signY + 3);
  setColor(doc, TEXT_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Dr. S.K. Bansal", 196, signY + 8, { align: "right" });
  setColor(doc, SLATE);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("University Registrar", 196, signY + 13, { align: "right" });
  doc.text("Shoolini University", 196, signY + 17, { align: "right" });
  doc.setFontSize(7);
  doc.text(`Date: ${currentDate}`, 196, signY + 22, { align: "right" });

  // ── FOOTERS ─────────────────────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawPageFooter(doc, i, totalPages, pageWidth, pageHeight);
  }

  const filename = `AcademicReport_Sem${semester}_${student.rollNo}_KoushikThalari.pdf`;
  doc.save(filename);
}
