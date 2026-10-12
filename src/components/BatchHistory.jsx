import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const BatchHistory = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editProduct, setEditProduct] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // ── Toast Notification State ──
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3500);
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/stats`);
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats:", err);
      showToast("Failed to load history data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const promptDelete = (productId) => {
    setDeleteConfirmId(productId);
  };

  const executeDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/product/${deleteConfirmId}`);
      showToast("Batch deleted successfully", "success");
      setDeleteConfirmId(null);
      fetchStats(); 
    } catch (error) {
      showToast("Failed to delete batch", "error");
      setDeleteConfirmId(null);
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/product/${editProduct.id}`, {
        cropName: editProduct.name,
        packedVariety: editProduct.variety,
        mrp: editProduct.mrp,
        unitSalePrice: editProduct.usp,
        netQty: editProduct.netQty
      });
      showToast("Product updated successfully!", "success");
      setEditProduct(null);
      fetchStats();
    } catch (error) {
      showToast("Failed to update product", "error");
    }
  };

  const downloadExcel = () => {
    const rows = [];
    stats.forEach(day => {
      day.products.forEach(p => {
        rows.push({
          "Date": p.date || day._id || "Unknown",
          "Lot Number": p.packedLotNumber || p.lotNumber || "N/A",
          "Crop Name": p.name || "Unknown",
          "Variety": p.variety || "Unknown",
          "Label Range": p.labelRange || "Random",
          "Bags Produced": p.qty || 0,
          "MRP": p.mrp || "N/A",
          "Unit Sale Price": p.usp || "N/A",
          "Net Quantity": p.netQty || "N/A"
        });
      });
    });
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Production_Logs");
    XLSX.writeFile(workbook, `Excel_Agri_Production_${new Date().toLocaleDateString()}.xlsx`);
    showToast("Excel downloaded successfully!", "success");
  };

  return (
    <>
      <style>{`
        /* ── TOAST NOTIFICATION CSS ── */
        .bh-toast {
          position: fixed; bottom: 30px; left: 30px;
          background: #052e1c; color: white; padding: 16px 20px; border-radius: 8px;
          box-shadow: 0 10px 40px rgba(6,78,59,0.4); z-index: 10000; display: flex; flex-direction: column; gap: 12px;
          transform: translateX(-150%); transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
          overflow: hidden; min-width: 320px; font-family: 'DM Sans', sans-serif;
        }
        .bh-toast.show { transform: translateX(0); }
        .bh-toast-message { font-weight: 500; font-size: 14px; display: flex; align-items: center; gap: 12px; }
        .bh-toast-bar-wrap { height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; width: 100%; overflow: hidden; }
        .bh-toast-bar { height: 100%; background: #e8b931; width: 100%; transform-origin: left; }
        .bh-toast.error .bh-toast-bar { background: #f87171; }
        .bh-toast.error .bh-toast-icon { color: #f87171; }
        .bh-toast.success .bh-toast-icon { color: #e8b931; }
        @keyframes bhShrinkToastBar { from { width: 100%; } to { width: 0%; } }
        .bh-toast.show .bh-toast-bar { animation: bhShrinkToastBar 3.5s linear forwards; }

        /* ── EXISTING CSS ── */
        .bh-root {
          margin-top: 32px;
          max-width: 1050px; /* Widened slightly to fit new columns */
          margin-left: auto;
          margin-right: auto;
          padding: 0 24px 60px;
        }

        /* ── SECTION CARD ── */
        .bh-card {
          background: #fffdf9;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(6,78,59,0.14);
          border: 1px solid #e2d9c8;
          overflow: hidden;
        }

        /* ── HEADER ── */
        .bh-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 32px 20px;
          border-bottom: 1px solid #e2d9c8;
          background: linear-gradient(180deg, #f7f4ee 0%, #fffdf9 100%);
        }
        .bh-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .bh-header-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #b7892a, #f0c96a);
          flex-shrink: 0;
        }
        .bh-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 700;
          color: #052e1c;
          margin: 0;
          letter-spacing: -0.3px;
        }
        .bh-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: #8a9ab0;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          font-weight: 500;
          margin-top: 2px;
        }
        .bh-download-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #064e3b 0%, #047857 100%);
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.2px;
          box-shadow: 0 4px 14px rgba(6,78,59,0.28);
          transition: transform 0.15s, box-shadow 0.2s;
        }
        .bh-download-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(6,78,59,0.36);
        }

        /* ── BODY ── */
        .bh-body {
          padding: 24px 32px;
        }
        .bh-empty {
          text-align: center;
          color: #8a9ab0;
          padding: 48px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
        }
        .bh-loading-dot {
          display: inline-block;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #047857;
          margin: 0 3px;
          animation: bhPulse 1.2s ease-in-out infinite;
        }
        .bh-loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .bh-loading-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bhPulse {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }

        /* ── DAY GROUP ── */
        .bh-day-group {
          margin-bottom: 24px;
        }
        .bh-day-group:last-child {
          margin-bottom: 0;
        }
        .bh-day-label {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .bh-day-label-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #065f46;
        }
        .bh-day-label-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, #e2d9c8 0%, transparent 100%);
        }
        .bh-day-badge {
          background: linear-gradient(135deg, #064e3b, #047857);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 12px;
          letter-spacing: 0.3px;
        }

        /* ── TABLE ── */
        .bh-table-wrap {
          overflow-x: auto;
          border-radius: 10px;
          border: 1px solid #e2d9c8;
        }
        .bh-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          min-width: 950px;
          font-family: 'DM Sans', sans-serif;
        }
        .bh-thead tr {
          background: linear-gradient(135deg, #f0ede6 0%, #eae6dc 100%);
        }
        .bh-th {
          padding: 11px 14px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: #065f46;
          border-bottom: 2px solid #d8d0bc;
          white-space: nowrap;
        }
        .bh-tr {
          border-bottom: 1px solid #eee8dc;
          transition: background 0.15s;
        }
        .bh-tr:last-child {
          border-bottom: none;
        }
        .bh-tr:hover {
          background: #faf7f0;
        }
        .bh-td {
          padding: 11px 14px;
          font-size: 13px;
          color: #1a1a1a;
          vertical-align: middle;
        }
        .bh-td-bold {
          font-weight: 600;
          color: #052e1c;
        }
        .bh-td-muted {
          color: #8a9ab0;
          font-size: 12px;
        }
        .bh-actions-cell {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .bh-edit-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: linear-gradient(135deg, #ca9a0a, #e8b931);
          color: #fff;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          transition: opacity 0.15s, transform 0.15s;
          white-space: nowrap;
        }
        .bh-edit-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .bh-delete-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: linear-gradient(135deg, #dc2626, #f87171);
          color: #fff;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          transition: opacity 0.15s, transform 0.15s;
          white-space: nowrap;
        }
        .bh-delete-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        /* ── MODAL ── */
        .bh-overlay {
          position: fixed;
          inset: 0;
          background: rgba(5, 20, 14, 0.55);
          backdrop-filter: blur(3px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: bhFadeIn 0.18s ease;
        }
        @keyframes bhFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .bh-modal {
          background: #fffdf9;
          border-radius: 16px;
          width: 440px;
          max-width: 92vw;
          box-shadow: 0 24px 64px rgba(0,0,0,0.22);
          border: 1px solid #e2d9c8;
          overflow: hidden;
          animation: bhSlideUp 0.2s ease;
        }
        @keyframes bhSlideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .bh-modal-header {
          padding: 20px 24px 18px;
          background: linear-gradient(135deg, #064e3b, #047857);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .bh-modal-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }
        .bh-modal-body {
          padding: 24px;
        }
        .bh-modal-label {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 700;
          color: #8a9ab0;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .bh-modal-input {
          width: 100%;
          padding: 10px 14px;
          margin-bottom: 14px;
          border: 1.5px solid #ddd5c5;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #1a1a1a;
          background: #fff;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .bh-modal-input:focus {
          border-color: #047857;
          box-shadow: 0 0 0 3px rgba(4,120,87,0.10);
        }
        .bh-modal-footer {
          display: flex;
          gap: 10px;
          padding: 0 24px 24px;
        }
        .bh-save-btn {
          flex: 1;
          padding: 12px;
          background: linear-gradient(135deg, #064e3b, #047857);
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          box-shadow: 0 4px 14px rgba(6,78,59,0.25);
          transition: transform 0.15s, box-shadow 0.2s;
        }
        .bh-save-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(6,78,59,0.33);
        }
        .bh-cancel-btn {
          flex: 1;
          padding: 12px;
          background: #f1ece3;
          color: #4a5568;
          border: 1.5px solid #e2d9c8;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          transition: background 0.15s;
        }
        .bh-cancel-btn:hover {
          background: #e8e1d5;
        }
      `}</style>

      {/* ── TOAST NOTIFICATION ── */}
      <div className={`bh-toast ${toast.type} ${toast.visible ? 'show' : ''}`}>
        <div className="bh-toast-message">
          {toast.type === 'success' ? '✅ ' : '❌ '}
          {toast.message}
        </div>
        <div className="bh-toast-bar-wrap">
          <div className="bh-toast-bar"></div>
        </div>
      </div>

      <div className="bh-root">
        <div className="bh-card">

          {/* HEADER */}
          <div className="bh-header">
            <div className="bh-header-left">
              <div className="bh-header-dot"></div>
              <div>
                <h2 className="bh-title">Daily Production Monitor</h2>
                <div className="bh-subtitle">Batch History & Records</div>
              </div>
            </div>
            <button onClick={downloadExcel} className="bh-download-btn">
              📥 Export Excel
            </button>
          </div>

          {/* BODY */}
          <div className="bh-body">
            {loading ? (
              <div className="bh-empty">
                <span className="bh-loading-dot"></span>
                <span className="bh-loading-dot"></span>
                <span className="bh-loading-dot"></span>
                <div style={{ marginTop: '12px' }}>Loading production data…</div>
              </div>
            ) : stats.length === 0 ? (
              <div className="bh-empty">No production batches found.</div>
            ) : (
              stats.map((day, index) => (
                <div key={index} className="bh-day-group">
                  <div className="bh-day-label">
                    <span className="bh-day-label-text">Batch Group</span>
                    <span className="bh-day-badge">{day._id || "Unknown Date"}</span>
                    <div className="bh-day-label-line"></div>
                  </div>

                  <div className="bh-table-wrap">
                    <table className="bh-table">
                      <thead className="bh-thead">
                        <tr>
                          <th className="bh-th">Date</th>
                          <th className="bh-th">Lot No</th>
                          <th className="bh-th">Crop Name</th>
                          <th className="bh-th">Variety</th>
                          <th className="bh-th">Label Range</th>
                          <th className="bh-th">Bags</th>
                          <th className="bh-th">MRP</th>
                          <th className="bh-th">USP</th>
                          <th className="bh-th">Net Qty</th>
                          <th className="bh-th">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {day.products.map((p, i) => (
                          <tr key={i} className="bh-tr">
                            <td className="bh-td bh-td-muted">{p.date || day._id}</td>
                            <td className="bh-td bh-td-muted">{p.packedLotNumber || p.lotNumber || "N/A"}</td>
                            <td className="bh-td bh-td-bold">{p.name || "Unknown"}</td>
                            <td className="bh-td">{p.variety || "Unknown"}</td>
                            <td className="bh-td bh-td-muted" style={{ color: '#047857' }}>
                              {p.labelRange || "Random"}
                            </td>
                            <td className="bh-td bh-td-bold">{p.qty || 0}</td>
                            <td className="bh-td">{p.mrp || "N/A"}</td>
                            <td className="bh-td">{p.usp || "N/A"}</td>
                            <td className="bh-td">{p.netQty || "N/A"}</td>
                            <td className="bh-td">
                              <div className="bh-actions-cell">
                                <button onClick={() => setEditProduct(p)} className="bh-edit-btn"> Edit</button>
                                <button onClick={() => promptDelete(p.id)} className="bh-delete-btn"> Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* CUSTOM DELETE CONFIRM MODAL */}
      {deleteConfirmId && (
        <div className="bh-overlay">
          <div className="bh-modal" style={{ maxWidth: '400px' }}>
            <div className="bh-modal-header" style={{ background: 'linear-gradient(135deg, #7f1d1d, #b91c1c)' }}>
              <span style={{ fontSize: '18px' }}>⚠️</span>
              <h3 className="bh-modal-title">Delete Batch?</h3>
            </div>
            <div className="bh-modal-body">
              <p style={{ fontFamily: 'DM Sans', fontSize: '14px', color: '#1a1a1a', marginBottom: '8px' }}>
                Are you sure you want to delete this batch?
              </p>
              <p style={{ fontFamily: 'DM Sans', fontSize: '12px', color: '#dc2626', fontWeight: '600', margin: 0 }}>
                This will invalidate all associated QR labels. This action cannot be undone.
              </p>
            </div>
            <div className="bh-modal-footer">
              <button onClick={executeDelete} className="bh-save-btn" style={{ background: 'linear-gradient(135deg, #dc2626, #f87171)', boxShadow: '0 4px 14px rgba(220,38,38,0.25)' }}>Yes, Delete</button>
              <button onClick={() => setDeleteConfirmId(null)} className="bh-cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editProduct && (
        <div className="bh-overlay">
          <div className="bh-modal">
            <div className="bh-modal-header">
              <span style={{ fontSize: '18px' }}>✏️</span>
              <h3 className="bh-modal-title">Edit Product Info</h3>
            </div>
            <form onSubmit={handleEditSave}>
              <div className="bh-modal-body">
                <label className="bh-modal-label">Crop Name</label>
                <input className="bh-modal-input" value={editProduct.name} onChange={(e) => setEditProduct({...editProduct, name: e.target.value})} />

                <label className="bh-modal-label">Variety</label>
                <input className="bh-modal-input" value={editProduct.variety} onChange={(e) => setEditProduct({...editProduct, variety: e.target.value})} />

                <label className="bh-modal-label">MRP</label>
                <input className="bh-modal-input" value={editProduct.mrp} onChange={(e) => setEditProduct({...editProduct, mrp: e.target.value})} />

                <label className="bh-modal-label">Unit Sale Price (USP)</label>
                <input className="bh-modal-input" value={editProduct.usp} onChange={(e) => setEditProduct({...editProduct, usp: e.target.value})} />

                <label className="bh-modal-label">Net Quantity</label>
                <input className="bh-modal-input" value={editProduct.netQty} onChange={(e) => setEditProduct({...editProduct, netQty: e.target.value})} />
              </div>
              <div className="bh-modal-footer">
                <button type="submit" className="bh-save-btn">Save Changes</button>
                <button type="button" onClick={() => setEditProduct(null)} className="bh-cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BatchHistory;