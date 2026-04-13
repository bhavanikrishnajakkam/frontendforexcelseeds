import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function VerifyProduct() {
  const { labelNumber } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

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

  if (error) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .vp-state-screen {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f7f4ee;
          font-family: 'DM Sans', sans-serif;
          gap: 14px;
          padding: 20px;
          text-align: center;
        }
        .vp-state-icon {
          width: 60px; height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #dc2626, #f87171);
          display: flex; align-items: center; justify-content: center;
          font-size: 26px;
          box-shadow: 0 8px 24px rgba(220,38,38,0.25);
        }
        .vp-state-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 700;
          color: #dc2626;
        }
        .vp-state-sub {
          font-size: 14px;
          color: #8a9ab0;
          max-width: 260px;
          line-height: 1.6;
        }
      `}</style>
      <div className="vp-state-screen">
        <div className="vp-state-icon">✕</div>
        <div className="vp-state-title">Invalid Product Code</div>
        <div className="vp-state-sub">This QR code could not be verified. Please check the label and try again.</div>
      </div>
    </>
  );

  if (!data) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .vp-state-screen {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f7f4ee;
          font-family: 'DM Sans', sans-serif;
          gap: 16px;
          padding: 20px;
          text-align: center;
        }
        .vp-loading-emblem {
          width: 56px; height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #064e3b, #047857);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          box-shadow: 0 8px 24px rgba(6,78,59,0.25);
          animation: vpPulse 1.6s ease-in-out infinite;
        }
        @keyframes vpPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 8px 24px rgba(6,78,59,0.25); }
          50% { transform: scale(1.06); box-shadow: 0 12px 32px rgba(6,78,59,0.38); }
        }
        .vp-loading-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 600;
          color: #064e3b;
          letter-spacing: 0.2px;
        }
        .vp-loading-sub {
          font-size: 12px;
          color: #8a9ab0;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .vp-dots span {
          display: inline-block;
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #047857;
          margin: 0 3px;
          animation: vpDot 1.2s ease-in-out infinite;
        }
        .vp-dots span:nth-child(2) { animation-delay: 0.2s; }
        .vp-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes vpDot {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <div className="vp-state-screen">
        <div className="vp-loading-emblem">🌾</div>
        <div className="vp-loading-text">Verifying with Excel Agri Research</div>
        <div className="vp-loading-sub">Please wait</div>
        <div className="vp-dots"><span/><span/><span/></div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .vp-root {
          min-height: 100vh;
          background: #f7f4ee;
          padding: 28px 14px 48px;
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
          position: relative;
        }
        .vp-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 40% at 15% 5%, rgba(6,78,59,0.07) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 85% 95%, rgba(183,137,42,0.06) 0%, transparent 50%);
          pointer-events: none;
        }

        .vp-card {
          position: relative;
          z-index: 1;
          max-width: 480px;
          margin: 0 auto;
          background: #fffdf9;
          border-radius: 20px;
          border: 1px solid #e2d9c8;
          box-shadow: 0 20px 60px rgba(6,78,59,0.13), 0 4px 16px rgba(0,0,0,0.05);
          overflow: hidden;
        }

        /* top gradient bar */
        .vp-card-top {
          height: 5px;
          background: linear-gradient(90deg, #064e3b, #047857, #b7892a);
        }

        /* HEADER */
        .vp-header {
          text-align: center;
          padding: 28px 24px 24px;
          border-bottom: 1px solid #ede8de;
          background: linear-gradient(180deg, #f7f4ee 0%, #fffdf9 100%);
        }
        .vp-header-emblem {
          width: 48px; height: 48px;
          background: linear-gradient(135deg, #064e3b, #047857);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          margin: 0 auto 14px;
          box-shadow: 0 6px 18px rgba(6,78,59,0.22);
        }
        .vp-brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 700;
          color: #052e1c;
          letter-spacing: -0.2px;
          line-height: 1.2;
        }
        .vp-brand-name span { color: #b7892a; }
        .vp-genuine-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 12px;
          padding: 6px 16px;
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          border: 1px solid #6ee7b7;
          border-radius: 20px;
          color: #047857;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .vp-check-icon {
          width: 18px; height: 18px;
          background: linear-gradient(135deg, #047857, #34d399);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          font-size: 9px;
          font-weight: 700;
          flex-shrink: 0;
        }

        /* TABLE */
        .vp-table {
          display: flex;
          flex-direction: column;
        }
        .vp-row {
          display: flex;
          border-bottom: 1px solid #f0ebe0;
          transition: background 0.12s;
        }
        .vp-row:last-child { border-bottom: none; }
        .vp-row:hover { background: #faf7f0; }
        .vp-label-col {
          flex: 1;
          padding: 11px 16px;
          background: #f7f4ee;
          font-size: 11px;
          font-weight: 700;
          color: #8a9ab0;
          letter-spacing: 0.4px;
          text-transform: uppercase;
          line-height: 1.5;
          border-right: 1px solid #ede8de;
        }
        .vp-value-col {
          flex: 1.6;
          padding: 11px 16px;
          font-size: 13px;
          font-weight: 500;
          color: #1a1a1a;
          line-height: 1.55;
        }
        .vp-value-col.bold {
          font-weight: 700;
          color: #052e1c;
          font-size: 14px;
        }

        /* PDF BUTTON */
        .vp-pdf-area {
          padding: 20px 20px 24px;
          background: linear-gradient(180deg, #fffdf9, #f7f4ee);
          border-top: 1px solid #ede8de;
        }
        .vp-pdf-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px;
          background: linear-gradient(135deg, #064e3b 0%, #047857 100%);
          color: #fff;
          text-decoration: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.2px;
          box-shadow: 0 4px 18px rgba(6,78,59,0.26);
          transition: transform 0.15s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }
        .vp-pdf-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
          pointer-events: none;
        }
        .vp-pdf-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 26px rgba(6,78,59,0.34);
        }

        /* FOOTER */
        .vp-footer {
          text-align: center;
          margin-top: 18px;
          font-size: 11px;
          color: #aaa;
          letter-spacing: 0.3px;
        }
      `}</style>

      <div className="vp-root">
        <div className="vp-card">
          <div className="vp-card-top"></div>

          {/* HEADER */}
          <div className="vp-header">
            <div className="vp-header-emblem">🌾</div>
            <div className="vp-brand-name">EXCEL AGRI RESEARCH <span>PVT. LTD.</span></div>
            <div className="vp-genuine-badge">
              <div className="vp-check-icon">✔</div>
              Genuine Product Verified
            </div>
          </div>

          {/* DETAIL ROWS */}
          <div className="vp-table">
            <DetailRow label="Label Number"     value={data.labelNumber}               bold />
            <DetailRow label="Crop Name"        value={data.cropName}                  bold />
            <DetailRow label="Packed Variety"   value={data.packedVariety} />
            <DetailRow label="Lot Number"       value={data.packedLotNumber} />
            <DetailRow label="Date of Testing"  value={formatDate(data.dateOfTesting)} />
            <DetailRow label="Date of Packaging" value={formatDate(data.dateOfPackaging)} />
            <DetailRow label="Date of Expiry"   value={formatDate(data.dateOfExpiry)} />
            <DetailRow label="MRP"              value={data.mrp}                       bold />
            <DetailRow label="Unit Sale Price"  value={data.unitSalePrice} />
            <DetailRow label="Net Quantity"     value={data.netQty} />
            <DetailRow label="Packed At"        value={data.packedAt} />
            <DetailRow label="Plant Address"    value={data.plantAddress} />
            <DetailRow label="Produced By"      value={data.producedBy} />
          </div>

          {/* PDF BUTTON */}
          <div className="vp-pdf-area">
            <a href={data.leafletUrl} target="_blank" rel="noreferrer" className="vp-pdf-btn">
              📄 View Product Leaflet (PDF)
            </a>
          </div>
        </div>

        <p className="vp-footer">© 2026 Ganga Kaveri Seeds Pvt. Ltd.</p>
      </div>
    </>
  );
}

const DetailRow = ({ label, value, bold }) => (
  <div className="vp-row">
    <div className="vp-label-col">{label}</div>
    <div className={`vp-value-col${bold ? ' bold' : ''}`}>{value}</div>
  </div>
);