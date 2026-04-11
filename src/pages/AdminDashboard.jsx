import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { generateLabelsPDF } from '../utils/pdfGenerator';
import BatchHistory from '../components/BatchHistory';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: '', variety: '', packedLotNumber: '',
    dateOfTesting: '', packagingDate: '', dateOfExpiry: '',
    mrp: '', unitSalePrice: '', netQty: '',
    packedAt: 'Nandeeshwara Seeds - Huzurabad.', 
    plantAddress: 'Excel Agri Research Pvt. Ltd.\nC/o. Nandeeshwara Seeds,\nH.No: 4-191, Peddapapaipally,\nHUZURABAD.', 
    producedBy: 'EXCEL AGRI RESEARCH PVT.LTD',
    quantity: 10
  });

  const [leafletFile, setLeafletFile] = useState(null);
  const [loading, setLoading] = useState(false);

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
    <div style={styles.pageWrapper}>
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <div style={styles.navBrand}> EXCEL AGRI RESEARCH PVT.LTD. | <span style={{ fontWeight: 400 }}>Management</span></div>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.brandTitle}> EXCEL AGRI RESEARCH PVT.LTD. </h1>
        </div>

        <form onSubmit={handleSubmit} style={styles.formCard}>
          <div style={styles.grid}>
            {/* Column 1 */}
            <div style={styles.column}>
              <h3 style={styles.sectionTitle}>Product Identification</h3>
              <input style={styles.input} name="productName" placeholder="Product Name (e.g. Paddy)" onChange={handleChange} required />
              <input style={styles.input} name="variety" placeholder="Variety (e.g. S-913)" onChange={handleChange} required />
              <input style={styles.input} name="packedLotNumber" placeholder="Lot Number" onChange={handleChange} required />

              <h3 style={styles.sectionTitle}>Batch Dates (DD-MM-YYYY)</h3>
              <label style={styles.label}>Testing Date</label>
              <input style={styles.input} type="date" name="dateOfTesting" onChange={handleChange} required />
              <label style={styles.label}>Packaging Date</label>
              <input style={styles.input} type="date" name="packagingDate" onChange={handleChange} required />
              <label style={styles.label}>Expiry Date</label>
              <input style={styles.input} type="date" name="dateOfExpiry" onChange={handleChange} required />
            </div>

            {/* Column 2 */}
            <div style={styles.column}>
              <h3 style={styles.sectionTitle}>Commercials</h3>
              <input style={styles.input} name="mrp" placeholder="MRP (e.g., Rs 1620.00)" onChange={handleChange} required />
              <input style={styles.input} name="unitSalePrice" placeholder="Unit Sale Price" onChange={handleChange} required />
              <input style={styles.input} name="netQty" placeholder="Net Quantity" onChange={handleChange} required />

              <h3 style={styles.sectionTitle}>Facility & Logistics</h3>
              <input style={styles.input} name="packedAt" value={formData.packedAt} onChange={handleChange} required />
              <textarea style={{ ...styles.input, height: '80px' }} name="plantAddress" value={formData.plantAddress} onChange={handleChange} required />
              <input style={styles.input} name="producedBy" value={formData.producedBy} onChange={handleChange} required />
            </div>
          </div>

          <div style={styles.finalSection}>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Bags to Generate</label>
                <input style={styles.input} type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Leaflet PDF</label>
                <input style={styles.fileInput} type="file" accept="application/pdf" onChange={(e) => setLeafletFile(e.target.files[0])} required />
              </div>
            </div>
            
            {/* UPDATED BUTTON WITH LOADING SPINNER */}
            <button type="submit" disabled={loading} style={{ ...styles.button, opacity: loading ? 0.8 : 1 }}>
              {loading ? (
                <span style={styles.spinnerContainer}>
                  <style>
                    {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
                  </style>
                  <div style={styles.spinner}></div>
                  Processing Batch...
                </span>
              ) : (
                " Generate Labels & Secure Data"
              )}
            </button>

          </div>
        </form>
      </div>
      <BatchHistory />
    </div>
  );
}

const styles = {
  pageWrapper: { 
  backgroundColor: '#f8fafc', 
  minHeight: '100vh', 
  paddingBottom: '40px',
  // 1. The standard major-website font stack
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
  // 2. Makes the default text slightly thicker and bolder
  fontWeight: '500', 
  // 3. Improves text crispness on modern monitors
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale'
},
  navbar: { backgroundColor: '#065f46', color: '#fff', padding: '12px 0' },
  navContent: { maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', padding: '0 20px', alignItems: 'center' },
  navBrand: { fontWeight: '700', fontSize: '18px' },
  logoutBtn: { background: 'none', border: '1px solid #fff', color: '#fff', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' },
  container: { maxWidth: '900px', margin: '0 auto', padding: '20px' },
  header: { textAlign: 'center', marginBottom: '30px' },
  brandTitle: { color: '#064e3b', fontSize: '28px', fontWeight: '800' },
  formCard: { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
  sectionTitle: { fontSize: '13px', color: '#065f46', fontWeight: '700', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '15px', textTransform: 'uppercase' },
  input: { width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  label: { fontSize: '11px', fontWeight: '700', color: '#64748b', marginBottom: '4px', display: 'block' },
  button: { width: '100%', padding: '16px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '700', transition: 'opacity 0.3s' },
  finalSection: { marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' },
  fileInput: { fontSize: '13px' },
  
  // NEW SPINNER STYLES
  spinnerContainer: { 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: '10px' 
  },
  spinner: { 
    width: '20px', 
    height: '20px', 
    border: '3px solid rgba(255,255,255,0.3)', 
    borderTop: '3px solid #fff', 
    borderRadius: '50%', 
    animation: 'spin 1s linear infinite' 
  }
};