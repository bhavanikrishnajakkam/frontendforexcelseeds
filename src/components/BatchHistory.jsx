import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

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
    const rows = [];
    stats.forEach(day => {
      day.products.forEach(p => {
        rows.push({
          "Date": day._id || "N/A",
          "Product Name": p.name || "N/A",
          "Variety": p.variety || "N/A",
          "Quantity": p.qty || 0
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Production_Logs");
    XLSX.writeFile(workbook, `ExcelSeeds_Report_${new Date().toLocaleDateString()}.xlsx`);
  };

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2 style={{ color: '#2d3436', margin: 0 }}>📊 Production Overview</h2>
        <button onClick={downloadExcel} style={styles.downloadBtn}>
          📥 Download Excel
        </button>
      </div>
      <hr style={{ border: '0.5px solid #eee' }} />

      {stats.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No production data found.</p>
      ) : (
        stats.map((day) => (
          <div key={day._id || 'unknown'} style={styles.dayGroup}>
            <div style={styles.dayHeader}>
              <span>📅 Date: {day._id || "No Date"}</span>
              <span>Total Bags: {day.totalQuantity || 0}</span>
            </div>
            <ul style={styles.productList}>
              {day.products.map((p, i) => (
                <li key={i} style={{ marginBottom: '5px' }}>
                  <strong>{p.name || "Unknown"}</strong> 
                  {p.variety ? ` (${p.variety})` : ""} — {p.qty || 0} Bags
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: { marginTop: '40px', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' },
  downloadBtn: { backgroundColor: '#006b3d', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
  dayGroup: { marginTop: '15px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' },
  dayHeader: { display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#006b3d', fontSize: '16px' },
  productList: { fontSize: '15px', color: '#2d3436', marginTop: '10px', listStyleType: 'circle', paddingLeft: '20px' }
};

export default BatchHistory;