/**
 * Realistic Institutional Rubber Stamp & Cursive Ink Signature Generator
 * Generates high-resolution PNG data URLs with mathematically spaced curved arc text,
 * double concentric stamp rings, authentic ink pigments, and name-matched Bézier pen signatures.
 */

export interface CircularStampOptions {
  textTop?: string;
  textBottom?: string;
  centerLines: string[];
  color?: string; // e.g. '#1e3a8a' for Controller seal, '#15803d' for Paid stamp
  size?: number; // canvas size in px (e.g. 360)
  tiltDeg?: number; // natural hand-stamped angle (e.g. -4)
}

export type SignerRole =
  | "controller" // Dr. S.K. Bansal (Controller of Examinations)
  | "accounts" // A.K. Verma (Finance & Accounts Officer)
  | "coordinator" // Dr. Priya Sharma (Program Coordinator)
  | "dean" // Prof. (Dr.) Sunil Puri (Dean of Academic Affairs)
  | "hod" // Dr. Rajesh Kumar (HOD, CSE)
  | "student"; // Koushik Thalari (Student)

export interface SignatureOptions {
  signer: SignerRole;
  color?: string;
  width?: number;
  height?: number;
}

/**
 * Creates an authentic circular rubber ink stamp with non-overlapping arc typography
 */
export function generateRubberStamp(options: CircularStampOptions): string {
  const size = options.size || 360;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const color = options.color || "#1e3a8a"; // default classic violet-indigo rubber ink
  const tilt = (options.tiltDeg ?? -3.5) * (Math.PI / 180);
  const cx = size / 2;
  const cy = size / 2;

  ctx.clearRect(0, 0, size, size);
  ctx.save();

  // Apply hand-stamped rotation around center
  ctx.translate(cx, cy);
  ctx.rotate(tilt);
  ctx.translate(-cx, -cy);

  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  // Circular Institutional Rubber Seal Geometry
  const outerR = size / 2 - 12; // 168
  const innerR = outerR - 5; // 163
  const textR = 142; // middle of text band
  const coreR = 118; // inner circle bounding the center lines

  // Outer thick rubber ring
  ctx.lineWidth = 3.6;
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.stroke();

  // Secondary delicate concentric ring
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
  ctx.stroke();

  // Inner core circle bordering the center text
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
  ctx.stroke();

  // ── TOP ARC TEXT ─────────────────────────────────────────────────────────
  // Default: "SHOOLINI UNIVERSITY • SOLAN (H.P.)"
  const textTop = (options.textTop || "SHOOLINI UNIVERSITY • SOLAN (H.P.)").toUpperCase();
  ctx.font = "bold 11px Arial, Helvetica, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Dynamic angle calculation based on string length to guarantee letters never touch
  const topTotalAngle = Math.min(Math.PI * 0.95, textTop.length * 0.082);
  const topStartAngle = -Math.PI / 2 - topTotalAngle / 2;
  const topStepAngle = topTotalAngle / Math.max(textTop.length - 1, 1);

  for (let i = 0; i < textTop.length; i++) {
    const angle = topStartAngle + i * topStepAngle;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.translate(0, -textR);
    ctx.fillText(textTop[i], 0, 0);
    ctx.restore();
  }

  // ── BOTTOM ARC TEXT ──────────────────────────────────────────────────────
  // Default: "NAAC A+ ACCREDITED • ESTD 2009"
  const textBottom = (options.textBottom || "NAAC A+ ACCREDITED • ESTD 2009").toUpperCase();
  ctx.font = "bold 10px Arial, Helvetica, sans-serif";

  const btmTotalAngle = Math.min(Math.PI * 0.88, textBottom.length * 0.08);
  const btmStartAngle = Math.PI / 2 + btmTotalAngle / 2;
  const btmStepAngle = btmTotalAngle / Math.max(textBottom.length - 1, 1);

  for (let i = 0; i < textBottom.length; i++) {
    const angle = btmStartAngle - i * btmStepAngle;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.translate(0, textR);
    ctx.scale(-1, -1); // flip text upright along curve
    ctx.fillText(textBottom[i], 0, 0);
    ctx.restore();
  }

  // ── CENTER BANNER / LINES ────────────────────────────────────────────────
  const lines = options.centerLines;
  const count = lines.length;
  const lineHeight = 17;
  const startY = cy - ((count - 1) * lineHeight) / 2;

  lines.forEach((line, idx) => {
    const y = startY + idx * lineHeight;
    if (idx === 0) {
      ctx.font = "bold 13px Arial, Helvetica, sans-serif";
    } else if (idx === 1 && count > 2) {
      ctx.font = "bold 11.5px Arial, Helvetica, sans-serif";
    } else {
      ctx.font = "bold 10px 'Courier New', monospace, sans-serif";
    }
    ctx.fillText(line, cx, y);
  });

  // Clean decorative dots on left & right of center core
  ctx.font = "10px sans-serif";
  ctx.fillText("★", cx - coreR + 14, cy);
  ctx.fillText("★", cx + coreR - 14, cy);

  ctx.restore();
  return canvas.toDataURL("image/png");
}

