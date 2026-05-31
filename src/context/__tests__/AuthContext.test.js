import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

beforeEach(() => {
  localStorage.clear();
});

const TestLogin = ({ username, password, onResult }) => {
  const { login } = useAuth();
  return (
    <button onClick={() => onResult(login(username, password))}>Login</button>
  );
};

const TestRegister = ({ name, username, password }) => {
  const { register } = useAuth();
  return (
    <button onClick={() => register(name, username, password)}>Register</button>
  );
};

const TestLogout = () => {
  const { logout, currentUser } = useAuth();
  return (
    <>
      <span data-testid="user">{currentUser ? currentUser.username : 'none'}</span>
      <button onClick={logout}>Logout</button>
    </>
  );
};

describe('AuthContext — login', () => {
  test('login returns false for non-matching credentials', () => {
    const onResult = jest.fn();
    render(
      <AuthProvider>
        <TestLogin username="nobody" password="wrong" onResult={onResult} />
      </AuthProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(onResult).toHaveBeenCalledWith(false);
  });

  test('login returns true and sets shopCurrentUser for valid credentials', () => {
    localStorage.setItem('shopUsers', JSON.stringify([
      { name: 'Alice', username: 'alice', password: 'pass123' },
    ]));
    const onResult = jest.fn();
    render(
      <AuthProvider>
        <TestLogin username="alice" password="pass123" onResult={onResult} />
      </AuthProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(onResult).toHaveBeenCalledWith(true);
    expect(localStorage.getItem('shopCurrentUser')).not.toBeNull();
  });
});

describe('AuthContext — register', () => {
  test('register appends to shopUsers and sets shopCurrentUser', () => {
    render(
      <AuthProvider>
        <TestRegister name="Bob" username="bob" password="abc" />
      </AuthProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    expect(JSON.parse(localStorage.getItem('shopUsers'))).toHaveLength(1);
    expect(localStorage.getItem('shopCurrentUser')).not.toBeNull();
  });
});

describe('AuthContext — logout', () => {
  test('logout removes shopCurrentUser from localStorage', () => {
    localStorage.setItem('shopUsers', JSON.stringify([
      { name: 'Alice', username: 'alice', password: 'pass123' },
    ]));
    localStorage.setItem('shopCurrentUser', JSON.stringify({ name: 'Alice', username: 'alice' }));
    render(
      <AuthProvider>
        <TestLogout />
      </AuthProvider>
    );
    expect(screen.getByTestId('user').textContent).toBe('alice');
    fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    expect(localStorage.getItem('shopCurrentUser')).toBeNull();
    expect(screen.getByTestId('user').textContent).toBe('none');
  });
});
