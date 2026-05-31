import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const stored = localStorage.getItem('shopCurrentUser');
  const [currentUser, setCurrentUser] = useState(stored ? JSON.parse(stored) : null);

  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem('shopUsers') || '[]');
    const match = users.find(u => u.username === username && u.password === password);
    if (!match) return false;
    const user = { name: match.name, username: match.username };
    localStorage.setItem('shopCurrentUser', JSON.stringify(user));
    setCurrentUser(user);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('shopCurrentUser');
    setCurrentUser(null);
  };

  const register = (name, username, password) => {
    const users = JSON.parse(localStorage.getItem('shopUsers') || '[]');
    localStorage.setItem('shopUsers', JSON.stringify([...users, { name, username, password }]));
    const user = { name, username };
    localStorage.setItem('shopCurrentUser', JSON.stringify(user));
    setCurrentUser(user);
  };

  const updateProfile = (name, email) => {
    const users = JSON.parse(localStorage.getItem('shopUsers') || '[]');
    const updated = users.map(u =>
      u.username === currentUser.username ? { ...u, name, email } : u
    );
    localStorage.setItem('shopUsers', JSON.stringify(updated));
    const user = { ...currentUser, name, email };
    localStorage.setItem('shopCurrentUser', JSON.stringify(user));
    setCurrentUser(user);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
