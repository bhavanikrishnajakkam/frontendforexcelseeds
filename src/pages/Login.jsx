import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, { email, password });
      if (res.data.success) {
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      alert("Invalid login details.");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
          background: #f7f4ee;
          position: relative;
          overflow: hidden;
        }

        /* subtle background pattern */
        .login-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 10%, rgba(6,78,59,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 90%, rgba(183,137,42,0.07) 0%, transparent 55%);
          pointer-events: none;
        }

        .login-card {
          position: relative;
          z-index: 1;
          background: #fffdf9;
          border-radius: 20px;
          border: 1px solid #e2d9c8;
          box-shadow: 0 24px 64px rgba(6,78,59,0.14), 0 4px 16px rgba(0,0,0,0.06);
          width: 400px;
          max-width: 92vw;
          overflow: hidden;
        }

        /* top accent bar */
        .login-card-top {
          height: 5px;
          background: linear-gradient(90deg, #064e3b, #047857, #b7892a);
        }

        .login-card-body {
          padding: 40px 36px 36px;
        }

        .login-brand-area {
          text-align: center;
          margin-bottom: 36px;
        }
        .login-emblem {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #064e3b, #047857);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          margin: 0 auto 16px;
          box-shadow: 0 6px 20px rgba(6,78,59,0.25);
        }
        .login-brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 700;
          color: #052e1c;
          letter-spacing: -0.3px;
          line-height: 1.2;
        }
        .login-brand-name span {
          color: #b7892a;
        }
        .login-subtitle {
          margin-top: 8px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #8a9ab0;
        }

        .login-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #e2d9c8, transparent);
          margin-bottom: 28px;
        }

        .login-field {
          margin-bottom: 16px;
        }
        .login-label {
          display: block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #8a9ab0;
          margin-bottom: 6px;
        }
        .login-input {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid #ddd5c5;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #1a1a1a;
          background: #fff;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .login-input::placeholder {
          color: #bbb;
          font-weight: 300;
        }
        .login-input:focus {
          border-color: #047857;
          box-shadow: 0 0 0 3px rgba(4,120,87,0.10);
        }

        .login-btn {
          width: 100%;
          margin-top: 8px;
          padding: 13px;
          background: linear-gradient(135deg, #064e3b 0%, #047857 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.3px;
          box-shadow: 0 4px 20px rgba(6,78,59,0.28);
          transition: transform 0.15s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }
        .login-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
          pointer-events: none;
        }
        .login-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(6,78,59,0.36);
        }
        .login-btn:active {
          transform: translateY(0);
        }

        .login-footer {
          text-align: center;
          margin-top: 24px;
          font-size: 11px;
          color: #aaa;
          letter-spacing: 0.3px;
        }
      `}</style>

      <div className="login-root">
        <div className="login-card">
          <div className="login-card-top"></div>
          <div className="login-card-body">

            <div className="login-brand-area">
              <div className="login-emblem">🌾</div>
              <div className="login-brand-name">EXCEL AGRI RESEARCH<br /><span>PVT. LTD.</span></div>
              <div className="login-subtitle">Admin Portal Access</div>
            </div>

            <div className="login-divider"></div>

            <form onSubmit={handleLogin}>
              <div className="login-field">
                <label className="login-label">Email Address</label>
                <input
                  className="login-input"
                  type="email"
                  placeholder="admin@excelagri.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="login-field">
                <label className="login-label">Password</label>
                <input
                  className="login-input"
                  type="password"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-btn">Sign In to Dashboard</button>
            </form>

            <div className="login-footer">© 2026 Excel Agri Research Pvt. Ltd.</div>
          </div>
        </div>
      </div>
    </>
  );
}