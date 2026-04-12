import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export const generateLabelsPDF = async (labelNumbers) => {
  const doc = new jsPDF({
    orientation: "landscape", 
    unit: "mm",
    format: [100, 25] 
  });

  const qrsPerPage = 4;      
  
  // --- NEW: ADJUSTED FOR PHYSICAL GAPS ON THE ROLL ---
  // If the print is slightly unaligned, tweak these numbers by 0.5 or 1mm!
  const startX = 2;           // Left margin before the first sticker starts (mm)
  const stickerWidth = 22.5;  // Width of the actual peel-off sticker (mm)
  const gapX = 1.5;           // Physical gap between the stickers (mm)
  
  const qrSize = 16; // Reduced slightly to fit the narrower 22.5mm sticker
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

      // 1. Draw QR: Start 1.5mm from the top edge
      doc.addImage(qrDataUrl, "PNG", currentX + qrOffset, currentY + 1.5, qrSize, qrSize);
      
      // 2. Draw Text
      doc.setFontSize(6.5);
      
      // Center text under the specific sticker width
      doc.text(label, currentX + (stickerWidth / 2), currentY + 22.5, { align: "center" });

    } catch (err) {
      console.error("Error generating QR:", label, err);
    }
  }

  doc.save("Thermal_100x25_Labels.pdf");
};