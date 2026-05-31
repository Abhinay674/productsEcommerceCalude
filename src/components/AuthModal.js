import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, initialTab, onClose, onSuccess }) => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState(initialTab || 'login');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    const ok = login(username, password);
    if (!ok) {
      toast.error('Invalid credentials');
      return;
    }
    onSuccess();
    onClose();
  };

  const handleRegister = (e) => {
    e.preventDefault();
    register(name, username, password);
    onSuccess();
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={onClose}>×</button>
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(tab === 'login' ? styles.activeTab : {}) }}
            onClick={() => setTab('login')}
          >
            Login
          </button>
          <button
            style={{ ...styles.tab, ...(tab === 'register' ? styles.activeTab : {}) }}
            onClick={() => setTab('register')}
          >
            Register
          </button>
        </div>
        {tab === 'login' ? (
          <form onSubmit={handleLogin} style={styles.form}>
            <input
              style={styles.input}
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit" style={styles.submitBtn}>Login</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} style={styles.form}>
            <input
              style={styles.input}
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <input
              style={styles.input}
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit" style={styles.submitBtn}>Register</button>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff',
    borderRadius: '12px',
    padding: '32px',
    width: '360px',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: '12px',
    right: '16px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#555',
  },
  tabs: {
    display: 'flex',
    marginBottom: '24px',
    borderBottom: '2px solid #eee',
  },
  tab: {
    flex: 1,
    background: 'none',
    border: 'none',
    padding: '10px',
    fontSize: '15px',
    cursor: 'pointer',
    color: '#888',
    fontWeight: '600',
  },
  activeTab: {
    color: '#1a1a2e',
    borderBottom: '2px solid #e94560',
    marginBottom: '-2px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  input: {
    padding: '10px 14px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '15px',
  },
  submitBtn: {
    background: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
  },
};

export default AuthModal;
