import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export const generateLabelsPDF = async (labelNumbers) => {
  const doc = new jsPDF({
    orientation: "landscape", 
    unit: "mm",
    format: [100, 25] 
  });

  const labelSize = 25;      
  const qrsPerPage = 4;      
  
  // --- ADJUSTED FOR SAFE MARGINS ---
  const qrSize = 17; // Reduced from 19 to give more vertical breathing room
  const qrOffset = (labelSize - qrSize) / 2; // Perfectly centers the QR (4mm padding on sides)

  for (let i = 0; i < labelNumbers.length; i++) {
    const label = labelNumbers[i];
    const verifyUrl = `${import.meta.env.VITE_FRONTEND_URL}/verify/${label}`;

    if (i > 0 && i % qrsPerPage === 0) {
      doc.addPage([100, 25], "landscape");
    }

    const col = i % qrsPerPage;
    const currentX = col * labelSize;
    const currentY = 0;

    try {
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, { 
        width: 400,  
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' }
      });

      // 1. Draw QR: Start 1.5mm from the top edge
      doc.addImage(qrDataUrl, "PNG", currentX + qrOffset, currentY + 1.5, qrSize, qrSize);
      
      // 2. Draw Text: Slightly smaller font, moved up closer to the QR code
      doc.setFontSize(6.5);
      
      // The text baseline is now at 22.5mm (Leaving a safe 2.5mm unprinted gap at the bottom)
      doc.text(label, currentX + (labelSize / 2), currentY + 22.5, { align: "center" });

    } catch (err) {
      console.error("Error generating QR:", label, err);
    }
  }

  doc.save("Thermal_100x25_Labels.pdf");
};