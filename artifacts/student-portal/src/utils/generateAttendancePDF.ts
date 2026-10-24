import { jsPDF } from "jspdf";
import logoUrl from "../assets/shoolini-logo.png";
import { SemesterAttendance, student } from "../data/studentData";
import { generateRubberStamp, generateCursiveSignature } from "./stampGenerator";

const NAVY = "#1a3a5c";
const GOLD = "#c8a84b";
const GREEN = "#16a34a";
const RED = "#dc2626";
const GRAY = "#64748b";
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
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject();
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

function pct(p: number, t: number) {
  return t === 0 ? 0 : Math.round((p / t) * 10000) / 100;
}

export async function generateAttendancePDF(
  data: SemesterAttendance,
  semester: number
): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const PAGE_W = 210;
  const PAGE_H = 297;
  const L = 14;
  const R = PAGE_W - 14;
  const CW = R - L;

  const logo = await getLogoBase64(logoUrl);

  // ── 1. INSTITUTIONAL HEADER ────────────────────────────────────────────────
  setFill(doc, HEADER_BG);
  doc.rect(0, 0, PAGE_W, 46, "F");

  // Branded Logo Card (keeps genuine university crest colors)
  setFill(doc, "#ffffff");
  doc.roundedRect(L, 8, 36, 18, 2, 2, "F");
  if (logo) {
    try {
      doc.addImage(logo, "PNG", L + 3, 9.5, 30, 15);
    } catch {
      // fallback
    }
  }

  setColor(doc, "#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("SHOOLINI UNIVERSITY", R, 13, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(
    "Kasauli Hills, Solan, Himachal Pradesh — 173229 | www.shooliniuniversity.com",
    R,
    19,
    { align: "right" }
  );

  setColor(doc, GOLD);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("OFFICIAL ATTENDANCE REPORT & AUDIT", R, 27, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(241, 245, 249);
  doc.text(
    `NAAC A+ Accredited  |  Top 100 NIRF  |  UGC Approved  |  Sem ${semester} (2025–2027)`,
    R,
    35,
    { align: "right" }
  );

  // Gold separator ribbon
  setFill(doc, GOLD);
  doc.rect(0, 45, PAGE_W, 1.2, "F");

  let y = 52;

  // ── 2. STUDENT CREDENTIALS CARD ───────────────────────────────────────────
  setFill(doc, "#f8fafc");
  doc.rect(L, y, CW, 20, "F");
  setStroke(doc, "#cbd5e1");
  doc.setLineWidth(0.3);
  doc.rect(L, y, CW, 20, "S");

  // Left column
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  setColor(doc, GRAY);
  doc.text("CANDIDATE NAME:", L + 4, y + 6);
  setColor(doc, NAVY);
  doc.text(student.name.toUpperCase(), L + 34, y + 6);

  setColor(doc, GRAY);
  doc.text("ROLL / REG NO:", L + 4, y + 12);
  setColor(doc, "#1e293b");
  doc.text(`${student.rollNo}  |  ${student.registrationNo}`, L + 34, y + 12);

  setColor(doc, GRAY);
  doc.text("DEGREE PROGRAM:", L + 4, y + 17);
  setColor(doc, "#1e293b");
  doc.text(student.program, L + 34, y + 17);

  // Right column
  const RX = L + 115;
  setColor(doc, GRAY);
  doc.text("CYCLE CUT-OFF:", RX, y + 6);
  setColor(doc, "#1e293b");
  const cycleText =
    semester === 3
      ? "26th of Month (Oct 26, 2026)"
      : semester === 2
      ? "Term End (May 2026)"
      : "Term End (Dec 2025)";
  doc.text(cycleText, RX + 26, y + 6);

  setColor(doc, GRAY);
  doc.text("SESSION STATUS:", RX, y + 12);
  setColor(doc, semester === 3 ? GREEN : NAVY);
  const statusNote =
    semester === 3 ? "Active (Classes till Nov 12, 2026)" : "Semester Concluded";
  doc.text(statusNote, RX + 26, y + 12);

  setColor(doc, GRAY);
  doc.text("REPORT DATE:", RX, y + 17);
  setColor(doc, "#1e293b");
  doc.text(
    new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    RX + 26,
    y + 17
  );

  y += 24;

  // ── 3. KPI METRIC SUMMARY TILES ───────────────────────────────────────────
  const overallPct = pct(data.present, data.totalDays);
  const kpis = [
    { label: "Working Classes", value: String(data.totalDays), color: NAVY },
    { label: "Classes Attended", value: String(data.present), color: GREEN },
    { label: "Classes Absent", value: String(data.absent), color: RED },
    {
      label: "Aggregate Attendance",
      value: `${overallPct.toFixed(2)}%`,
      color: overallPct >= 75 ? GREEN : RED,
    },
  ];

  const KW = CW / kpis.length;
  kpis.forEach((k, i) => {
    const kx = L + i * KW;
    setFill(doc, "#f8fafc");
    doc.rect(kx, y, KW - 2.5, 17, "F");

    setFill(doc, k.color);
    doc.rect(kx, y, 2.5, 17, "F");

    setStroke(doc, "#e2e8f0");
    doc.setLineWidth(0.3);
    doc.rect(kx, y, KW - 2.5, 17, "S");

    setColor(doc, k.color);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(k.value, kx + (KW - 2.5) / 2 + 1, y + 9.5, { align: "center" });

    setColor(doc, GRAY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.text(k.label.toUpperCase(), kx + (KW - 2.5) / 2 + 1, y + 14.5, {
      align: "center",
    });
  });

  y += 22;

  // ── 4. STATUTORY ELIGIBILITY BADGE ─────────────────────────────────────────
  if (overallPct >= 75) {
    setFill(doc, "#f0fdf4");
    doc.rect(L, y, CW, 9, "F");
    setStroke(doc, "#86efac");
    doc.setLineWidth(0.4);
    doc.rect(L, y, CW, 9, "S");

    setColor(doc, GREEN);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(
      "✓ ELIGIBLE FOR SEMESTER EXAMINATIONS — Attendance satisfies mandatory 75% UGC & University Academic Norms.",
      L + 4,
      y + 6
    );
  } else {
    setFill(doc, "#fef2f2");
    doc.rect(L, y, CW, 9, "F");
    setStroke(doc, "#fca5a5");
    doc.setLineWidth(0.4);
    doc.rect(L, y, CW, 9, "S");

    setColor(doc, RED);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(
      "⚠ SHORTFALL WARNING — Overall attendance is below 75%. Remedial makeup classes or medical condonation required.",
      L + 4,
      y + 6
    );
  }

  y += 13;

  // ── 5. SUBJECT-WISE DETAILED AUDIT TABLE ───────────────────────────────────
  setColor(doc, NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("COURSE-WISE ATTENDANCE BREAKDOWN", L, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  setColor(doc, GRAY);
  doc.text(
    `Updated Monthly on 26th  •  Classes ongoing until Nov 12, 2026`,
    R,
    y,
    { align: "right" }
  );

  y += 4;

  // Table Header
  setFill(doc, HEADER_BG);
  doc.rect(L, y, CW, 8, "F");

  setColor(doc, "#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("COURSE / SUBJECT NAME", L + 3, y + 5.5);
  doc.text("PRESENT", L + 104, y + 5.5, { align: "center" });
  doc.text("ABSENT", L + 124, y + 5.5, { align: "center" });
  doc.text("TOTAL", L + 144, y + 5.5, { align: "center" });
  doc.text("PERCENTAGE", L + 164, y + 5.5, { align: "center" });
  doc.text("STATUS", R - 3, y + 5.5, { align: "right" });

  y += 8;

  // Rows
  data.subjects.forEach((s, i) => {
    const p = pct(s.present, s.total);
    const isLow = p < 75;
    const abs = Math.max(0, s.total - s.present);

    if (i % 2 === 1) {
      setFill(doc, "#f8fafc");
      doc.rect(L, y, CW, 8, "F");
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    setColor(doc, "#1e293b");
    doc.text(
      s.name.length > 46 ? s.name.substring(0, 46) + "…" : s.name,
      L + 3,
      y + 5.5
    );

    doc.setFont("helvetica", "normal");
    setColor(doc, GREEN);
    doc.text(String(s.present), L + 104, y + 5.5, { align: "center" });

    setColor(doc, abs > 0 ? RED : GRAY);
    doc.text(String(abs), L + 124, y + 5.5, { align: "center" });

    setColor(doc, GRAY);
    doc.text(String(s.total), L + 144, y + 5.5, { align: "center" });

    setColor(doc, isLow ? RED : GREEN);
    doc.setFont("helvetica", "bold");
    doc.text(`${p.toFixed(1)}%`, L + 164, y + 5.5, { align: "center" });

    // Status pill
    if (isLow) {
      setColor(doc, RED);
      doc.text("CONDONATION", R - 3, y + 5.5, { align: "right" });
    } else {
      setColor(doc, GREEN);
      doc.text("SATISFIED", R - 3, y + 5.5, { align: "right" });
    }

    setStroke(doc, "#e2e8f0");
    doc.setLineWidth(0.2);
    doc.line(L, y + 8, R, y + 8);

    y += 8;
  });

  // Table summary footer row
  setFill(doc, "#f1f5f9");
  doc.rect(L, y, CW, 8, "F");
  setStroke(doc, "#cbd5e1");
  doc.setLineWidth(0.3);
  doc.rect(L, y, CW, 8, "S");

  setColor(doc, NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("AGGREGATE ATTENDANCE (OCTOBER CYCLE)", L + 3, y + 5.5);

  setColor(doc, GREEN);
  doc.text(String(data.present), L + 104, y + 5.5, { align: "center" });
  setColor(doc, RED);
  doc.text(String(data.absent), L + 124, y + 5.5, { align: "center" });
  setColor(doc, NAVY);
  doc.text(String(data.totalDays), L + 144, y + 5.5, { align: "center" });
  setColor(doc, overallPct >= 75 ? GREEN : RED);
  doc.text(`${overallPct.toFixed(2)}%`, L + 164, y + 5.5, { align: "center" });
  doc.text(overallPct >= 75 ? "SATISFACTORY" : "WARNING", R - 3, y + 5.5, {
    align: "right",
  });

  y += 14;

  // ── 6. STATUTORY GUIDELINES & HOLIDAY NOTICE ───────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  setColor(doc, NAVY);
  doc.text("INSTITUTIONAL ATTENDANCE REGULATIONS & CALENDAR NOTES:", L, y);
  y += 4.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  setColor(doc, GRAY);
  doc.text(
    "1. Regular attendance is updated on the 26th of each calendar month as per academic regulations.",
    L,
    y
  );
  y += 4;
  doc.text(
    "2. Minimum attendance requirement for End-Term Examination eligibility is strictly 75.00% in each individual course.",
    L,
    y
  );
  y += 4;
  doc.text(
    "3. Official October 2026 Gazetted Holidays observed: Oct 2 (Gandhi Jayanti), Oct 11, Oct 17-20 (Dussehra), Oct 26, Oct 29 (Diwali).",
    L,
    y
  );
  y += 4;
  doc.text(
    "4. Semester 3 instructional classes will conclude on November 12, 2026, followed immediately by Preparatory Leave and End-Term Exams.",
    L,
    y
  );

  // ── 7. DIGITAL SIGNATURES & OFFICIAL SEAL ─────────────────────────────────
  const signY = PAGE_H - 46;
  setStroke(doc, GOLD);
  doc.setLineWidth(0.5);
  doc.line(L, signY, R, signY);

  // Left - Academic Coordinator (Dr. Priya Sharma signature)
  const coordSig = generateCursiveSignature({
    signer: "coordinator",
    color: "#1e40af",
    width: 280,
    height: 100,
  });
  if (coordSig) {
    try {
      doc.addImage(coordSig, "PNG", L + 2, signY - 12, 30, 10.7);
    } catch {
      // ok
    }
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  setColor(doc, NAVY);
  doc.text("Dr. Priya Sharma", L, signY + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  setColor(doc, GRAY);
  doc.text("Program Coordinator (MCA AI/ML)", L, signY + 9);
  doc.text("School of Computer Science & Engineering", L, signY + 13);

  // Center - Authentic Circular Rubber Stamp
  const acadStamp = generateRubberStamp({
    textTop: "SHOOLINI UNIVERSITY • ACADEMIC CELL",
    textBottom: "NAAC A+ ACCREDITED • ESTD 2009",
    centerLines: ["ACADEMIC CELL", "VERIFIED & AUDITED", "OCTOBER 2026"],
    color: "#1e3a8a",
    size: 360,
    tiltDeg: -3.8,
  });
  if (acadStamp) {
    try {
      doc.addImage(acadStamp, "PNG", PAGE_W / 2 - 12, signY - 12, 24, 24);
    } catch {
      // ok
    }
  }

  // Right - Dean of Academic Affairs (Prof. (Dr.) Sunil Puri signature)
  const deanSig = generateCursiveSignature({
    signer: "dean",
    color: "#0f3ba2",
    width: 280,
    height: 100,
  });
  if (deanSig) {
    try {
      doc.addImage(deanSig, "PNG", R - 34, signY - 12, 30, 10.7);
    } catch {
      // ok
    }
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  setColor(doc, NAVY);
  doc.text("Prof. (Dr.) Sunil Puri", R, signY + 5, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  setColor(doc, GRAY);
  doc.text("Dean (Academic Affairs)", R, signY + 9, { align: "right" });
  doc.text("Shoolini University of Biotechnology", R, signY + 13, {
    align: "right",
  });
  doc.text("Verification Hash: SU-ATT-24MCA-OCT26", R, signY + 14, {
    align: "right",
  });

  // ── 8. FOOTER ─────────────────────────────────────────────────────────────
  const fy = PAGE_H - 18;
  setStroke(doc, "#cbd5e1");
  doc.setLineWidth(0.3);
  doc.line(L, fy, R, fy);

  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  setColor(doc, GRAY);
  doc.text(
    "Academic Section | Shoolini University | academics@shooliniuniversity.com | +91 7018007000",
    PAGE_W / 2,
    fy + 4.5,
    { align: "center" }
  );

  setFill(doc, HEADER_BG);
  doc.rect(0, PAGE_H - 8, PAGE_W, 8, "F");
  doc.setFontSize(6.5);
  doc.setTextColor(203, 213, 225);
  doc.text(
    "Shoolini University of Biotechnology and Management Sciences  |  shooliniuniversity.com",
    PAGE_W / 2,
    PAGE_H - 3.2,
    { align: "center" }
  );

  doc.save(
    `SU_Official_Attendance_Sem${semester}_${student.rollNo}_KoushikThalari.pdf`
  );
}
