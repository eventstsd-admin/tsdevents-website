const fs = require('fs');
const PDFDocument = require('pdfkit');

const inputPath = 'HANDOFF_ONE_PAGE.txt';
const outputPath = 'HANDOFF_ONE_PAGE.pdf';

const text = fs.readFileSync(inputPath, 'utf8');

const doc = new PDFDocument({ margin: 50 });
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Add logo (use public icon if available)
const logoPath = 'public/icon-192.png';
if (fs.existsSync(logoPath)) {
  try {
    doc.image(logoPath, 50, 50, { width: 64 });
  } catch (e) {
    // ignore image errors
  }
}

// Title centered, with some top padding to account for logo
doc.moveDown(1.2);
doc.fontSize(18).text('TSD Events & Decor — Handoff Checklist', { align: 'center' });
doc.moveDown();

const lines = text.split('\n');

let fontSize = 11;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trimEnd();
  if (!line) {
    doc.moveDown(0.5);
    continue;
  }

  // Section headings (all caps in source) -> larger
  if (/^[A-Z \-&'`]+$/.test(line) && line.length < 60) {
    doc.moveDown(0.25);
    doc.fontSize(13).fillColor('#000').text(line, { continued: false });
    doc.moveDown(0.2);
    doc.fontSize(fontSize);
    continue;
  }

  // Bullet lines
  if (line.startsWith('- ')) {
    doc.list([line.slice(2)], { bulletIndent: 10 });
    continue;
  }

  // Normal text
  doc.fontSize(fontSize).fillColor('#111').text(line, { paragraphGap: 2 });
}

doc.end();

// Add prepared by footer before closing stream (position near bottom)
doc.on('pageAdded', () => {});
doc.moveTo(50, doc.page.height - 80);
doc.fontSize(10).fillColor('#444').text('Prepared by: Dhyey Rathi', 50, doc.page.height - 60);

stream.on('finish', () => {
  console.log('PDF written to', outputPath);
});
