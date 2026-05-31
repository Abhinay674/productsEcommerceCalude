import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

beforeEach(() => {
  localStorage.clear();
});

const TestUpdateProfile = ({ name, email }) => {
  const { updateProfile, currentUser } = useAuth();
  return (
    <>
      <span data-testid="name">{currentUser ? currentUser.name : 'none'}</span>
      <span data-testid="email">{currentUser ? (currentUser.email || '—') : 'none'}</span>
      <button onClick={() => updateProfile(name, email)}>Update</button>
    </>
  );
};

describe('AuthContext — updateProfile', () => {
  test('updates shopCurrentUser name and email in localStorage', () => {
    localStorage.setItem('shopUsers', JSON.stringify([
      { name: 'Alice', username: 'alice', password: 'pass' },
    ]));
    localStorage.setItem('shopCurrentUser', JSON.stringify({ name: 'Alice', username: 'alice' }));
    render(
      <AuthProvider>
        <TestUpdateProfile name="Alice Updated" email="alice@example.com" />
      </AuthProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /update/i }));
    const saved = JSON.parse(localStorage.getItem('shopCurrentUser'));
    expect(saved.name).toBe('Alice Updated');
    expect(saved.email).toBe('alice@example.com');
  });

  test('updates matching shopUsers entry by username', () => {
    localStorage.setItem('shopUsers', JSON.stringify([
      { name: 'Alice', username: 'alice', password: 'pass' },
      { name: 'Bob', username: 'bob', password: 'pass2' },
    ]));
    localStorage.setItem('shopCurrentUser', JSON.stringify({ name: 'Alice', username: 'alice' }));
    render(
      <AuthProvider>
        <TestUpdateProfile name="Alice New" email="newalice@example.com" />
      </AuthProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /update/i }));
    const users = JSON.parse(localStorage.getItem('shopUsers'));
    const alice = users.find(u => u.username === 'alice');
    const bob = users.find(u => u.username === 'bob');
    expect(alice.name).toBe('Alice New');
    expect(alice.email).toBe('newalice@example.com');
    expect(bob.name).toBe('Bob'); // untouched
  });

  test('updateProfile updates currentUser state reactively', () => {
    localStorage.setItem('shopUsers', JSON.stringify([
      { name: 'Alice', username: 'alice', password: 'pass' },
    ]));
    localStorage.setItem('shopCurrentUser', JSON.stringify({ name: 'Alice', username: 'alice' }));
    render(
      <AuthProvider>
        <TestUpdateProfile name="Alice Updated" email="alice@example.com" />
      </AuthProvider>
    );
    expect(screen.getByTestId('name').textContent).toBe('Alice');
    fireEvent.click(screen.getByRole('button', { name: /update/i }));
    expect(screen.getByTestId('name').textContent).toBe('Alice Updated');
    expect(screen.getByTestId('email').textContent).toBe('alice@example.com');
  });
});
