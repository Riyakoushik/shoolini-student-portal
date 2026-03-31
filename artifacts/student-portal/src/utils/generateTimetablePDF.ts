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
    const id = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = id.data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] > 10) { d[i] = 255; d[i + 1] = 255; d[i + 2] = 255; }
    }
    ctx.putImageData(id, 0, 0);
    return canvas.toDataURL("image/png");
  } catch { return null; }
}

export async function generateTimetablePDF(rows: DailyClass[], semester: number): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const logo = await getLogoBase64(logoUrl);

  // Header
  doc.setFillColor(NR, NG, NB);
  doc.rect(0, 0, PAGE_W, 46, "F");
  if (logo) { try { doc.addImage(logo, "PNG", L, 6, 30, 16); } catch { /* ok */ } }
  doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(255, 255, 255);
  doc.text("SHOOLINI UNIVERSITY", R, 13, { align: "right" });
  doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(200, 210, 225);
  doc.text("Kasauli Hills, Solan, Himachal Pradesh — 173229", R, 19, { align: "right" });
  doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(GR, GG, GB);
  doc.text("ACADEMIC TIMETABLE", R, 27, { align: "right" });
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(255, 255, 255);
  doc.text(`MCA (AI/ML) — Semester ${semester} — Academic Year 2025–2026`, R, 36, { align: "right" });
  doc.setDrawColor(GR, GG, GB); doc.setLineWidth(1);
  doc.line(0, 46, PAGE_W, 46);

  let y = 52;

  // Student info strip
  doc.setFillColor(245, 248, 252);
  doc.rect(L, y, CW, 14, "F");
  doc.setDrawColor(221, 228, 234); doc.setLineWidth(0.4);
  doc.rect(L, y, CW, 14, "S");
  doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(GRAY_R, GRAY_G, GRAY_B);
  doc.text("STUDENT:", L + 2, y + 5);
  doc.setFont("helvetica", "bold"); doc.setTextColor(26, 42, 58);
  doc.text(`${student.name}  |  Roll: ${student.rollNo}  |  ${student.program}  |  Batch ${student.batch}`, L + 20, y + 5);
  doc.setFont("helvetica", "normal"); doc.setTextColor(GRAY_R, GRAY_G, GRAY_B);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}`, L + 2, y + 11);
  doc.text("School of Computer Science & Engineering", R, y + 11, { align: "right" });
  y += 18;

  // Title
  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(NR, NG, NB);
  doc.text(`WEEKLY CLASS SCHEDULE — SEMESTER ${semester}`, L, y); y += 5;

  // Table header
  const colDay = 28;
  const colSubj = 58;
  const colFac = 42;
  const colTime = 36;
  const colRoom = 22;
  const colDur = 0; // last

  doc.setFillColor(NR, NG, NB); doc.rect(L, y, CW, 8, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(255, 255, 255);
  let cx = L + 2;
  doc.text("DAY", cx, y + 5); cx += colDay;
  doc.text("SUBJECT", cx, y + 5); cx += colSubj;
  doc.text("FACULTY", cx, y + 5); cx += colFac;
  doc.text("TIME", cx, y + 5); cx += colTime;
  doc.text("ROOM", cx, y + 5); cx += colRoom;
  doc.text("DURATION", cx, y + 5);
  y += 8;

  rows.forEach((row, i) => {
    const ROW_H = 11;
    if (i % 2 === 1) { doc.setFillColor(248, 250, 252); doc.rect(L, y, CW, ROW_H, "F"); }

    // Color bar on the left
    doc.setFillColor(
      parseInt(row.color.slice(1, 3), 16),
      parseInt(row.color.slice(3, 5), 16),
      parseInt(row.color.slice(5, 7), 16)
    );
    doc.rect(L, y, 2.5, ROW_H, "F");

    let cx2 = L + 4;
    doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(26, 42, 58);
    doc.text(row.day, cx2, y + 7); cx2 += colDay;
    doc.text(row.subject.length > 22 ? row.subject.substring(0, 22) + "…" : row.subject, cx2, y + 7); cx2 += colSubj;
    doc.setFont("helvetica", "normal"); doc.setTextColor(GRAY_R, GRAY_G, GRAY_B);
    doc.text(row.faculty ?? "—", cx2, y + 7); cx2 += colFac;
    doc.setFont("helvetica", "normal"); doc.setTextColor(26, 42, 58);
    doc.text(row.time, cx2, y + 7); cx2 += colTime;
    doc.text(row.room, cx2, y + 7); cx2 += colRoom;
    doc.setFont("helvetica", "bold");
    doc.text(row.duration, cx2, y + 7);

    doc.setDrawColor(221, 228, 234); doc.setLineWidth(0.25);
    doc.line(L, y + ROW_H, R, y + ROW_H);
    y += ROW_H;
  });

  y += 8;

  // Subject legend
  doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(NR, NG, NB);
  doc.text("SUBJECT LEGEND", L, y); y += 5;

  const seen = new Map<string, string>();
  rows.forEach(r => { if (!seen.has(r.subject)) seen.set(r.subject, r.color); });
  let lx = L; let ly = y;
  seen.forEach((color, subj) => {
    const rgb = [parseInt(color.slice(1, 3), 16), parseInt(color.slice(3, 5), 16), parseInt(color.slice(5, 7), 16)];
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
    doc.rect(lx, ly, 4, 4, "F");
    doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(GRAY_R, GRAY_G, GRAY_B);
    doc.text(subj.length > 28 ? subj.substring(0, 28) + "…" : subj, lx + 6, ly + 3.5);
    ly += 7;
    if (ly > PAGE_H - 40) { ly = y; lx += 95; }
  });

  // Footer
  const fy = PAGE_H - 20;
  doc.setDrawColor(GR, GG, GB); doc.setLineWidth(0.6);
  doc.line(L, fy, R, fy);
  doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(GRAY_R, GRAY_G, GRAY_B);
  doc.text("Academic Section | Shoolini University | academics@shooliniuniversity.com", PAGE_W / 2, fy + 5, { align: "center" });
  doc.text("Note: Timetable subject to change. Check college notice board for updates.", PAGE_W / 2, fy + 10, { align: "center" });
  doc.setFillColor(NR, NG, NB); doc.rect(0, PAGE_H - 8, PAGE_W, 8, "F");
  doc.setFontSize(6.5); doc.setTextColor(200, 210, 225);
  doc.text("Shoolini University of Biotechnology and Management Sciences  |  shooliniuniversity.com", PAGE_W / 2, PAGE_H - 3.5, { align: "center" });

  doc.save(`SU_Timetable_Sem${semester}_${student.rollNo}_KoushikThalari.pdf`);
}
