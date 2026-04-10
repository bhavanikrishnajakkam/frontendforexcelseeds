import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BatchHistory = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/stats`);
      setStats(data);
    };
    fetchStats();
  }, []);

  return (
    <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ color: '#2d3436' }}>📊 Production Overview</h2>
      <hr />
      {stats.map((day) => (
        <div key={day._id} style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <span style={{ color: '#006b3d' }}>📅 Date: {day._id}</span>
            <span>Total Bags: {day.totalQuantity}</span>
          </div>
          <ul style={{ fontSize: '14px', color: '#636e72' }}>
            {day.products.map((p, i) => (
              <li key={i}>{p.name} ({p.variety}) — {p.qty} Bags</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default BatchHistory;