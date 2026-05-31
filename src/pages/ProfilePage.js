import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const getInitials = (name) =>
  name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

const ProfilePage = () => {
  const { currentUser, updateProfile } = useAuth();
  const { isDark } = useTheme();
  const [editing, setEditing] = useState(false);
  const [nameVal, setNameVal] = useState('');
  const [emailVal, setEmailVal] = useState('');

  const styles = {
    page: {
      maxWidth: '560px',
      margin: '40px auto',
      padding: '0 16px',
    },
    heading: {
      fontSize: '28px',
      fontWeight: '700',
      marginBottom: '32px',
      color: isDark ? '#e0e0e0' : '#222',
    },
    empty: {
      color: isDark ? '#aaa' : '#555',
      fontSize: '16px',
      textAlign: 'center',
      padding: '40px 0',
    },
    card: {
      background: isDark ? '#1e1e1e' : '#fff',
      borderRadius: '12px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
      padding: '32px',
    },
    avatarRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      marginBottom: '28px',
    },
    avatar: {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      background: '#e94560',
      color: '#fff',
      fontSize: '22px',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    displayName: {
      fontSize: '20px',
      fontWeight: '700',
      color: isDark ? '#e0e0e0' : '#222',
    },
    field: {
      marginBottom: '16px',
    },
    label: {
      fontSize: '12px',
      fontWeight: '600',
      color: isDark ? '#aaa' : '#555',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '4px',
    },
    value: {
      fontSize: '15px',
      color: isDark ? '#e0e0e0' : '#222',
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      fontSize: '15px',
      border: isDark ? '1px solid #444' : '1px solid #ddd',
      borderRadius: '6px',
      background: isDark ? '#2a2a2a' : '#f9f9f9',
      color: isDark ? '#e0e0e0' : '#222',
      boxSizing: 'border-box',
      outline: 'none',
    },
    btnRow: {
      display: 'flex',
      gap: '10px',
      marginTop: '24px',
    },
    primaryBtn: {
      background: '#1a1a2e',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      padding: '9px 20px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    secondaryBtn: {
      background: 'none',
      color: isDark ? '#aaa' : '#555',
      border: isDark ? '1px solid #444' : '1px solid #ddd',
      borderRadius: '6px',
      padding: '9px 20px',
      fontSize: '14px',
      cursor: 'pointer',
    },
  };

  if (!currentUser) {
    return (
      <div style={styles.page}>
        <p style={styles.empty}>Please log in to view your profile.</p>
      </div>
    );
  }

  const handleEdit = () => {
    setNameVal(currentUser.name);
    setEmailVal(currentUser.email || '');
    setEditing(true);
  };

  const handleSave = () => {
    updateProfile(nameVal, emailVal);
    setEditing(false);
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>My Profile</h1>
      <div style={styles.card}>
        <div style={styles.avatarRow}>
          <div style={styles.avatar}>{getInitials(currentUser.name)}</div>
          <span style={styles.displayName}>{currentUser.name}</span>
        </div>

        {editing ? (
          <>
            <div style={styles.field}>
              <div style={styles.label}>Name</div>
              <input
                style={styles.input}
                value={nameVal}
                onChange={e => setNameVal(e.target.value)}
                aria-label="Name"
              />
            </div>
            <div style={styles.field}>
              <div style={styles.label}>Email</div>
              <input
                style={styles.input}
                value={emailVal}
                onChange={e => setEmailVal(e.target.value)}
                placeholder="Email"
                aria-label="Email"
              />
            </div>
            <div style={styles.field}>
              <div style={styles.label}>Username</div>
              <div style={{ ...styles.value, color: isDark ? '#666' : '#999' }}>
                {currentUser.username}
              </div>
            </div>
            <div style={styles.btnRow}>
              <button style={styles.primaryBtn} onClick={handleSave} aria-label="Save">
                Save
              </button>
              <button style={styles.secondaryBtn} onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={styles.field}>
              <div style={styles.label}>Name</div>
              <div style={styles.value}>{currentUser.name}</div>
            </div>
            <div style={styles.field}>
              <div style={styles.label}>Username</div>
              <div style={styles.value}>{currentUser.username}</div>
            </div>
            <div style={styles.field}>
              <div style={styles.label}>Email</div>
              <div style={styles.value}>{currentUser.email || '—'}</div>
            </div>
            <div style={styles.btnRow}>
              <button style={styles.primaryBtn} onClick={handleEdit} aria-label="Edit Profile">
                Edit Profile
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
