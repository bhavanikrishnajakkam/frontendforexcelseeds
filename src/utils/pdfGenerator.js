import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export const generateLabelsPDF = async (labelNumbers, qrsPerPage = 20) => {
  const doc = new jsPDF();
  let currentX = 10;
  let currentY = 10;

  for (let i = 0; i < labelNumbers.length; i++) {
    const label = labelNumbers[i];
    
    // Change this back to your actual Laptop IP so the final test works!
    // Example: http://192.168.1.15:5173/verify/${label}
    const verifyUrl = `${import.meta.env.VITE_FRONTEND_URL}/verify/${label}` 

    try {
      // THE FIX: Increased width to 300 for a crisp, high-resolution image
      // Added a margin of 1 so the camera can easily see the edges
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, { 
        width: 300, 
        margin: 1,
        color: {
          dark: '#000000',  // Black dots
          light: '#ffffff'  // White background
        }
      });

      // jsPDF scales the crisp 300px image perfectly into the 30x30 layout
      doc.addImage(qrDataUrl, "PNG", currentX, currentY, 30, 30);
      
      // Add Label Text below QR
      doc.setFontSize(10);
      doc.text(label, currentX + 8, currentY + 35);

      // Grid Logic: 4 columns per row
      currentX += 45; 
      if ((i + 1) % 4 === 0) {
        currentX = 10; // Reset X to left margin
        currentY += 45; // Move Y down one row
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

  // Trigger browser download
  doc.save("seed-bag-labels.pdf");
};