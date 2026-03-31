import { jsPDF } from "jspdf";
import { student } from "../data/studentData";
import type { AssignmentDetail } from "../data/assignmentDetails";
import shooliniLogoSrc from "../assets/shoolini-logo.png";

const NAVY_R = 26, NAVY_G = 58, NAVY_B = 92;
const GOLD_R = 200, GOLD_G = 168, GOLD_B = 75;

async function loadWhiteLogo(src: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(null); return; }
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;
      for (let i = 0; i < d.length; i += 4) {
        const a = d[i + 3];
        if (a > 10) { d[i] = 255; d[i + 1] = 255; d[i + 2] = 255; }
      }
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function downloadAssignmentPDF(
  detail: AssignmentDetail,
  assignmentTitle: string,
  subject: string,
  dueDate: string,
  status: string
): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const LEFT = 14;
  const RIGHT = W - 14;
  const CONTENT_W = RIGHT - LEFT;

  const logoData = await loadWhiteLogo(shooliniLogoSrc);

  function header(pageNum: number) {
    doc.setFillColor(NAVY_R, NAVY_G, NAVY_B);
    doc.rect(0, 0, W, 32, "F");
    if (logoData) {
      doc.addImage(logoData, "PNG", LEFT, 4, 40, 12);
    }
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(GOLD_R, GOLD_G, GOLD_B);
    doc.text("SHOOLINI UNIVERSITY", W / 2, 10, { align: "center" });
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 220, 255);
    doc.text("Kasauli Hills, Solan, Himachal Pradesh 173229 | shooliniuniversity.com", W / 2, 15, { align: "center" });
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("ASSIGNMENT DETAIL", W / 2, 24, { align: "center" });
    doc.setDrawColor(GOLD_R, GOLD_G, GOLD_B);
    doc.setLineWidth(0.6);
    doc.line(LEFT, 32, RIGHT, 32);

    doc.setFillColor(NAVY_R, NAVY_G, NAVY_B);
    doc.rect(0, 287, W, 10, "F");
    doc.setFontSize(7);
    doc.setTextColor(180, 200, 230);
    doc.setFont("helvetica", "normal");
    doc.text(`Shoolini University Student Portal | Generated: ${new Date().toLocaleDateString("en-IN")} | Page ${pageNum}`, W / 2, 293, { align: "center" });
  }

  let y = 36;
  let page = 1;
  header(page);

  function checkNewPage(needed = 12) {
    if (y + needed > 280) {
      doc.addPage();
      page++;
      header(page);
      y = 36;
    }
  }

  function sectionTitle(text: string) {
    checkNewPage(14);
    doc.setFillColor(26, 58, 92);
    doc.rect(LEFT, y, CONTENT_W, 7, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(text, LEFT + 3, y + 4.8);
    y += 9;
  }

  function infoRow(label: string, value: string) {
    checkNewPage(7);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(label, LEFT, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 42, 58);
    const lines = doc.splitTextToSize(value, CONTENT_W - 50);
    doc.text(lines, LEFT + 48, y);
    y += Math.max(6, lines.length * 5);
  }

  sectionTitle("ASSIGNMENT INFORMATION");
  y += 2;
  infoRow("Student Name:", student.name);
  infoRow("Roll Number:", student.rollNo);
  infoRow("Enrollment No:", student.enrollmentNo);
  infoRow("Program:", "MCA — Artificial Intelligence & Machine Learning");
  infoRow("Subject:", subject);
  infoRow("Assignment Title:", assignmentTitle);
  infoRow("Due Date:", dueDate);
  infoRow("Status:", status);
  infoRow("Assignment No:", `#${detail.no}`);
  infoRow("Type:", detail.labObjective ? "Lab Assignment" : "Theory Assignment");
  y += 4;

  if (detail.labObjective) {
    sectionTitle("LAB OBJECTIVE");
    y += 2;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 42, 58);
    const lines = doc.splitTextToSize(detail.labObjective, CONTENT_W);
    lines.forEach((line: string) => {
      checkNewPage(6);
      doc.text(line, LEFT, y);
      y += 5.5;
    });
    y += 3;

    if (detail.labRequirements?.length) {
      sectionTitle("REQUIREMENTS & TOOLS");
      y += 2;
      detail.labRequirements.forEach((req) => {
        checkNewPage(6);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(30, 42, 58);
        doc.text(`  •  ${req}`, LEFT, y);
        y += 5.5;
      });
      y += 3;
    }

    if (detail.labSteps?.length) {
      sectionTitle("STEP-BY-STEP PROCEDURE");
      y += 2;
      detail.labSteps.forEach((step, i) => {
        checkNewPage(8);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(26, 58, 92);
        doc.text(`Step ${i + 1}:`, LEFT, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 42, 58);
        const stepLines = doc.splitTextToSize(step, CONTENT_W - 16);
        doc.text(stepLines, LEFT + 16, y);
        y += Math.max(6, stepLines.length * 5.5) + 1;
      });
      y += 2;
    }

    if (detail.labExpectedOutput) {
      sectionTitle("EXPECTED OUTPUT");
      y += 2;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(30, 42, 58);
      const lines2 = doc.splitTextToSize(detail.labExpectedOutput, CONTENT_W);
      lines2.forEach((line: string) => {
        checkNewPage(6);
        doc.text(line, LEFT, y);
        y += 5.5;
      });
      y += 3;
    }

    if (detail.viva?.length) {
      sectionTitle("VIVA QUESTIONS");
      y += 2;
      detail.viva.forEach((q, i) => {
        checkNewPage(8);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(26, 58, 92);
        doc.text(`Q${i + 1}.`, LEFT, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 42, 58);
        const qLines = doc.splitTextToSize(q, CONTENT_W - 10);
        doc.text(qLines, LEFT + 10, y);
        y += Math.max(6, qLines.length * 5.5) + 1;
      });
      y += 2;
    }
  } else if (detail.questions?.length) {
    sectionTitle("QUESTIONS");
    y += 2;
    detail.questions.forEach((q, i) => {
      checkNewPage(10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(26, 58, 92);
      doc.text(`Q${i + 1}. [${q.marks} mark${q.marks !== 1 ? "s" : ""}]`, LEFT, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 42, 58);
      const qLines = doc.splitTextToSize(q.q, CONTENT_W);
      y += 5.5;
      qLines.forEach((line: string) => {
        checkNewPage(6);
        doc.text(`   ${line}`, LEFT, y);
        y += 5.5;
      });
      y += 2;
    });
    y += 2;
  }

  sectionTitle("MARKS RUBRIC");
  y += 2;
  const rubricCols = [LEFT, LEFT + 42, LEFT + 62, LEFT + CONTENT_W - 0];
  const rubricHeaders = ["Criteria", "Max Marks", "Description"];
  doc.setFillColor(241, 245, 249);
  doc.rect(LEFT, y, CONTENT_W, 6.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  rubricHeaders.forEach((h, i) => {
    doc.text(h, rubricCols[i] + 2, y + 4.5);
  });
  doc.setDrawColor(221, 225, 231);
  doc.setLineWidth(0.3);
  doc.rect(LEFT, y, CONTENT_W, 6.5);
  y += 6.5;

  detail.rubric.forEach((row, i) => {
    checkNewPage(10);
    const rowH = 7;
    if (i % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(LEFT, y, CONTENT_W, rowH, "F");
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(30, 42, 58);
    doc.text(row.criteria, rubricCols[0] + 2, y + 4.5);
    doc.setFont("helvetica", "normal");
    doc.text(String(row.maxMarks), rubricCols[1] + 2, y + 4.5);
    const descLines = doc.splitTextToSize(row.description, rubricCols[3] - rubricCols[2] - 4);
    doc.text(descLines[0] ?? "", rubricCols[2] + 2, y + 4.5);
    doc.setDrawColor(221, 225, 231);
    doc.rect(LEFT, y, CONTENT_W, rowH);
    y += rowH;
  });

  const totalMarks = detail.rubric.reduce((s, r) => s + r.maxMarks, 0);
  checkNewPage(8);
  doc.setFillColor(26, 58, 92);
  doc.rect(LEFT, y, CONTENT_W, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("Total Marks:", rubricCols[0] + 2, y + 4.8);
  doc.text(String(totalMarks), rubricCols[1] + 2, y + 4.8);
  y += 9;

  y += 3;
  sectionTitle("REFERENCES");
  y += 2;
  detail.references.forEach((ref) => {
    checkNewPage(10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(37, 99, 235);
    doc.text(`[${ref.label}]`, LEFT, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    const refLines = doc.splitTextToSize(ref.detail, CONTENT_W - 4);
    refLines.forEach((line: string) => {
      checkNewPage(5);
      doc.text(`   ${line}`, LEFT, y);
      y += 4.8;
    });
    y += 2;
  });

  const abbr = subject.split(" ").map((w) => w[0]).join("").toUpperCase();
  doc.save(`Assignment_${abbr}_${detail.no}_KoushikThalari.pdf`);
}
