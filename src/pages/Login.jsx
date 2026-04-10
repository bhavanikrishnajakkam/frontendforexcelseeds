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
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.card}>
        <div style={styles.logoContainer}>
          
          <h2 style={styles.brandName}> EXCEL AGRI RESEARCH PVT.LTD. </h2>
          <p style={styles.subtitle}>Admin Portal Access</p>
        </div>
        <input 
          style={styles.input} 
          type="email" 
          placeholder="Email Address" 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          style={styles.input} 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" style={styles.button}>Sign In</button>
      </form>
    </div>
  );
}

const styles = {
  container: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4f8' },
  card: { padding: '40px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '380px' },
  logoContainer: { textAlign: 'center', marginBottom: '30px' },
  logo: { width: '80px', marginBottom: '10px', borderRadius: '50%' },
  brandName: { color: '#006400', margin: '0', fontSize: '24px', fontWeight: 'bold' },
  subtitle: { color: '#666', margin: '5px 0 0 0', fontSize: '14px' },
  input: { width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', backgroundColor: '#006400', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }
};