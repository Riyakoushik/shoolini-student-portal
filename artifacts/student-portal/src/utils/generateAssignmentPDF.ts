import { jsPDF } from "jspdf";
import { student } from "../data/studentData";
import type { AssignmentDetail } from "../data/assignmentDetails";
import shooliniLogoSrc from "../assets/shoolini-logo.png";
import { generateRubberStamp, generateCursiveSignature } from "./stampGenerator";

const NAVY = "#1a3a5c";
const HEADER_BG = "#0f2744";
const GOLD = "#c8a84b";
const GREEN = "#16a34a";
const RED = "#dc2626";
const GRAY = "#64748b";
const BORDER = "#cbd5e1";

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

export async function downloadAssignmentPDF(
  detail: AssignmentDetail,
  assignmentTitle: string,
  subject: string,
  dueDate: string,
  status: string
): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const PAGE_W = 210;
  const PAGE_H = 297;
  const LEFT = 14;
  const RIGHT = PAGE_W - 14;
  const CONTENT_W = RIGHT - LEFT;

  const logoData = await getLogoBase64(shooliniLogoSrc);

  function drawHeader(pageNum: number) {
    setFill(doc, HEADER_BG);
    doc.rect(0, 0, PAGE_W, 36, "F");

    // Branded Logo Pill
    setFill(doc, "#ffffff");
    doc.roundedRect(LEFT, 6, 34, 17, 2, 2, "F");
    if (logoData) {
      try {
        doc.addImage(logoData, "PNG", LEFT + 2.5, 7.5, 29, 14);
      } catch {
        // ok
      }
    }

    // Typography
    setColor(doc, "#ffffff");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("SHOOLINI UNIVERSITY", RIGHT, 12, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(203, 213, 225);
    doc.text(
      "Department of Computer Science & Engineering | Kasauli Hills, Solan (H.P.)",
      RIGHT,
      17,
      { align: "right" }
    );

    setColor(doc, GOLD);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(
      "ACADEMIC ASSIGNMENT SPECIFICATION & ASSESSMENT BRIEF",
      RIGHT,
      24,
      { align: "right" }
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(241, 245, 249);
    doc.text(
      "NAAC A+ Accredited  |  Top 100 NIRF Ranked  |  UGC Approved",
      RIGHT,
      30,
      { align: "right" }
    );

    // Gold ribbon
    setFill(doc, GOLD);
    doc.rect(0, 35, PAGE_W, 1, "F");

    // Page footer
    setFill(doc, HEADER_BG);
    doc.rect(0, PAGE_H - 9, PAGE_W, 9, "F");
    doc.setFontSize(6.5);
    doc.setTextColor(203, 213, 225);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Shoolini University Student Portal  |  Assignment #${detail.no} — ${subject}  |  Page ${pageNum}`,
      PAGE_W / 2,
      PAGE_H - 3.5,
      { align: "center" }
    );
  }

  let y = 41;
  let page = 1;
  drawHeader(page);

  function checkNewPage(needed = 14) {
    if (y + needed > PAGE_H - 18) {
      doc.addPage();
      page++;
      drawHeader(page);
      y = 41;
    }
  }

  function sectionHeading(title: string) {
    checkNewPage(14);
    setFill(doc, NAVY);
    doc.rect(LEFT, y, CONTENT_W, 7, "F");
    setColor(doc, "#ffffff");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text(title, LEFT + 3, y + 4.8);
    y += 9.5;
  }

  // ── 1. STUDENT & COURSE METADATA CARD ──────────────────────────────────────
  setFill(doc, "#f8fafc");
  doc.rect(LEFT, y, CONTENT_W, 28, "F");
  setStroke(doc, BORDER);
  doc.setLineWidth(0.3);
  doc.rect(LEFT, y, CONTENT_W, 28, "S");

  // Col 1
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  setColor(doc, GRAY);
  doc.text("STUDENT NAME:", LEFT + 4, y + 5.5);
  setColor(doc, NAVY);
  doc.text(student.name.toUpperCase(), LEFT + 32, y + 5.5);

  setColor(doc, GRAY);
  doc.text("ROLL / REG NO:", LEFT + 4, y + 11.5);
  setColor(doc, "#1e293b");
  doc.text(`${student.rollNo}  |  ${student.registrationNo}`, LEFT + 32, y + 11.5);

  setColor(doc, GRAY);
  doc.text("PROGRAM / BATCH:", LEFT + 4, y + 17.5);
  setColor(doc, "#1e293b");
  doc.text(`MCA (AI & ML)  |  Batch ${student.batch}`, LEFT + 32, y + 17.5);

  setColor(doc, GRAY);
  doc.text("SUBJECT:", LEFT + 4, y + 23.5);
  setColor(doc, "#1e293b");
  doc.text(subject, LEFT + 32, y + 23.5);

  // Col 2
  const C2X = LEFT + 106;
  setColor(doc, GRAY);
  doc.text("ASSIGNMENT NO:", C2X, y + 5.5);
  setColor(doc, NAVY);
  doc.text(`Task #${detail.no}`, C2X + 28, y + 5.5);

  setColor(doc, GRAY);
  doc.text("ASSIGNMENT TYPE:", C2X, y + 11.5);
  setColor(doc, "#1e293b");
  doc.text(
    detail.labObjective ? "Practical / Lab Assignment" : "Theoretical / Analytical",
    C2X + 28,
    y + 11.5
  );

  setColor(doc, GRAY);
  doc.text("DUE DATE:", C2X, y + 17.5);
  setColor(doc, RED);
  doc.text(dueDate, C2X + 28, y + 17.5);

  setColor(doc, GRAY);
  doc.text("SUBMISSION STATUS:", C2X, y + 23.5);
  const isSubmitted = status.toLowerCase().includes("submitted") || status.toLowerCase().includes("evaluated");
  setColor(doc, isSubmitted ? GREEN : RED);
  doc.text(status.toUpperCase(), C2X + 28, y + 23.5);

  y += 32;

  // ── 2. ASSIGNMENT TITLE & OVERVIEW ─────────────────────────────────────────
  setFill(doc, "#f1f5f9");
  doc.rect(LEFT, y, CONTENT_W, 11, "F");
  setStroke(doc, GOLD);
  doc.setLineWidth(0.4);
  doc.rect(LEFT, y, CONTENT_W, 11, "S");

  setColor(doc, GRAY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("ASSIGNMENT TOPIC", LEFT + 3, y + 4);

  setColor(doc, NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(assignmentTitle, LEFT + 3, y + 8.5);

  y += 15;

  // ── 3. BODY: LAB OBJECTIVE OR QUESTIONS ────────────────────────────────────
  if (detail.labObjective) {
    sectionHeading("1. LAB OBJECTIVE & SCOPE");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setColor(doc, "#1e293b");
    const lines = doc.splitTextToSize(detail.labObjective, CONTENT_W);
    lines.forEach((l: string) => {
      checkNewPage(5);
      doc.text(l, LEFT, y);
      y += 4.8;
    });
    y += 4;

    if (detail.labRequirements?.length) {
      sectionHeading("2. ENVIRONMENT, HARDWARE & SOFTWARE PREREQUISITES");
      detail.labRequirements.forEach((req) => {
        checkNewPage(5);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        setColor(doc, "#1e293b");
        doc.text(`  •  ${req}`, LEFT, y);
        y += 4.8;
      });
      y += 4;
    }

    if (detail.labSteps?.length) {
      sectionHeading("3. STEP-BY-STEP IMPLEMENTATION PROCEDURE");
      detail.labSteps.forEach((step, idx) => {
        checkNewPage(7);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        setColor(doc, NAVY);
        doc.text(`Step ${idx + 1}:`, LEFT, y);

        doc.setFont("helvetica", "normal");
        setColor(doc, "#1e293b");
        const stepLines = doc.splitTextToSize(step, CONTENT_W - 14);
        doc.text(stepLines, LEFT + 14, y);
        y += Math.max(5, stepLines.length * 4.6) + 1.5;
      });
      y += 3;
    }

    if (detail.labExpectedOutput) {
      sectionHeading("4. EXPECTED OUTPUT & DELIVERABLE ARTIFACTS");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      setColor(doc, "#1e293b");
      const outLines = doc.splitTextToSize(detail.labExpectedOutput, CONTENT_W);
      outLines.forEach((l: string) => {
        checkNewPage(5);
        doc.text(l, LEFT, y);
        y += 4.8;
      });
      y += 4;
    }

    if (detail.viva?.length) {
      sectionHeading("5. VIVA VOCE EXAMINATION QUESTIONS");
      detail.viva.forEach((vq, i) => {
        checkNewPage(7);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        setColor(doc, NAVY);
        doc.text(`Q${i + 1}.`, LEFT, y);

        doc.setFont("helvetica", "normal");
        setColor(doc, "#1e293b");
        const vLines = doc.splitTextToSize(vq, CONTENT_W - 8);
        doc.text(vLines, LEFT + 8, y);
        y += Math.max(5, vLines.length * 4.6) + 1.5;
      });
      y += 3;
    }
  } else if (detail.questions?.length) {
    sectionHeading("QUESTIONS & PROBLEM FORMULATION");
    detail.questions.forEach((q, idx) => {
      checkNewPage(9);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      setColor(doc, NAVY);
      doc.text(
        `Q${idx + 1}.  [Allocated Weightage: ${q.marks} Mark${q.marks > 1 ? "s" : ""}]`,
        LEFT,
        y
      );
      y += 4.5;

      doc.setFont("helvetica", "normal");
      setColor(doc, "#1e293b");
      const qLines = doc.splitTextToSize(q.q, CONTENT_W - 4);
      qLines.forEach((line: string) => {
        checkNewPage(5);
        doc.text(`    ${line}`, LEFT, y);
        y += 4.8;
      });
      y += 2;
    });
    y += 3;
  }

  // ── 4. EVALUATION RUBRIC TABLE ─────────────────────────────────────────────
  sectionHeading("EVALUATION & ASSESSMENT RUBRICS");
  checkNewPage(12);

  const colCrit = LEFT + 2;
  const colMarks = LEFT + 45;
  const colDesc = LEFT + 68;

  setFill(doc, "#f1f5f9");
  doc.rect(LEFT, y, CONTENT_W, 6.5, "F");
  setStroke(doc, BORDER);
  doc.setLineWidth(0.3);
  doc.rect(LEFT, y, CONTENT_W, 6.5, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  setColor(doc, GRAY);
  doc.text("ASSESSMENT CRITERIA", colCrit, y + 4.5);
  doc.text("MAX MARKS", colMarks, y + 4.5);
  doc.text("PERFORMANCE BENCHMARK / DESCRIPTION", colDesc, y + 4.5);
  y += 6.5;

  let totalMarks = 0;
  detail.rubric.forEach((row, idx) => {
    totalMarks += row.maxMarks;
    checkNewPage(8);
    const rowH = 7;

    if (idx % 2 === 1) {
      setFill(doc, "#f8fafc");
      doc.rect(LEFT, y, CONTENT_W, rowH, "F");
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    setColor(doc, "#1e293b");
    doc.text(row.criteria, colCrit, y + 4.8);

    doc.setFont("helvetica", "normal");
    setColor(doc, NAVY);
    doc.text(`${row.maxMarks} pts`, colMarks, y + 4.8);

    setColor(doc, GRAY);
    const desc = doc.splitTextToSize(row.description, CONTENT_W - 72);
    doc.text(desc[0] || "", colDesc, y + 4.8);

    setStroke(doc, "#e2e8f0");
    doc.setLineWidth(0.2);
    doc.line(LEFT, y + rowH, RIGHT, y + rowH);

    y += rowH;
  });

  // Summary Row
  checkNewPage(7);
  setFill(doc, "#e2e8f0");
  doc.rect(LEFT, y, CONTENT_W, 6.5, "F");
  setStroke(doc, BORDER);
  doc.setLineWidth(0.3);
  doc.rect(LEFT, y, CONTENT_W, 6.5, "S");

  setColor(doc, NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("TOTAL ASSESSMENT MARKS", colCrit, y + 4.6);
  doc.text(`${totalMarks} Marks`, colMarks, y + 4.6);
  setColor(doc, GRAY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Normalized directly into Continuous Internal Assessment (IA)", colDesc, y + 4.6);
  y += 10;

  // ── 5. REFERENCES & CITATIONS ──────────────────────────────────────────────
  if (detail.references?.length) {
    sectionHeading("RECOMMENDED REFERENCES & OPEN ACCESS MATERIALS");
    detail.references.forEach((ref) => {
      checkNewPage(8);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      setColor(doc, "#2563eb");
      doc.text(`[Ref]  ${ref.label}`, LEFT + 2, y);
      y += 4;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      setColor(doc, GRAY);
      const rLines = doc.splitTextToSize(ref.detail, CONTENT_W - 6);
      rLines.forEach((l: string) => {
        checkNewPage(5);
        doc.text(`       ${l}`, LEFT + 2, y);
        y += 3.8;
      });
      y += 1.5;
    });
    y += 4;
  }

  // ── 6. SIGN-OFF BLOCK ──────────────────────────────────────────────────────
  checkNewPage(28);
  setStroke(doc, GOLD);
  doc.setLineWidth(0.5);
  doc.line(LEFT, y, RIGHT, y);
  y += 5;

  // Instructor signature on left (Dr. Priya Sharma)
  const instrSig = generateCursiveSignature({
    signer: "coordinator",
    color: "#1e40af",
    width: 260,
    height: 90,
  });
  if (instrSig) {
    try {
      doc.addImage(instrSig, "PNG", LEFT, y - 11, 28, 9.7);
    } catch {
      // ok
    }
  }

  // Department stamp in center
  const deptStamp = generateRubberStamp({
    textTop: "SHOOLINI UNIVERSITY • DEPT OF CSE",
    textBottom: "EVALUATION CELL • ESTD 2009",
    centerLines: ["DEPT. OF CSE", "ASSIGNMENT EVALUATION", "ACADEMIC CELL"],
    color: "#1e3a8a",
    size: 360,
    tiltDeg: -3.5,
  });
  if (deptStamp) {
    try {
      doc.addImage(deptStamp, "PNG", PAGE_W / 2 - 11, y - 11, 22, 22);
    } catch {
      // ok
    }
  }

  // HOD signature on right (Dr. Rajesh Kumar)
  const hodSig = generateCursiveSignature({
    signer: "hod",
    color: "#0f3ba2",
    width: 260,
    height: 90,
  });
  if (hodSig) {
    try {
      doc.addImage(hodSig, "PNG", RIGHT - 30, y - 11, 28, 9.7);
    } catch {
      // ok
    }
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  setColor(doc, NAVY);
  doc.text("Dr. Priya Sharma", LEFT, y + 4);
  doc.text("Dr. Rajesh Kumar", RIGHT, y + 4, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  setColor(doc, GRAY);
  doc.text("Course Instructor / Evaluator", LEFT, y + 7.5);
  doc.text("Head of Department (CSE)", RIGHT, y + 7.5, { align: "right" });
  doc.text("Department of Computer Science & Engineering", LEFT, y + 11);
  doc.text("School of Computing & Artificial Intelligence", RIGHT, y + 11, {
    align: "right",
  });

  const abbr = subject
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  doc.save(
    `SU_Assignment_${abbr}_Task${detail.no}_${student.rollNo}_KoushikThalari.pdf`
  );
}
