import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const BatchHistory = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/stats`);
        setStats(data);
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const downloadExcel = () => {
    const rows = [];
    // Flatten the data for the Excel sheet
    stats.forEach(day => {
      day.products.forEach(p => {
        rows.push({
          "Date": day._id || "No Date",
          "Crop Name": p.name || "Unknown",
          "Variety": p.variety || "Unknown",
          "Total Bags (Quantity)": p.qty || 0
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Production_Logs");
    
    // Triggers the download
    XLSX.writeFile(workbook, `Excel_Agri_Production_${new Date().toLocaleDateString()}.xlsx`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h2 style={{ color: '#064e3b', margin: 0 }}>📊 Daily Production Monitor</h2>
        <button onClick={downloadExcel} style={styles.downloadBtn}>
          📥 Download Excel Sheet
        </button>
      </div>
      <hr style={{ border: '0.5px solid #e2e8f0', marginBottom: '20px' }} />

      {loading ? (
        <p style={styles.emptyText}>Loading production data...</p>
      ) : stats.length === 0 ? (
        <p style={styles.emptyText}>No production batches found.</p>
      ) : (
        stats.map((day, index) => (
          <div key={index} style={styles.dayCard}>
            <h3 style={styles.dateHeader}>📅 Date: {day._id || "No Date"}</h3>
            
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHead}>
                  <th style={styles.th}>Crop Name</th>
                  <th style={styles.th}>Variety</th>
                  <th style={styles.th}>Quantity (Bags)</th>
                </tr>
              </thead>
              <tbody>
                {day.products.map((p, i) => (
                  <tr key={i} style={styles.tableRow}>
                    <td style={styles.td}><strong>{p.name || "Unknown"}</strong></td>
                    <td style={styles.td}>{p.variety || "Unknown"}</td>
                    <td style={styles.td}><strong>{p.qty || 0}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: { marginTop: '40px', padding: '25px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  downloadBtn: { backgroundColor: '#059669', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
  emptyText: { textAlign: 'center', color: '#64748b', padding: '20px' },
  dayCard: { marginBottom: '25px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' },
  dateHeader: { margin: '0 0 15px 0', color: '#0f172a', fontSize: '16px' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  tableHead: { backgroundColor: '#e2e8f0', color: '#334155' },
  th: { padding: '10px', fontSize: '14px', borderBottom: '2px solid #cbd5e1' },
  tableRow: { borderBottom: '1px solid #e2e8f0' },
  td: { padding: '10px', fontSize: '14px', color: '#0f172a' }
};

export default BatchHistory;