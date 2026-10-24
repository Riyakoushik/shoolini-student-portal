import { jsPDF } from "jspdf";
import logoUrl from "../assets/shoolini-logo.png";
import { DailyClass, student } from "../data/studentData";

const NR = 26, NG = 58, NB = 92;
const GR = 200, GG = 168, GB = 75;
const GRAY_R = 100, GRAY_G = 116, GRAY_B = 139;
const PAGE_W = 210;
const PAGE_H = 297;
const L = 14;
const R = PAGE_W - 14;
const CW = R - L;

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

export async function generateTimetablePDF(rows: DailyClass[], semester: number): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const logo = await getLogoBase64(logoUrl);

  // ── HEADER BANNER ──────────────────────────────────────────────────────────
  doc.setFillColor(15, 39, 68); // Dark Navy #0f2744
  doc.rect(0, 0, PAGE_W, 46, "F");

  // Branded Logo Card
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(L, 8, 36, 18, 2, 2, "F");
  if (logo) {
    try {
      doc.addImage(logo, "PNG", L + 3, 9.5, 30, 15);
    } catch {
      /* ok */
    }
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("SHOOLINI UNIVERSITY", R, 13, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(200, 210, 225);
  doc.text("Kasauli Hills, Solan, Himachal Pradesh — 173229", R, 19, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(GR, GG, GB);
  doc.text("ACADEMIC TIMETABLE & LAB SCHEDULE", R, 27, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(
    `NAAC A+ Accredited  |  MCA (AI/ML) — Semester ${semester}  |  2025–2027`,
    R,
    35,
    { align: "right" }
  );

  doc.setDrawColor(GR, GG, GB);
  doc.setLineWidth(1);
  doc.line(0, 46, PAGE_W, 46);

  let y = 52;

  // ── STUDENT CREDENTIALS STRIP ──────────────────────────────────────────────
  doc.setFillColor(248, 250, 252);
  doc.rect(L, y, CW, 14, "F");
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.rect(L, y, CW, 14, "S");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(GRAY_R, GRAY_G, GRAY_B);
  doc.text("STUDENT:", L + 4, y + 5);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(26, 42, 58);
  doc.text(
    `${student.name}  |  Roll No: ${student.rollNo}  |  Reg: ${student.registrationNo}  |  ${student.program}`,
    L + 22,
    y + 5
  );

  doc.setFont("helvetica", "normal");
  doc.setTextColor(GRAY_R, GRAY_G, GRAY_B);
  doc.text(
    `Generated: ${new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })}`,
    L + 4,
    y + 11
  );
  doc.text("School of Computer Science & Engineering", R - 4, y + 11, { align: "right" });

  y += 18;

  // Schedule Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(NR, NG, NB);
  doc.text(`WEEKLY CLASS & PRACTICAL SCHEDULE — SEMESTER ${semester}`, L, y);
  y += 5;

  // Table header
  const colDay = 28;
  const colSubj = 58;
  const colFac = 40;
  const colTime = 34;
  const colRoom = 22;

  doc.setFillColor(NR, NG, NB);
  doc.rect(L, y, CW, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);

  let cx = L + 3;
  doc.text("DAY", cx, y + 5.2);
  cx += colDay;
  doc.text("COURSE / SUBJECT", cx, y + 5.2);
  cx += colSubj;
  doc.text("FACULTY INCHARGE", cx, y + 5.2);
  cx += colFac;
  doc.text("TIME SLOT", cx, y + 5.2);
  cx += colTime;
  doc.text("VENUE / LAB", cx, y + 5.2);
  cx += colRoom;
  doc.text("DURATION", cx, y + 5.2);
  y += 8;

  rows.forEach((row, i) => {
    const ROW_H = 10.5;
    if (i % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(L, y, CW, ROW_H, "F");
    }

    // Color accent strip on the left
    const colHex = row.color || "#2563eb";
    doc.setFillColor(
      parseInt(colHex.slice(1, 3), 16),
      parseInt(colHex.slice(3, 5), 16),
      parseInt(colHex.slice(5, 7), 16)
    );
    doc.rect(L, y, 2.5, ROW_H, "F");

    let cx2 = L + 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(26, 42, 58);
    doc.text(row.day, cx2, y + 6.8);
    cx2 += colDay;

    doc.text(
      row.subject.length > 26 ? row.subject.substring(0, 26) + "…" : row.subject,
      cx2,
      y + 6.8
    );
    cx2 += colSubj;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(GRAY_R, GRAY_G, GRAY_B);
    doc.text(row.faculty ?? "—", cx2, y + 6.8);
    cx2 += colFac;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(26, 42, 58);
    doc.text(row.time, cx2, y + 6.8);
    cx2 += colTime;

    doc.text(row.room, cx2, y + 6.8);
    cx2 += colRoom;

    doc.setFont("helvetica", "bold");
    doc.text(row.duration, cx2, y + 6.8);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(L, y + ROW_H, R, y + ROW_H);
    y += ROW_H;
  });

  y += 8;

  // Subject Legend Card
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(NR, NG, NB);
  doc.text("SUBJECT ALLOCATION & COLOR MAPPING", L, y);
  y += 5;

  const seen = new Map<string, string>();
  rows.forEach((r) => {
    if (!seen.has(r.subject)) seen.set(r.subject, r.color);
  });

  let lx = L;
  let ly = y;
  seen.forEach((color, subj) => {
    const colHex = color || "#2563eb";
    const rgb = [
      parseInt(colHex.slice(1, 3), 16),
      parseInt(colHex.slice(3, 5), 16),
      parseInt(colHex.slice(5, 7), 16),
    ];
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
    doc.rect(lx, ly, 4, 4, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(GRAY_R, GRAY_G, GRAY_B);
    doc.text(subj.length > 30 ? subj.substring(0, 30) + "…" : subj, lx + 6, ly + 3.2);

    ly += 6.5;
    if (ly > PAGE_H - 42) {
      ly = y;
      lx += 95;
    }
  });

  // Footer
  const fy = PAGE_H - 18;
  doc.setDrawColor(GR, GG, GB);
  doc.setLineWidth(0.6);
  doc.line(L, fy, R, fy);

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(GRAY_R, GRAY_G, GRAY_B);
  doc.text(
    "Dean of Academics | Shoolini University | academics@shooliniuniversity.com",
    PAGE_W / 2,
    fy + 4.5,
    { align: "center" }
  );

  doc.setFillColor(15, 39, 68);
  doc.rect(0, PAGE_H - 8, PAGE_W, 8, "F");
  doc.setFontSize(6.5);
  doc.setTextColor(200, 210, 225);
  doc.text(
    "Shoolini University of Biotechnology and Management Sciences  |  shooliniuniversity.com",
    PAGE_W / 2,
    PAGE_H - 3.2,
    { align: "center" }
  );

  doc.save(`SU_Official_Timetable_Sem${semester}_${student.rollNo}_KoushikThalari.pdf`);
}
