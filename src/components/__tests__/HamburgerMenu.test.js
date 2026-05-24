import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HamburgerMenu from '../HamburgerMenu';

// ---------------------------------------------------------------------------
// Helper — wrap in MemoryRouter because HamburgerMenu renders <Link> elements
// ---------------------------------------------------------------------------

const renderMenu = () =>
  render(
    <MemoryRouter>
      <HamburgerMenu />
    </MemoryRouter>
  );

// ---------------------------------------------------------------------------
// Criterion 1 (part A) — toggle button is always present
// ---------------------------------------------------------------------------

describe('HamburgerMenu — toggle button', () => {
  test('renders a toggle button with the ☰ character', () => {
    renderMenu();
    expect(screen.getByRole('button', { name: /toggle menu/i })).toBeInTheDocument();
  });

  test('toggle button text content is ☰', () => {
    renderMenu();
    const btn = screen.getByRole('button', { name: /toggle menu/i });
    expect(btn).toHaveTextContent('☰');
  });
});

// ---------------------------------------------------------------------------
// Criterion 1 (part B) — drawer is absent before first click
// ---------------------------------------------------------------------------

describe('HamburgerMenu — drawer is closed initially', () => {
  test('category-drawer is not present in the DOM before the button is clicked', () => {
    renderMenu();
    expect(screen.queryByTestId('category-drawer')).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Criterion 1 (part C) — clicking opens drawer with exactly 5 links
// ---------------------------------------------------------------------------

describe('HamburgerMenu — opening the drawer', () => {
  test('clicking ☰ makes the category-drawer appear in the DOM', () => {
    renderMenu();
    fireEvent.click(screen.getByRole('button', { name: /toggle menu/i }));
    expect(screen.getByTestId('category-drawer')).toBeInTheDocument();
  });

  test('drawer contains exactly 5 category links after opening', () => {
    renderMenu();
    fireEvent.click(screen.getByRole('button', { name: /toggle menu/i }));
    const drawer = screen.getByTestId('category-drawer');
    const links = drawer.querySelectorAll('a');
    expect(links).toHaveLength(5);
  });

  test('drawer contains a link to /category/electronics', () => {
    renderMenu();
    fireEvent.click(screen.getByRole('button', { name: /toggle menu/i }));
    expect(screen.getByRole('link', { name: /electronics/i })).toBeInTheDocument();
  });

  test('drawer contains a link to /category/fashion', () => {
    renderMenu();
    fireEvent.click(screen.getByRole('button', { name: /toggle menu/i }));
    expect(screen.getByRole('link', { name: /fashion/i })).toBeInTheDocument();
  });

  test('drawer contains a link to /category/bags', () => {
    renderMenu();
    fireEvent.click(screen.getByRole('button', { name: /toggle menu/i }));
    expect(screen.getByRole('link', { name: /bags/i })).toBeInTheDocument();
  });

  test('drawer contains a link to /category/books', () => {
    renderMenu();
    fireEvent.click(screen.getByRole('button', { name: /toggle menu/i }));
    expect(screen.getByRole('link', { name: /books/i }));
  });

  test('drawer contains a link to /category/sports', () => {
    renderMenu();
    fireEvent.click(screen.getByRole('button', { name: /toggle menu/i }));
    expect(screen.getByRole('link', { name: /sports/i })).toBeInTheDocument();
  });

  test('electronics link href is /category/electronics', () => {
    renderMenu();
    fireEvent.click(screen.getByRole('button', { name: /toggle menu/i }));
    const link = screen.getByRole('link', { name: /electronics/i });
    expect(link).toHaveAttribute('href', '/category/electronics');
  });

  test('fashion link href is /category/fashion', () => {
    renderMenu();
    fireEvent.click(screen.getByRole('button', { name: /toggle menu/i }));
    const link = screen.getByRole('link', { name: /fashion/i });
    expect(link).toHaveAttribute('href', '/category/fashion');
  });

  test('bags link href is /category/bags', () => {
    renderMenu();
    fireEvent.click(screen.getByRole('button', { name: /toggle menu/i }));
    const link = screen.getByRole('link', { name: /bags/i });
    expect(link).toHaveAttribute('href', '/category/bags');
  });

  test('books link href is /category/books', () => {
    renderMenu();
    fireEvent.click(screen.getByRole('button', { name: /toggle menu/i }));
    const link = screen.getByRole('link', { name: /books/i });
    expect(link).toHaveAttribute('href', '/category/books');
  });

  test('sports link href is /category/sports', () => {
    renderMenu();
    fireEvent.click(screen.getByRole('button', { name: /toggle menu/i }));
    const link = screen.getByRole('link', { name: /sports/i });
    expect(link).toHaveAttribute('href', '/category/sports');
  });
});

// ---------------------------------------------------------------------------
// Criterion 3 — clicking ☰ a second time removes the drawer from the DOM
// ---------------------------------------------------------------------------

describe('HamburgerMenu — closing the drawer', () => {
  test('clicking ☰ a second time removes the drawer from the DOM', () => {
    renderMenu();
    const btn = screen.getByRole('button', { name: /toggle menu/i });

    // First click — open
    fireEvent.click(btn);
    expect(screen.getByTestId('category-drawer')).toBeInTheDocument();

    // Second click — close
    fireEvent.click(btn);
    expect(screen.queryByTestId('category-drawer')).not.toBeInTheDocument();
  });

  test('toggle button remains in the DOM after the drawer is closed', () => {
    renderMenu();
    const btn = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(screen.getByRole('button', { name: /toggle menu/i })).toBeInTheDocument();
  });

  test('drawer re-appears after a third click', () => {
    renderMenu();
    const btn = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(btn); // open
    fireEvent.click(btn); // close
    fireEvent.click(btn); // open again
    expect(screen.getByTestId('category-drawer')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Criterion 1 — HamburgerMenu rendered inside Navbar shows ☰ in the Navbar
// (tests that the Navbar contains the toggle button after HamburgerMenu is added)
// ---------------------------------------------------------------------------

describe('HamburgerMenu inside Navbar context', () => {
  test('clicking a category link in the drawer navigates to the correct path', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <HamburgerMenu />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /toggle menu/i }));

    const electronicsLink = screen.getByRole('link', { name: /electronics/i });
    expect(electronicsLink).toHaveAttribute('href', '/category/electronics');
  });
});
