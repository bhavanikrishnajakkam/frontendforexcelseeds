import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function VerifyProduct() {
  const { labelNumber } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  // Helper to change YYYY-MM-DD to DD-MM-YYYY
  const formatDate = (dateStr) => {
    if (!dateStr || !dateStr.includes('-')) return dateStr;
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    axios.get(` ${import.meta.env.VITE_BACKEND_URL}/api/verify/${labelNumber}`)
      .then(res => setData(res.data))
      .catch(() => setError(true));
  }, [labelNumber]);

  if (error) return <div style={styles.error}>Invalid Product Code</div>;
  if (!data) return <div style={styles.loading}>Connecting to  EXCEL AGRI RESEARCH PVT.LTD .....</div>;

  return (
    <div style={styles.outer}>
      <div style={styles.card}>
        <div style={styles.header}>

           <h2 style={styles.brandName}> EXCEL AGRI RESEARCH PVT.LTD.</h2>
           <div style={styles.badge}>
             <span style={styles.check}>✔</span> GENUINE PRODUCT
           </div>
        </div>

        <div style={styles.table}>
          <DetailRow label="Label Number" value={data.labelNumber} />
          <DetailRow label="Crop Name" value={data.cropName} />
          <DetailRow label="Packed Variety" value={data.packedVariety} />
          <DetailRow label="Packed Lot Number" value={data.packedLotNumber} />
          <DetailRow label="Date of Testing" value={formatDate(data.dateOfTesting)} />
          <DetailRow label="Date of Packaging" value={formatDate(data.dateOfPackaging)} />
          <DetailRow label="Date of Expiry" value={formatDate(data.dateOfExpiry)} />
          <DetailRow label="MRP" value={data.mrp} />
          <DetailRow label="Unit Sale Price" value={data.unitSalePrice} />
          <DetailRow label="Net Quantity" value={data.netQty} />
          <DetailRow label="Packed At" value={data.packedAt} />
          <DetailRow label="Plant Address" value={data.plantAddress} />
          <DetailRow label="Produced By" value={data.producedBy} />
        </div>

        <div style={styles.pdfArea}>
           <a href={data.leafletUrl} target="_blank" rel="noreferrer" style={styles.pdfBtn}>
             View Product Leaflet (PDF)
           </a>
        </div>
      </div>
      <p style={{textAlign: 'center', fontSize: '11px', color: '#94a3b8', marginTop: '15px'}}>© 2026 Ganga Kaveri Seeds Pvt. Ltd.</p>
    </div>
  );
}

const DetailRow = ({ label, value }) => (
  <div style={styles.row}>
    <div style={styles.labelCol}>{label}</div>
    <div style={styles.valueCol}>{value}</div>
  </div>
);

const styles = {
  outer: { backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '20px 10px', fontFamily: 'Inter, system-ui, sans-serif' },
  card: { maxWidth: '480px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', overflow: 'hidden' },
  header: { textAlign: 'center', padding: '30px', borderBottom: '1px solid #f1f5f9' },
  logo: { width: '60px', marginBottom: '10px' },
  brandName: { color: '#064e3b', margin: 0, fontSize: '20px', fontWeight: '800' },
  badge: { display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '12px', fontWeight: '700', marginTop: '10px', padding: '4px 12px', backgroundColor: '#ecfdf5', borderRadius: '20px' },
  check: { backgroundColor: '#059669', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px' },
  table: { display: 'flex', flexDirection: 'column' },
  row: { display: 'flex', borderBottom: '1px solid #f8fafc' },
  labelCol: { flex: 1, padding: '12px 15px', backgroundColor: '#f8fafc', fontWeight: '600', color: '#64748b', fontSize: '13px' },
  valueCol: { flex: 1.5, padding: '12px 15px', color: '#0f172a', fontSize: '14px', fontWeight: '700' },
  pdfArea: { padding: '20px' },
  pdfBtn: { display: 'block', textAlign: 'center', padding: '12px', backgroundColor: '#064e3b', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '14px' },
  loading: { textAlign: 'center', marginTop: '100px', color: '#065f46', fontWeight: '600' }
};