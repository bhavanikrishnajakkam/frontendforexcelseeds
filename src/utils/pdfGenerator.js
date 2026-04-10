import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export const generateLabelsPDF = async (labelNumbers, qrsPerPage = 20) => {
  const doc = new jsPDF();
  let currentX = 10;
  let currentY = 10;

  for (let i = 0; i < labelNumbers.length; i++) {
    const label = labelNumbers[i];
    
    const verifyUrl = `${import.meta.env.VITE_FRONTEND_URL}/verify/${label}`;

    try {
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, { 
        width: 300, 
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });

      doc.addImage(qrDataUrl, "PNG", currentX, currentY, 30, 30);
      
      // --- THE CENTERING FIX ---
      doc.setFontSize(10);
      // 1. Move X to the exact middle of the QR code (currentX + 15)
      // 2. Tell jsPDF to align the text by its center
      doc.text(label, currentX + 15, currentY + 35, { align: "center" });

      // Grid Logic: 4 columns per row
      currentX += 45; 
      if ((i + 1) % 4 === 0) {
        currentX = 10;
        currentY += 45;
      }

      // Add a new page if we hit the limit
      if ((i + 1) % qrsPerPage === 0 && i !== labelNumbers.length - 1) {
        doc.addPage();
        currentX = 10;
        currentY = 10;
      }
    } catch (err) {
      console.error("Error generating QR for label:", label, err);
    }
  }

  doc.save("seed-bag-labels.pdf");
};