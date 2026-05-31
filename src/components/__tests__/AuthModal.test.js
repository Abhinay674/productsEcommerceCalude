import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../../context/AuthContext';
import AuthModal from '../AuthModal';

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));

import { toast } from 'react-toastify';

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

const renderModal = (props = {}) =>
  render(
    <AuthProvider>
      <AuthModal
        isOpen={true}
        initialTab="login"
        onClose={jest.fn()}
        onSuccess={jest.fn()}
        {...props}
      />
    </AuthProvider>
  );

describe('AuthModal — login tab', () => {
  test('submitting with valid credentials calls onSuccess and sets shopCurrentUser', () => {
    localStorage.setItem('shopUsers', JSON.stringify([
      { name: 'Alice', username: 'alice', password: 'pass123' },
    ]));
    const onSuccess = jest.fn();
    renderModal({ onSuccess });
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'alice' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'pass123' } });
    const loginBtns = screen.getAllByRole('button', { name: /^login$/i });
    fireEvent.click(loginBtns[loginBtns.length - 1]);
    expect(onSuccess).toHaveBeenCalled();
    expect(localStorage.getItem('shopCurrentUser')).not.toBeNull();
  });

  test('submitting with invalid credentials does NOT call onSuccess and shows toast', () => {
    const onSuccess = jest.fn();
    renderModal({ onSuccess });
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'nobody' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrong' } });
    const loginBtns = screen.getAllByRole('button', { name: /^login$/i });
    fireEvent.click(loginBtns[loginBtns.length - 1]);
    expect(onSuccess).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
  });
});

describe('AuthModal — register tab', () => {
  test('submitting register form appends to shopUsers, sets shopCurrentUser, calls onSuccess', () => {
    const onSuccess = jest.fn();
    renderModal({ initialTab: 'register', onSuccess });
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Bob' } });
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'bob' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'abc' } });
    const registerBtns = screen.getAllByRole('button', { name: /^register$/i });
    fireEvent.click(registerBtns[registerBtns.length - 1]);
    expect(JSON.parse(localStorage.getItem('shopUsers'))).toHaveLength(1);
    expect(localStorage.getItem('shopCurrentUser')).not.toBeNull();
    expect(onSuccess).toHaveBeenCalled();
  });
});

describe('AuthModal — not rendered when closed', () => {
  test('renders nothing when isOpen is false', () => {
    render(
      <AuthProvider>
        <AuthModal isOpen={false} initialTab="login" onClose={jest.fn()} onSuccess={jest.fn()} />
      </AuthProvider>
    );
    expect(screen.queryByPlaceholderText('Username')).not.toBeInTheDocument();
  });
});
