import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const lines = [
  "Food Name|Meal Type|Quantity|Calories|Protein|Carbs|Fat|Date|Iron|Calcium|Vitamin C|Vitamin D",
  "Oatmeal with berries|breakfast|220|340|12|52|8|2026-08-10|2.1|120|18|0",
  "Greek yogurt|breakfast|180|160|15|12|4|2026-08-10|0.2|180|2|0",
  "Grilled chicken salad|lunch|280|410|38|18|16|2026-08-10|2.4|90|24|0",
  "Brown rice bowl|lunch|250|320|8|58|6|2026-08-10|1.2|20|0|0",
  "Apple|snacks|180|95|0.5|25|0.3|2026-08-10|0.1|10|8|0",
  "Salmon with veggies|dinner|300|480|42|14|26|2026-08-10|1.8|60|12|600",
  "Whole wheat pasta|dinner|260|390|14|62|9|2026-08-11|2.8|30|0|0",
  "Protein shake|snacks|350|220|30|8|4|2026-08-11|1.1|250|4|80",
  "Avocado toast|breakfast|190|280|10|24|16|2026-08-11|1.4|40|10|0",
  "Paneer tikka|dinner|240|430|28|12|28|2026-08-11|2.6|420|6|0",
];

const outputPaths = [
  path.resolve(__dirname, "../../samples/meals-import-sample.pdf"),
  path.resolve(__dirname, "../../frontend/public/samples/meals-import-sample.pdf"),
];

const generatePdf = (outputPath) =>
  new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const stream = fs.createWriteStream(outputPath);

    doc.pipe(stream);

    doc.fontSize(16).text("Food Diary Export", { align: "center" });
    doc.moveDown(0.5);
    doc
      .fontSize(10)
      .fillColor("#444444")
      .text("Sample tabular nutrition history for bulk import testing", {
        align: "center",
      });
    doc.moveDown(1.2);

    doc.fillColor("#000000").font("Courier").fontSize(9);
    lines.forEach((line, index) => {
      doc.text(line, { lineGap: index === 0 ? 8 : 4 });
    });

    doc.end();

    stream.on("finish", () => resolve(outputPath));
    stream.on("error", reject);
  });

for (const outputPath of outputPaths) {
  await generatePdf(outputPath);
  console.log(`Sample PDF created: ${outputPath}`);
}

const { extractTextFromPdf, parseMealPdfText } = await import(
  "../utils/parseMealPdf.js"
);
const buffer = fs.readFileSync(outputPaths[0]);
const parsed = parseMealPdfText(await extractTextFromPdf(buffer));
console.log(`Verified parsed meals: ${parsed.meals.length}`);
