import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export const generateLabelsPDF = async (labelNumbers) => {
  const doc = new jsPDF({
    orientation: "landscape", 
    unit: "mm",
    format: [100, 25] 
  });

  const qrsPerPage = 4;      
  
  const startX = 2;          
  const stickerWidth = 22.5; 
  const gapX = 1.5;          
  
  const qrSize = 14; 
  const qrOffset = (stickerWidth - qrSize) / 2; 

  for (let i = 0; i < labelNumbers.length; i++) {
    const label = labelNumbers[i];
    const verifyUrl = `${import.meta.env.VITE_FRONTEND_URL}/verify/${label}`;

    if (i > 0 && i % qrsPerPage === 0) {
      doc.addPage([100, 25], "landscape");
    }

    const col = i % qrsPerPage;
    const currentX = startX + (col * (stickerWidth + gapX));
    const currentY = 0;

    try {
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, { 
        width: 120,  
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' }
      });

      doc.addImage(qrDataUrl, "PNG", currentX + qrOffset, currentY + 3.0, qrSize, qrSize);
      doc.setFontSize(5.5);
      doc.text(label, currentX + (stickerWidth / 2), currentY + 22.0, { align: "center" });

      if (i % 50 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1));
      }

    } catch (err) {
      console.error("Error generating QR:", label, err);
    }
  }

  // --- THE FIX: MANUAL BLOB DOWNLOAD ---
  // Instead of doc.save(), we force the browser to handle the massive file directly.
  try {
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);
    
    // Create an invisible anchor tag
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = "Thermal_100x25_Labels.pdf";
    
    // Append to body, click it, and instantly remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the browser memory immediately after download starts
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Failed to force download:", error);
    alert("The PDF was generated, but your browser blocked the massive download. Try generating 1,000 labels at a time.");
  }
};