import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { generateLabelsPDF } from '../utils/pdfGenerator';
import BatchHistory from '../components/BatchHistory';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: '', variety: '', packedLotNumber: '',
    dateOfTesting: '', packagingDate: '', dateOfExpiry: '',
    mrp: '', totalWeight: '', netQty: '', unitSalePrice: '', 
    packedAt: 'Excel Agri Research Private Limited \nC/o Vittal Seeds Processing Plant,\nSy No. 1608/E and Door No. 4-186/4,\nVillage Peddapapaiah Pally,\nMandal Huzurabad,\nDistrict Karimnagar - 505498,\nTelangana.', 
    plantAddress: 'Excel Agri Research Private Limited \nC/o Vittal Seeds Processing Plant,\nSy No. 1608/E and Door No. 4-186/4,\nVillage Peddapapaiah Pally,\nMandal Huzurabad,\nDistrict Karimnagar - 505498,\nTelangana.', 
    producedBy: 'EXCEL AGRI RESEARCH PVT.LTD',
    quantity: 10
  });

  const [leafletFile, setLeafletFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- AUTO-CALCULATE UNIT PRICE & BAG QUANTITY ---
  useEffect(() => {
    const mrpVal = parseFloat(formData.mrp.replace(/[^0-9.]/g, ''));
    const netQtyVal = parseFloat(formData.netQty.replace(/[^0-9.]/g, ''));
    const totalWeightVal = parseFloat(formData.totalWeight.replace(/[^0-9.]/g, ''));

    let updates = {};

    // 1. Calculate Unit Sale Price
    if (!isNaN(mrpVal) && !isNaN(netQtyVal) && netQtyVal > 0) {
      const calculatedPrice = (mrpVal / netQtyVal).toFixed(2);
      const newUnitPriceString = `Rs ${calculatedPrice} / Kg`;
      
      if (formData.unitSalePrice !== newUnitPriceString) {
        updates.unitSalePrice = newUnitPriceString;
      }
    }

    // 2. Calculate Bags to Generate (Quantity)
    if (!isNaN(totalWeightVal) && !isNaN(netQtyVal) && netQtyVal > 0) {
      // Using Math.ceil ensures no weight is left unpacked
      const calculatedBags = Math.ceil(totalWeightVal / netQtyVal).toString();
      
      if (String(formData.quantity) !== calculatedBags) {
        updates.quantity = calculatedBags;
      }
    }

    // Only update state if calculations triggered a change
    if (Object.keys(updates).length > 0) {
      setFormData(prev => ({ ...prev, ...updates }));
    }
  }, [formData.mrp, formData.netQty, formData.totalWeight]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!leafletFile) return alert("Please upload a PDF leaflet");
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('leaflet', leafletFile);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/generate`, data);
      await generateLabelsPDF(response.data.labelNumbers);
      alert("Batch created successfully!");
      window.location.reload(); 
    } catch (err) { 
      alert("Error generating batch. Check file size (max 4MB)."); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --green-900: #052e1c;
          --green-800: #064e3b;
          --green-700: #065f46;
          --green-600: #047857;
          --green-400: #34d399;
          --gold: #b7892a;
          --gold-light: #f0c96a;
          --cream: #faf8f3;
          --warm-white: #fffdf9;
          --border: #e2d9c8;
          --text-dark: #1a1a1a;
          --text-mid: #4a5568;
          --text-light: #8a9ab0;
          --shadow-sm: 0 2px 8px rgba(6,78,59,0.06);
          --shadow-md: 0 8px 32px rgba(6,78,59,0.10);
          --shadow-lg: 0 20px 60px rgba(6,78,59,0.14);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .dash-root {
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          background: var(--cream);
          min-height: 100vh;
          padding-bottom: 60px;
          -webkit-font-smoothing: antialiased;
        }

        /* ── NAVBAR ── */
        .dash-navbar {
          background: linear-gradient(135deg, var(--green-900) 0%, var(--green-800) 60%, var(--green-700) 100%);
          padding: 0;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 20px rgba(0,0,0,0.25);
        }
        .dash-nav-inner {
          max-width: 1080px;
          margin: 0 auto;
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          padding: 0 28px;
          height: 60px;
        }
        .dash-nav-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #fff;
        }
        .dash-nav-emblem {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }
        .dash-nav-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: #fff;
        }
        .dash-nav-sub {
          font-size: 11px;
          font-weight: 300;
          color: rgba(255,255,255,0.65);
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .dash-logout-btn {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.25);
          color: #fff;
          padding: 8px 18px;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.3px;
          transition: all 0.2s ease;
          align-self: center;
        }
        .dash-logout-btn:hover {
          background: rgba(255,255,255,0.18);
          border-color: rgba(255,255,255,0.5);
        }

        /* ── HERO HEADER ── */
        .dash-hero {
          background: linear-gradient(180deg, rgba(6,79,59,0.04) 0%, transparent 100%);
          border-bottom: 1px solid var(--border);
          padding: 36px 0 28px;
          text-align: center;
        }
        .dash-hero-badge {
          display: inline-block;
          background: linear-gradient(135deg, var(--green-800), var(--green-600));
          color: #fff;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 20px;
          margin-bottom: 14px;
        }
        .dash-hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          font-weight: 700;
          color: var(--green-900);
          letter-spacing: -0.5px;
          line-height: 1.1;
        }
        .dash-hero-title span {
          color: var(--gold);
        }
        .dash-hero-sub {
          margin-top: 8px;
          font-size: 13px;
          color: var(--text-light);
          font-weight: 400;
          letter-spacing: 0.2px;
        }

        /* ── MAIN CONTAINER ── */
        .dash-container {
          max-width: 980px;
          margin: 0 auto;
          padding: 32px 24px 0;
        }

        /* ── FORM CARD ── */
        .dash-form-card {
          background: var(--warm-white);
          border-radius: 16px;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border);
          overflow: hidden;
        }

        /* ── SECTION PANELS ── */
        .dash-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }
        .dash-col {
          padding: 32px 32px 28px;
        }
        .dash-col:first-child {
          border-right: 1px solid var(--border);
        }
        .dash-section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border);
        }
        .dash-section-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          flex-shrink: 0;
        }
        .dash-section-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 600;
          color: var(--green-700);
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        /* ── INPUTS ── */
        .dash-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-light);
          letter-spacing: 0.8px;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .dash-input-wrap {
          margin-bottom: 14px;
        }
        .dash-input {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #ddd5c5;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: var(--text-dark);
          background: #fff;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          outline: none;
        }
        .dash-input:focus {
          border-color: var(--green-600);
          box-shadow: 0 0 0 3px rgba(4,120,87,0.10);
          background: #fff;
        }
        .dash-input::placeholder {
          color: #bbb;
          font-weight: 300;
        }
        .dash-textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #ddd5c5;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 400;
          color: var(--text-dark);
          background: #fff;
          resize: vertical;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          outline: none;
          line-height: 1.6;
        }
        .dash-textarea:focus {
          border-color: var(--green-600);
          box-shadow: 0 0 0 3px rgba(4,120,87,0.10);
        }

        /* ── BOTTOM PANEL ── */
        .dash-final-panel {
          border-top: 1px solid var(--border);
          background: linear-gradient(180deg, #f7f4ee 0%, var(--warm-white) 100%);
          padding: 28px 32px 32px;
        }
        .dash-final-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }
        .dash-file-input-label {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border: 1.5px dashed #bfb49e;
          border-radius: 8px;
          background: #fff;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: var(--text-mid);
        }
        .dash-file-input-label:hover {
          border-color: var(--green-600);
          background: rgba(4,120,87,0.03);
        }
        .dash-file-input {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: var(--text-mid);
          width: 100%;
          cursor: pointer;
        }
        .dash-file-input::-webkit-file-upload-button {
          background: var(--green-700);
          color: white;
          border: none;
          padding: 6px 14px;
          border-radius: 5px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          margin-right: 10px;
          font-weight: 500;
        }

        /* ── SUBMIT BUTTON ── */
        .dash-submit-btn {
          width: 100%;
          padding: 17px;
          background: linear-gradient(135deg, var(--green-800) 0%, var(--green-600) 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.3px;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(6,78,59,0.30);
          position: relative;
          overflow: hidden;
        }
        .dash-submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
          pointer-events: none;
        }
        .dash-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(6,78,59,0.38);
        }
        .dash-submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .dash-submit-btn:disabled {
          opacity: 0.82;
          cursor: not-allowed;
        }
        .dash-spinner-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .dash-spinner {
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top: 2.5px solid #fff;
          border-radius: 50%;
          animation: dashSpin 0.9s linear infinite;
          flex-shrink: 0;
        }
        @keyframes dashSpin {
          to { transform: rotate(360deg); }
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 700px) {
          .dash-grid { grid-template-columns: 1fr; }
          .dash-col:first-child { border-right: none; border-bottom: 1px solid var(--border); }
          .dash-final-grid { grid-template-columns: 1fr; }
          .dash-hero-title { font-size: 26px; }
        }
      `}</style>

      <div className="dash-root">

        {/* NAVBAR */}
        <nav className="dash-navbar">
          <div className="dash-nav-inner">
            <div className="dash-nav-brand">
              <div className="dash-nav-emblem">🌾</div>
              <div>
                <div className="dash-nav-title">EXCEL AGRI RESEARCH PVT. LTD.</div>
                <div className="dash-nav-sub">Batch Management Portal</div>
              </div>
            </div>
            <button onClick={handleLogout} className="dash-logout-btn">Sign Out</button>
          </div>
        </nav>

        {/* HERO */}
        <div className="dash-hero">
          <div className="dash-hero-badge">Admin Dashboard</div>
          <h1 className="dash-hero-title">Generate <span>Batch Labels</span></h1>
          <p className="dash-hero-sub">Fill in product details below to generate QR-secured labels and batch records</p>
        </div>

        {/* FORM */}
        <div className="dash-container">
          <form onSubmit={handleSubmit} className="dash-form-card">

            <div className="dash-grid">

              {/* ── COLUMN 1 ── */}
              <div className="dash-col">
                <div className="dash-section-header">
                  <div className="dash-section-dot"></div>
                  <span className="dash-section-title">Product Identification</span>
                </div>

                <div className="dash-input-wrap">
                  <label className="dash-label">Product Name</label>
                  <input className="dash-input" name="productName" placeholder="e.g. Paddy" onChange={handleChange} required />
                </div>
                <div className="dash-input-wrap">
                  <label className="dash-label">Variety</label>
                  <input className="dash-input" name="variety" placeholder="e.g. S-913" onChange={handleChange} required />
                </div>
                <div className="dash-input-wrap">
                  <label className="dash-label">Packed Lot Number</label>
                  <input className="dash-input" name="packedLotNumber" placeholder="Enter lot number" onChange={handleChange} required />
                </div>
                
                <div className="dash-input-wrap">
                  <label className="dash-label">Packed Lot Quantity</label>
                  <input className="dash-input" name="totalWeight" placeholder="e.g. 1000 Kg" value={formData.totalWeight} onChange={handleChange} />
                </div>
                <div className="dash-section-header" style={{ marginTop: '24px' }}>
                  <div className="dash-section-dot"></div>
                  <span className="dash-section-title">Batch Dates</span>
                </div>

                <div className="dash-input-wrap">
                  <label className="dash-label">Date of Testing</label>
                  <input className="dash-input" type="date" name="dateOfTesting" onChange={handleChange} required />
                </div>
                <div className="dash-input-wrap">
                  <label className="dash-label">Packaging Date</label>
                  <input className="dash-input" type="date" name="packagingDate" onChange={handleChange} required />
                </div>
                <div className="dash-input-wrap">
                  <label className="dash-label">Date of Expiry</label>
                  <input className="dash-input" type="date" name="dateOfExpiry" onChange={handleChange} required />
                </div>
              </div>

              {/* ── COLUMN 2 ── */}
              <div className="dash-col">
                <div className="dash-section-header">
                  <div className="dash-section-dot"></div>
                  <span className="dash-section-title">Commercials</span>
                </div>

                <div className="dash-input-wrap">
                  <label className="dash-label">MRP</label>
                  <input className="dash-input" name="mrp" placeholder="e.g. Rs 1620.00" onChange={handleChange} required />
                </div>
                
                <div className="dash-input-wrap">
                  <label className="dash-label">Net Quantity</label>
                  <input className="dash-input" name="netQty" placeholder="e.g. 12 Kg" onChange={handleChange} required />
                </div>
                <div className="dash-input-wrap">
                  <label className="dash-label">Unit Sale Price</label>
                  <input className="dash-input" name="unitSalePrice" placeholder="Auto-calculated" value={formData.unitSalePrice} onChange={handleChange} required />
                </div>

                <div className="dash-section-header" style={{ marginTop: '24px' }}>
                  <div className="dash-section-dot"></div>
                  <span className="dash-section-title">Facility & Logistics</span>
                </div>

                <div className="dash-input-wrap">
                  <label className="dash-label">Packed At</label>
                  <textarea className="dash-textarea" style={{ height: '120px' }} name="packedAt" value={formData.packedAt} onChange={handleChange} required />
                </div>
                <div className="dash-input-wrap">
                  <label className="dash-label">Plant Address</label>
                  <textarea className="dash-textarea" style={{ height: '75px' }} name="plantAddress" value={formData.plantAddress} onChange={handleChange} required />
                </div>
                <div className="dash-input-wrap">
                  <label className="dash-label">Produced By</label>
                  <input className="dash-input" name="producedBy" value={formData.producedBy} onChange={handleChange} required />
                </div>
              </div>
            </div>

            {/* ── BOTTOM PANEL ── */}
            <div className="dash-final-panel">
              <div className="dash-final-grid">
                <div>
                  <label className="dash-label" style={{ marginBottom: '8px' }}>Bags to Generate</label>
                  <input className="dash-input" type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
                </div>
                <div>
                  <label className="dash-label" style={{ marginBottom: '8px' }}>Leaflet PDF</label>
                  <input
                    className="dash-file-input"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setLeafletFile(e.target.files[0])}
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="dash-submit-btn">
                {loading ? (
                  <span className="dash-spinner-row">
                    <div className="dash-spinner"></div>
                    Processing Batch…
                  </span>
                ) : (
                  '🔒 Generate Labels & Secure Data'
                )}
              </button>
            </div>

          </form>
        </div>

        <BatchHistory />
      </div>
    </>
  );
}