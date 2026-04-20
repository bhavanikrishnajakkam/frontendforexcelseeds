import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export const generateLabelsPDF = async (labelNumbers) => {
  const doc = new jsPDF({
    orientation: "landscape", 
    unit: "mm",
    format: [100, 25] 
  });

  const qrsPerPage = 4;      
  
  const startX = 2;          // Left margin before the first sticker starts (mm)
  const stickerWidth = 22.5; // Width of the actual peel-off sticker (mm)
  const gapX = 1.5;          // Physical gap between the stickers (mm)
  
  // 1. REDUCED QR SIZE
  const qrSize = 14; // Down from 16
  const qrOffset = (stickerWidth - qrSize) / 2; // Centers the QR horizontally

  for (let i = 0; i < labelNumbers.length; i++) {
    const label = labelNumbers[i];
    const verifyUrl = `${import.meta.env.VITE_FRONTEND_URL}/verify/${label}`;

    if (i > 0 && i % qrsPerPage === 0) {
      doc.addPage([100, 25], "landscape");
    }

    const col = i % qrsPerPage;
    
    // Calculates X position skipping over the physical gaps
    const currentX = startX + (col * (stickerWidth + gapX));
    const currentY = 0;

    try {
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, { 
        width: 400,  
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' }
      });

      // 2. LOWERED QR CODE (Changed Y offset from 1.5 to 3.0)
      doc.addImage(qrDataUrl, "PNG", currentX + qrOffset, currentY + 3.0, qrSize, qrSize);
      
      // 3. REDUCED TEXT SIZE (Down from 6.5)
      doc.setFontSize(5.5);
      
      // Kept text near the bottom border, beautifully aligned
      doc.text(label, currentX + (stickerWidth / 2), currentY + 22.0, { align: "center" });

    } catch (err) {
      console.error("Error generating QR:", label, err);
    }
  }

  doc.save("Thermal_100x25_Labels.pdf");
};