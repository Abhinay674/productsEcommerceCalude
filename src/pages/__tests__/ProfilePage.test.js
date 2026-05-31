import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import ProfilePage from '../ProfilePage';

beforeEach(() => {
  localStorage.clear();
});

const renderPage = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <ProfilePage />
      </AuthProvider>
    </MemoryRouter>
  );

const seedUser = (overrides = {}) => {
  const user = { name: 'John Doe', username: 'johndoe', ...overrides };
  localStorage.setItem('shopCurrentUser', JSON.stringify(user));
  localStorage.setItem('shopUsers', JSON.stringify([
    { name: user.name, username: user.username, password: 'pass123', ...overrides },
  ]));
};

describe('ProfilePage — logged out', () => {
  test('shows inline login message and no avatar when logged out', () => {
    renderPage();
    expect(screen.getByText(/please log in to view your profile/i)).toBeInTheDocument();
    expect(screen.queryByText('JD')).not.toBeInTheDocument();
  });
});

describe('ProfilePage — avatar initials', () => {
  test('shows two-letter initials for full name "John Doe"', () => {
    seedUser({ name: 'John Doe', username: 'johndoe' });
    renderPage();
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  test('shows single-letter initial for single-word name "Alice"', () => {
    seedUser({ name: 'Alice', username: 'alice' });
    renderPage();
    expect(screen.getByText('A')).toBeInTheDocument();
  });
});

describe('ProfilePage — display fields', () => {
  test('shows name, username and "—" for email when email is not set', () => {
    seedUser({ name: 'John Doe', username: 'johndoe' });
    renderPage();
    // name appears in avatar row and name field
    expect(screen.getAllByText('John Doe').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('johndoe')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  test('shows email value when email is set', () => {
    seedUser({ name: 'John Doe', username: 'johndoe', email: 'john@example.com' });
    renderPage();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});

describe('ProfilePage — edit form', () => {
  test('clicking Edit Profile reveals inputs pre-filled with current name and email', () => {
    seedUser({ name: 'John Doe', username: 'johndoe', email: 'john@example.com' });
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
  });

  test('email input is empty when email is not set', () => {
    seedUser({ name: 'John Doe', username: 'johndoe' });
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
    const emailInput = screen.getByPlaceholderText(/email/i);
    expect(emailInput.value).toBe('');
  });

  test('submitting updates shopCurrentUser name and email in localStorage', () => {
    seedUser({ name: 'John Doe', username: 'johndoe' });
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
    fireEvent.change(screen.getByDisplayValue('John Doe'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    const saved = JSON.parse(localStorage.getItem('shopCurrentUser'));
    expect(saved.name).toBe('Jane Doe');
    expect(saved.email).toBe('jane@example.com');
  });

  test('submitting updates matching shopUsers entry', () => {
    seedUser({ name: 'John Doe', username: 'johndoe' });
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
    fireEvent.change(screen.getByDisplayValue('John Doe'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    const users = JSON.parse(localStorage.getItem('shopUsers'));
    expect(users[0].name).toBe('Jane Doe');
    expect(users[0].email).toBe('jane@example.com');
  });

  test('save returns to view mode showing updated values', () => {
    seedUser({ name: 'John Doe', username: 'johndoe' });
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
    fireEvent.change(screen.getByDisplayValue('John Doe'), { target: { value: 'Jane Doe' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();
    // "Jane Doe" appears in avatar row and name field — use getAllByText
    expect(screen.getAllByText('Jane Doe').length).toBeGreaterThanOrEqual(1);
  });
});