/**
 * Creates authentic, name-matched fluid cursive ink signatures
 */
export function generateCursiveSignature(options: SignatureOptions): string {
  const w = options.width || 300;
  const h = options.height || 100;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.clearRect(0, 0, w, h);

  const inkColor = options.color || "#1e40af"; // Royal Blue fountain-pen ink
  ctx.strokeStyle = inkColor;
  ctx.fillStyle = inkColor;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (options.signer === "controller") {
    // ── Dr. S.K. Bansal (Controller of Examinations) ─────────────────────────
    // Flowing 'S. K. Bansal' with capital S, K, and cursive Bansal + flourish
    ctx.lineWidth = 2.2;
    ctx.beginPath();

    // Capital 'S'
    ctx.moveTo(35, 75);
    ctx.bezierCurveTo(45, 30, 65, 18, 60, 36);
    ctx.bezierCurveTo(55, 52, 38, 56, 44, 76);
    ctx.bezierCurveTo(48, 86, 68, 86, 74, 78);
    ctx.stroke();

    // S dot
    ctx.beginPath();
    ctx.arc(80, 78, 2, 0, Math.PI * 2);
    ctx.fill();

    // Capital 'K'
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(92, 78);
    ctx.bezierCurveTo(94, 48, 98, 24, 102, 20); // K stem
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(118, 32);
    ctx.bezierCurveTo(110, 42, 104, 50, 100, 54);
    ctx.bezierCurveTo(106, 60, 116, 70, 124, 78);
    ctx.stroke();

    // K dot
    ctx.beginPath();
    ctx.arc(129, 78, 2, 0, Math.PI * 2);
    ctx.fill();

    // Capital 'B' and cursive 'ansal'
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(142, 78);
    ctx.bezierCurveTo(145, 45, 148, 22, 152, 18); // B stem
    ctx.bezierCurveTo(168, 14, 178, 26, 172, 42); // B upper lobe
    ctx.bezierCurveTo(166, 48, 154, 48, 150, 48);
    ctx.bezierCurveTo(166, 48, 182, 54, 176, 74); // B lower lobe
    ctx.bezierCurveTo(172, 82, 156, 80, 150, 78);
    ctx.stroke();

    // 'ansal'
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(174, 72);
    ctx.bezierCurveTo(180, 62, 188, 58, 194, 70); // a
    ctx.bezierCurveTo(198, 76, 204, 60, 210, 68); // n
    ctx.bezierCurveTo(214, 74, 218, 64, 224, 66); // s
    ctx.bezierCurveTo(228, 74, 234, 60, 240, 68); // a
    ctx.bezierCurveTo(244, 74, 250, 36, 254, 30); // l ascender
    ctx.bezierCurveTo(256, 24, 252, 26, 252, 48);
    ctx.bezierCurveTo(252, 68, 260, 74, 268, 70);
    ctx.stroke();

    // Dynamic underline flourish
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(35, 88);
    ctx.bezierCurveTo(110, 85, 190, 83, 276, 80);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(282, 79, 2, 0, Math.PI * 2);
    ctx.fill();

  } else if (options.signer === "accounts") {
    // ── A.K. Verma (Finance & Accounts Officer) ──────────────────────────────
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    // Capital 'A'
    ctx.moveTo(38, 78);
    ctx.bezierCurveTo(45, 42, 58, 20, 66, 18);
    ctx.bezierCurveTo(72, 40, 80, 65, 86, 78);
    ctx.stroke();

    // A cross bar
    ctx.beginPath();
    ctx.moveTo(46, 52);
    ctx.lineTo(80, 52);
    ctx.stroke();

    // A dot
    ctx.beginPath();
    ctx.arc(91, 78, 2, 0, Math.PI * 2);
    ctx.fill();

    // Capital 'K'
    ctx.beginPath();
    ctx.moveTo(102, 78);
    ctx.bezierCurveTo(104, 48, 108, 24, 110, 20);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(125, 30);
    ctx.lineTo(110, 50);
    ctx.lineTo(128, 78);
    ctx.stroke();

    // K dot
    ctx.beginPath();
    ctx.arc(133, 78, 2, 0, Math.PI * 2);
    ctx.fill();

    // Capital 'V' and 'erma'
    ctx.lineWidth = 2.3;
    ctx.beginPath();
    ctx.moveTo(144, 30);
    ctx.bezierCurveTo(150, 55, 160, 78, 168, 78);
    ctx.bezierCurveTo(174, 78, 184, 40, 190, 42); // V upstroke
    ctx.stroke();

    // 'erma'
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(190, 42);
    ctx.bezierCurveTo(196, 60, 202, 72, 210, 70); // e
    ctx.bezierCurveTo(216, 68, 220, 58, 226, 70); // r
    ctx.bezierCurveTo(232, 76, 238, 62, 246, 70); // m
    ctx.bezierCurveTo(252, 76, 258, 64, 266, 70); // a
    ctx.stroke();

    // Underline
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(140, 88);
    ctx.bezierCurveTo(185, 86, 235, 84, 276, 82);
    ctx.stroke();

  } else if (options.signer === "coordinator") {
    // ── Dr. Priya Sharma (Program Coordinator) ───────────────────────────────
    ctx.lineWidth = 2.3;
    ctx.beginPath();
    // 'P' stem
    ctx.moveTo(42, 78);
    ctx.bezierCurveTo(46, 45, 52, 22, 58, 18);
    // 'P' loop
    ctx.bezierCurveTo(75, 14, 88, 24, 82, 44);
    ctx.bezierCurveTo(76, 52, 58, 52, 52, 52);
    ctx.stroke();

    // 'riya'
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(76, 46);
    ctx.bezierCurveTo(86, 68, 94, 76, 102, 72); // r
    ctx.bezierCurveTo(108, 70, 114, 62, 120, 72); // i
    ctx.bezierCurveTo(124, 78, 128, 92, 132, 98); // y descender
    ctx.bezierCurveTo(134, 104, 128, 106, 124, 98); // loop back
    ctx.bezierCurveTo(130, 84, 140, 64, 148, 72); // a
    ctx.stroke();

    // 'Sharma'
    ctx.lineWidth = 2.1;
    ctx.beginPath();
    ctx.moveTo(160, 54);
    ctx.bezierCurveTo(170, 30, 180, 26, 176, 44); // S
    ctx.bezierCurveTo(172, 60, 164, 72, 184, 72);
    ctx.bezierCurveTo(192, 72, 198, 48, 204, 72); // h
    ctx.bezierCurveTo(210, 76, 218, 62, 226, 72); // a-r-m
    ctx.bezierCurveTo(234, 78, 244, 66, 252, 72); // a
    ctx.stroke();

    // Underline
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(38, 88);
    ctx.bezierCurveTo(110, 86, 190, 84, 270, 82);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(276, 81, 2, 0, Math.PI * 2);
    ctx.fill();

  } else if (options.signer === "dean") {
    // ── Prof. (Dr.) Sunil Puri (Dean of Academic Affairs) ────────────────────
    ctx.lineWidth = 2.3;
    ctx.beginPath();
    // 'S'
    ctx.moveTo(40, 78);
    ctx.bezierCurveTo(50, 35, 70, 20, 65, 38);
    ctx.bezierCurveTo(60, 52, 42, 56, 48, 74);
    ctx.bezierCurveTo(52, 84, 72, 84, 80, 76);
    ctx.stroke();

    // 'unil'
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(80, 76);
    ctx.bezierCurveTo(86, 64, 92, 64, 98, 74); // u
    ctx.bezierCurveTo(104, 78, 110, 64, 116, 72); // n
    ctx.bezierCurveTo(122, 76, 126, 66, 132, 74); // i
    ctx.bezierCurveTo(136, 78, 142, 38, 146, 32); // l ascender
    ctx.bezierCurveTo(148, 26, 144, 28, 144, 52);
    ctx.stroke();

    // 'Puri'
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(164, 78);
    ctx.bezierCurveTo(168, 48, 172, 26, 178, 22); // P stem
    ctx.bezierCurveTo(194, 18, 206, 28, 200, 46); // P loop
    ctx.bezierCurveTo(194, 54, 178, 54, 174, 54);
    ctx.stroke();

    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(194, 52);
    ctx.bezierCurveTo(204, 68, 212, 76, 220, 72); // u
    ctx.bezierCurveTo(226, 70, 232, 62, 238, 72); // r
    ctx.bezierCurveTo(242, 76, 248, 64, 254, 72); // i
    ctx.stroke();

    // Underline
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(38, 88);
    ctx.bezierCurveTo(120, 86, 200, 84, 268, 82);
    ctx.stroke();

  } else if (options.signer === "hod") {
    // ── Dr. Rajesh Kumar (HOD, CSE) ──────────────────────────────────────────
    ctx.lineWidth = 2.3;
    ctx.beginPath();
    // 'R'
    ctx.moveTo(42, 78);
    ctx.bezierCurveTo(46, 45, 52, 24, 56, 18);
    ctx.bezierCurveTo(72, 14, 86, 24, 80, 44);
    ctx.bezierCurveTo(74, 52, 58, 52, 54, 52);
    ctx.bezierCurveTo(66, 56, 78, 70, 88, 78);
    ctx.stroke();

    // 'ajesh'
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(88, 76);
    ctx.bezierCurveTo(96, 64, 104, 64, 110, 74); // a
    ctx.bezierCurveTo(114, 80, 118, 94, 122, 100); // j descender
    ctx.bezierCurveTo(124, 106, 118, 108, 114, 100);
    ctx.bezierCurveTo(120, 86, 130, 66, 138, 74); // e
    ctx.bezierCurveTo(144, 78, 150, 66, 158, 72); // s
    ctx.bezierCurveTo(162, 76, 168, 48, 174, 42); // h
    ctx.stroke();

    // 'Kumar'
    ctx.lineWidth = 2.1;
    ctx.beginPath();
    ctx.moveTo(190, 78);
    ctx.bezierCurveTo(192, 48, 196, 26, 198, 22); // K stem
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(215, 32);
    ctx.lineTo(198, 52);
    ctx.lineTo(218, 78);
    ctx.stroke();

    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(218, 76);
    ctx.bezierCurveTo(226, 66, 234, 66, 240, 74); // u-m
    ctx.bezierCurveTo(246, 78, 254, 66, 262, 74); // a-r
    ctx.stroke();

    // Underline
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(40, 88);
    ctx.bezierCurveTo(120, 86, 200, 84, 274, 82);
    ctx.stroke();

  } else {
    // ── Koushik Thalari (Student) ────────────────────────────────────────────
    ctx.lineWidth = 2.3;
    ctx.beginPath();
    // 'K' stem
    ctx.moveTo(40, 78);
    ctx.bezierCurveTo(44, 48, 50, 24, 54, 18);
    ctx.stroke();

    // 'K' arms
    ctx.beginPath();
    ctx.moveTo(76, 28);
    ctx.bezierCurveTo(66, 38, 56, 48, 52, 52);
    ctx.bezierCurveTo(62, 58, 74, 70, 84, 78);
    ctx.stroke();

    // 'oushik'
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(84, 76);
    ctx.bezierCurveTo(92, 64, 100, 64, 106, 74); // o
    ctx.bezierCurveTo(112, 78, 118, 66, 124, 72); // u
    ctx.bezierCurveTo(130, 76, 136, 66, 142, 72); // s
    ctx.bezierCurveTo(146, 76, 152, 44, 156, 38); // h
    ctx.bezierCurveTo(158, 48, 162, 74, 168, 74);
    ctx.bezierCurveTo(172, 74, 178, 64, 184, 72); // i
    ctx.bezierCurveTo(188, 76, 194, 52, 200, 74); // k
    ctx.stroke();

    // 'Thalari'
    ctx.lineWidth = 2.1;
    ctx.beginPath();
    ctx.moveTo(214, 28);
    ctx.lineTo(240, 28); // T bar
    ctx.moveTo(226, 28);
    ctx.bezierCurveTo(228, 50, 230, 72, 232, 78); // T stem
    ctx.stroke();

    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(232, 76);
    ctx.bezierCurveTo(238, 66, 244, 66, 250, 74); // h-a
    ctx.bezierCurveTo(256, 78, 262, 40, 266, 36); // l
    ctx.bezierCurveTo(268, 46, 272, 74, 278, 74); // a-r-i
    ctx.stroke();

    // Underline
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(38, 88);
    ctx.bezierCurveTo(110, 86, 190, 84, 286, 82);
    ctx.stroke();
  }

  return canvas.toDataURL("image/png");
}
