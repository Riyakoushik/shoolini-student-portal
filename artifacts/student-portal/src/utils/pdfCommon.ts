import { jsPDF } from "jspdf";

/**
 * Common RGB color palette for PDF generation across utility modules.
 */
export const PDF_COLORS = {
  NAVY: { r: 26, g: 58, b: 92 }, // #1a3a5c
  GOLD: { r: 200, g: 168, b: 75 }, // #c8a84b 
  SLATE: { r: 100, g: 116, b: 139 }, // #64748b 
  DARK: { r: 30, g: 42, b: 58 }, // #1e2a3a
};

export const PAGE_GEOMETRY = {
  WIDTH: 210,
  MARGIN: 15,
  RIGHT: 195,
  CONTENT: 180,
};

/**
 * Loads an image from a URL and converts it to a white Logo for dark headers.
 * @param {string} url The image source URL.
 * @returns {Promise<string | null>} Base64 encoded white-filtered logo.
 */
export async function getWhiteLogoBase64(url: string): Promise<string | null> {
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
    const id = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = id.data;
    for (let i = 0; i < d.length; i += 4) {
      // If pixel is not transparent, make it white
      if (d[i + 3] > 10) {
        d[i] = 255; d[i + 1] = 255; d[i + 2] = 255;
      }
    }
    ctx.putImageData(id, 0, 0);
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}

/**
 * Draws a standard horizontal line on the current PDF page.
 */
export function drawHLine(doc: jsPDF, y: number, r: number, g: number, b: number, lw = 0.3) {
  doc.setDrawColor(r, g, b);
  doc.setLineWidth(lw);
  doc.line(PAGE_GEOMETRY.MARGIN, y, PAGE_GEOMETRY.RIGHT, y);
}

/**
 * Draws the standard Shoolini University PDF footer.
 */
export function drawStandardFooter(doc: jsPDF) {
  const PW = PAGE_GEOMETRY.WIDTH;
  doc.setFillColor(PDF_COLORS.NAVY.r, PDF_COLORS.NAVY.g, PDF_COLORS.NAVY.b);
  doc.rect(0, 287, PW, 10, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(255, 255, 255);
  doc.text(
    "Office of Examinations  |  Shoolini University  |  examinations@shooliniuniversity.com",
    PW / 2, 293, { align: "center" }
  );

  doc.setTextColor(180, 195, 215);
  doc.text(
    "Shoolini University of Biotechnology and Management Sciences  |  shooliniuniversity.com",
    PW / 2, 298, { align: "center" }
  );
}
