import express from "express";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

function drawTemplate(page, resume, templateId) {
  const { width, height } = page.getSize();
  const margin = 40;

  if (templateId === "2") {
    page.drawRectangle({
      x: 0,
      y: height - 120,
      width,
      height: 120,
      color: rgb(0.1, 0.2, 0.4)
    });
  } else if (templateId === "3") {
    page.drawRectangle({
      x: 0,
      y: 0,
      width: 120,
      height,
      color: rgb(0.2, 0.2, 0.2)
    });
  } else if (templateId === "4") {
    page.drawRectangle({
      x: 0,
      y: height - 80,
      width,
      height: 4,
      color: rgb(0.8, 0.2, 0.2)
    });
  }

  const safeX = templateId === "3" ? 140 : margin;
  let y = height - 60;
  const textColor = templateId === "2" ? rgb(1, 1, 1) : rgb(0, 0, 0);

  page.drawText(resume.name || "Unnamed Candidate", { x: safeX, y, size: 22, color: textColor });
  y -= 24;
  page.drawText(`${resume.email || ""} | ${resume.phone || ""}`, { x: safeX, y, size: 10, color: textColor });
  y -= 28;

  const sectionColor = templateId === "2" ? rgb(0.1, 0.2, 0.4) : rgb(0.1, 0.1, 0.1);
  const bodyColor = rgb(0.15, 0.15, 0.15);

  const sections = [
    ["Summary", resume.summary || ""],
    ["Skills", Array.isArray(resume.skills) ? resume.skills.join(", ") : resume.skills || ""],
    [
      "Experience",
      `${resume.experience?.title || ""} at ${resume.experience?.company || ""} (${resume.experience?.duration || ""})\n${resume.experience?.description || ""}`
    ],
    ["Education", resume.education || ""]
  ];

  for (const [title, content] of sections) {
    page.drawText(title, { x: safeX, y, size: 13, color: sectionColor });
    y -= 16;
    const snippet = String(content).slice(0, 450).split("\n");
    for (const line of snippet) {
      page.drawText(line, { x: safeX, y, size: 10, color: bodyColor });
      y -= 12;
      if (y < 50) {
        break;
      }
    }
    y -= 8;
    if (y < 50) {
      break;
    }
  }
}

router.post("/pdf", requireAuth, async (req, res) => {
  try {
    const resume = req.body;
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    await pdfDoc.embedFont(StandardFonts.Helvetica);

    drawTemplate(page, resume, String(resume.templateId ?? "1"));

    const bytes = await pdfDoc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");
    return res.send(Buffer.from(bytes));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
