import { jsPDF } from "jspdf";
import logoUrl from "../assets/shoolini-logo.png";
import { SemesterAttendance, student } from "../data/studentData";

const NR = 26, NG = 58, NB = 92;
const GR = 200, GG = 168, GB = 75;
const GRN_R = 22, GRN_G = 163, GRN_B = 74;
const RED_R = 220, RED_G = 38, RED_B = 38;
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

function pct(p: number, t: number) {
  return t === 0 ? 0 : Math.round((p / t) * 10000) / 100;
}

export async function generateAttendancePDF(data: SemesterAttendance, semester: number): Promise<void> {
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
  doc.text("ATTENDANCE REPORT", R, 27, { align: "right" });
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(255, 255, 255);
  doc.text(`MCA (AI/ML) — Semester ${semester} — Academic Year 2025–2026`, R, 36, { align: "right" });
  doc.setDrawColor(GR, GG, GB); doc.setLineWidth(1);
  doc.line(0, 46, PAGE_W, 46);

  let y = 52;

  // Student info
  doc.setFillColor(245, 248, 252);
  doc.rect(L, y, CW, 14, "F");
  doc.setDrawColor(221, 228, 234); doc.setLineWidth(0.4);
  doc.rect(L, y, CW, 14, "S");
  doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(GRAY_R, GRAY_G, GRAY_B);
  doc.text("STUDENT:", L + 2, y + 5);
  doc.setFont("helvetica", "bold"); doc.setTextColor(26, 42, 58);
  doc.text(`${student.name}  |  Roll: ${student.rollNo}  |  ${student.program}  |  Batch ${student.batch}`, L + 20, y + 5);
  doc.setFont("helvetica", "normal"); doc.setTextColor(GRAY_R, GRAY_G, GRAY_B);
  doc.text(`Report generated: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}`, L + 2, y + 11);
  doc.text("School of Computer Science & Engineering", R, y + 11, { align: "right" });
  y += 18;

  // KPI row
  const overallPct = pct(data.present, data.totalDays);
  const kpis = [
    { label: "Total Classes", value: String(data.totalDays), color: [NR, NG, NB] },
    { label: "Classes Attended", value: String(data.present), color: [GRN_R, GRN_G, GRN_B] },
    { label: "Classes Absent", value: String(data.absent), color: [RED_R, RED_G, RED_B] },
    { label: "Overall %", value: `${overallPct.toFixed(2)}%`, color: overallPct >= 75 ? [GRN_R, GRN_G, GRN_B] : [RED_R, RED_G, RED_B] },
  ];
  const KW = CW / kpis.length;
  kpis.forEach((k, i) => {
    const kx = L + i * KW;
    doc.setFillColor(245, 248, 252); doc.rect(kx, y, KW - 2, 18, "F");
    doc.setDrawColor(k.color[0], k.color[1], k.color[2]); doc.setLineWidth(2);
    doc.line(kx, y, kx, y + 18);
    doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.setTextColor(k.color[0], k.color[1], k.color[2]);
    doc.text(k.value, kx + KW / 2 - 1, y + 11, { align: "center" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(GRAY_R, GRAY_G, GRAY_B);
    doc.text(k.label.toUpperCase(), kx + KW / 2 - 1, y + 16, { align: "center" });
  });
  y += 22;

  // Requirement notice
  if (overallPct < 75) {
    doc.setFillColor(254, 242, 242); doc.rect(L, y, CW, 10, "F");
    doc.setDrawColor(RED_R, RED_G, RED_B); doc.setLineWidth(0.4); doc.rect(L, y, CW, 10, "S");
    doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(RED_R, RED_G, RED_B);
    doc.text("WARNING: Attendance below 75% threshold. Student may be barred from examinations.", L + 3, y + 6.5);
    y += 13;
  } else {
    doc.setFillColor(220, 252, 231); doc.rect(L, y, CW, 10, "F");
    doc.setDrawColor(GRN_R, GRN_G, GRN_B); doc.setLineWidth(0.4); doc.rect(L, y, CW, 10, "S");
    doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(GRN_R, GRN_G, GRN_B);
    doc.text("Attendance meets the minimum 75% requirement. Student is eligible for examinations.", L + 3, y + 6.5);
    y += 13;
  }

  // Per-subject table
  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(NR, NG, NB);
  doc.text("SUBJECT-WISE ATTENDANCE", L, y); y += 4;

  doc.setFillColor(NR, NG, NB); doc.rect(L, y, CW, 8, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(255, 255, 255);
  doc.text("SUBJECT", L + 2, y + 5);
  doc.text("PRESENT", L + 100, y + 5);
  doc.text("ABSENT", L + 122, y + 5);
  doc.text("TOTAL", L + 144, y + 5);
  doc.text("PERCENTAGE", L + 162, y + 5);
  y += 8;

  data.subjects.forEach((s, i) => {
    const p = pct(s.present, s.total);
    const isLow = p < 75;
    if (i % 2 === 1) { doc.setFillColor(248, 250, 252); doc.rect(L, y, CW, 9, "F"); }
    if (isLow) { doc.setFillColor(254, 245, 245); doc.rect(L, y, CW, 9, "F"); }

    doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(26, 42, 58);
    doc.text(s.name.length > 35 ? s.name.substring(0, 35) + "…" : s.name, L + 2, y + 6);
    doc.setFont("helvetica", "normal"); doc.setTextColor(GRN_R, GRN_G, GRN_B);
    doc.text(String(s.present), L + 100, y + 6);
    doc.setTextColor(s.total - s.present > 0 ? RED_R : GRAY_R, s.total - s.present > 0 ? RED_G : GRAY_G, s.total - s.present > 0 ? RED_B : GRAY_B);
    doc.text(String(s.total - s.present), L + 122, y + 6);
    doc.setTextColor(GRAY_R, GRAY_G, GRAY_B);
    doc.text(String(s.total), L + 144, y + 6);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(isLow ? RED_R : GRN_R, isLow ? RED_G : GRN_G, isLow ? RED_B : GRN_B);
    doc.text(`${p.toFixed(2)}%${isLow ? " [LOW]" : ""}`, L + 162, y + 6);

    doc.setDrawColor(221, 228, 234); doc.setLineWidth(0.25);
    doc.line(L, y + 9, R, y + 9);
    y += 9;
  });

  y += 8;
  doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(GRAY_R, GRAY_G, GRAY_B);
  doc.text("* Minimum attendance requirement: 75% per subject. Students with less than 75% may be detained from exams.", L, y);
  doc.text(`* Data recorded up to: March 26, 2026. Semester ${semester} ${semester === 1 ? "completed" : "in progress"}.`, L, y + 5);

  y += 14;
  // Signature block
  doc.setDrawColor(GR, GG, GB); doc.setLineWidth(0.5);
  doc.line(L, y, R, y); y += 6;
  doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(26, 42, 58);
  doc.text("Academic Coordinator", L, y + 4);
  doc.text("Dr. Priya Sharma", R, y + 4, { align: "right" });
  doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(GRAY_R, GRAY_G, GRAY_B);
  doc.text("School of Computer Science & Engineering", L, y + 9);
  doc.text("Academic Advisor", R, y + 9, { align: "right" });

  // Footer
  const fy = PAGE_H - 20;
  doc.setDrawColor(GR, GG, GB); doc.setLineWidth(0.6);
  doc.line(L, fy, R, fy);
  doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(GRAY_R, GRAY_G, GRAY_B);
  doc.text("Academic Section | Shoolini University | academics@shooliniuniversity.com | +91 7018007000", PAGE_W / 2, fy + 5, { align: "center" });
  doc.text("This is a computer-generated report and is valid without signature.", PAGE_W / 2, fy + 10, { align: "center" });
  doc.setFillColor(NR, NG, NB); doc.rect(0, PAGE_H - 8, PAGE_W, 8, "F");
  doc.setFontSize(6.5); doc.setTextColor(200, 210, 225);
  doc.text("Shoolini University of Biotechnology and Management Sciences  |  shooliniuniversity.com", PAGE_W / 2, PAGE_H - 3.5, { align: "center" });

  doc.save(`SU_AttendanceReport_Sem${semester}_${student.rollNo}_KoushikThalari.pdf`);
}
