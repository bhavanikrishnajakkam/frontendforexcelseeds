import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Import the library

const BatchHistory = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/stats`);
        setStats(data);
      } catch (err) {
        console.error("Failed to load stats");
      }
    };
    fetchStats();
  }, []);

  const downloadExcel = () => {
    // 1. Flatten the data for Excel (Date | Product | Variety | Quantity)
    const rows = [];
    stats.forEach(day => {
      day.products.forEach(p => {
        rows.push({
          Date: day._id,
          Product: p.name,
          Variety: p.variety,
          Quantity: p.qty
        });
      });
    });

    // 2. Create the worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Production_Logs");

    // 3. Trigger download
    XLSX.writeFile(workbook, `Ganga_Kaveri_Production_${new Date().toLocaleDateString()}.xlsx`);
  };

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#2d3436' }}>📊 Production Overview</h2>
        <button onClick={downloadExcel} style={styles.downloadBtn}>
          📥 Download Excel
        </button>
      </div>
      <hr />
      
      {stats.length === 0 ? <p>No batches found yet.</p> : stats.map((day) => (
        <div key={day._id} style={styles.dayGroup}>
          <div style={styles.dayHeader}>
            <span>📅 Date: {day._id}</span>
            <span>Total Bags: {day.totalQuantity}</span>
          </div>
          <ul style={styles.productList}>
            {day.products.map((p, i) => (
              <li key={i}>{p.name} ({p.variety}) — {p.qty} Bags</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: { marginTop: '40px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  downloadBtn: { backgroundColor: '#006b3d', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  dayGroup: { marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' },
  dayHeader: { display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#006b3d' },
  productList: { fontSize: '14px', color: '#636e72', marginTop: '5px' }
};

export default BatchHistory;