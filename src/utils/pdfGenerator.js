import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export const generateLabelsPDF = async (labelNumbers) => {
  const doc = new jsPDF(); 

  // --- STICKER CALIBRATION SETTINGS ---
  const startX = 10;         // Left margin of the page (mm)
  const startY = 10;         // Top margin of the page (mm)
  const labelWidth = 25;     // Width of one sticker (25mm = 1 inch)
  const labelHeight = 25;    // Height of one sticker
  const gapX = 2;            // Horizontal gap between stickers (mm)
  const gapY = 2;            // Vertical gap between rows (mm)
  const columns = 4;         // 4 stickers across the roll
  const rowsPerPage = 10;    // How many rows fit on one printed page

  // --- INTERNAL QR SIZING ---
  const qrSize = 19;         // QR code size (leaves 6mm for text at the bottom)
  const qrMarginX = (labelWidth - qrSize) / 2; // Centers the QR horizontally in the sticker
  const qrMarginY = 1;       // Pushes the QR 1mm down from the top edge

  for (let i = 0; i < labelNumbers.length; i++) {
    const label = labelNumbers[i];
    const verifyUrl = `${import.meta.env.VITE_FRONTEND_URL}/verify/${label}`;

    // 1. Calculate Exact Grid Position
    const col = i % columns;
    const row = Math.floor(i / columns);
    const pageRow = row % rowsPerPage;

    // 2. Add New Page if needed
    if (i > 0 && col === 0 && pageRow === 0) {
      doc.addPage();
    }

    // 3. Calculate X and Y for this specific sticker
    const currentX = startX + col * (labelWidth + gapX);
    const currentY = startY + pageRow * (labelHeight + gapY);

    try {
      // 4. Generate Ultra-High Quality QR Code (400px)
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, { 
        width: 400,  // Increased from 300 for crisp scanning
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' }
      });

      // 5. Draw the QR Code
      doc.addImage(qrDataUrl, "PNG", currentX + qrMarginX, currentY + qrMarginY, qrSize, qrSize);
      
      // 6. Draw the Label Text
      doc.setFontSize(7); // Size 7 fits a 12-char ID perfectly inside 25mm
      // Calculate exact center of the 25mm box (currentX + 12.5)
      doc.text(label, currentX + (labelWidth / 2), currentY + qrSize + 4, { align: "center" });

    } catch (err) {
      console.error("Error generating QR for label:", label, err);
    }
  }

  doc.save("Excel_Seeds_Labels.pdf");
};