import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../context/ThemeContext';
import StarRating from '../StarRating';

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  localStorage.clear();
});

/**
 * Renders StarRating inside a ThemeProvider.
 * Seeding localStorage before render controls isDark without touching any
 * production file.
 */
const renderStarRating = (rating, darkMode = false) => {
  localStorage.setItem('shopTheme', darkMode ? 'dark' : 'light');
  return render(
    <ThemeProvider>
      <StarRating rating={rating} />
    </ThemeProvider>
  );
};

// ---------------------------------------------------------------------------
// Criterion 3 — rating 4.5 → 4 full, 1 half, 0 empty
// ---------------------------------------------------------------------------

describe('criterion 3 — half-star algorithm for 4.5', () => {
  test('criterion 3: 4.5 renders 4 full stars', () => {
    renderStarRating(4.5);
    const fullStars = screen.getAllByTestId('star-full');
    expect(fullStars).toHaveLength(4);
  });

  test('criterion 3: 4.5 renders 1 half star', () => {
    renderStarRating(4.5);
    const halfStars = screen.getAllByTestId('star-half');
    expect(halfStars).toHaveLength(1);
  });

  test('criterion 3: 4.5 renders 0 empty stars', () => {
    renderStarRating(4.5);
    const emptyStars = screen.queryAllByTestId('star-empty');
    expect(emptyStars).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Criterion 4 — rating 4.2 rounds to 4.0 → 4 full, 0 half, 1 empty
// ---------------------------------------------------------------------------

describe('criterion 4 — rounding 4.2 to 4.0', () => {
  test('criterion 4: 4.2 renders 4 full stars', () => {
    renderStarRating(4.2);
    const fullStars = screen.getAllByTestId('star-full');
    expect(fullStars).toHaveLength(4);
  });

  test('criterion 4: 4.2 renders 0 half stars', () => {
    renderStarRating(4.2);
    const halfStars = screen.queryAllByTestId('star-half');
    expect(halfStars).toHaveLength(0);
  });

  test('criterion 4: 4.2 renders 1 empty star', () => {
    renderStarRating(4.2);
    const emptyStars = screen.getAllByTestId('star-empty');
    expect(emptyStars).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// Criterion 4 — additional rounding: 4.7 rounds to 5.0 → 5 full, 0 half, 0 empty
// ---------------------------------------------------------------------------

describe('criterion 4 — rounding 4.7 to 5.0', () => {
  test('criterion 4: 4.7 rounds to 5.0 → 5 full stars', () => {
    renderStarRating(4.7);
    const fullStars = screen.getAllByTestId('star-full');
    expect(fullStars).toHaveLength(5);
  });

  test('criterion 4: 4.7 rounds to 5.0 → 0 half stars', () => {
    renderStarRating(4.7);
    const halfStars = screen.queryAllByTestId('star-half');
    expect(halfStars).toHaveLength(0);
  });

  test('criterion 4: 4.7 rounds to 5.0 → 0 empty stars', () => {
    renderStarRating(4.7);
    const emptyStars = screen.queryAllByTestId('star-empty');
    expect(emptyStars).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Criterion 5 — numeric label color: #aaa in dark mode, #555 in light mode
// ---------------------------------------------------------------------------

describe('criterion 5 — numeric label color', () => {
  test('criterion 5: label color is #aaa when isDark is true (dark mode)', () => {
    renderStarRating(4.5, true);
    const label = screen.getByTestId('star-rating-label');
    expect(label).toHaveStyle('color: #aaa');
  });

  test('criterion 5: label color is #555 when isDark is false (light mode)', () => {
    renderStarRating(4.5, false);
    const label = screen.getByTestId('star-rating-label');
    expect(label).toHaveStyle('color: #555');
  });
});

// ---------------------------------------------------------------------------
// Numeric label value — shows the rounded-to-0.5 rating as text
// ---------------------------------------------------------------------------

describe('shows numeric rating value', () => {
  test('shows numeric rating value "4.5" for rating 4.5', () => {
    renderStarRating(4.5);
    // label shows rounded.toFixed(1) → "4.5"
    expect(screen.getByTestId('star-rating-label')).toHaveTextContent('4.5');
  });

  test('shows numeric rating value "4.0" for rating 4.2 (rounded)', () => {
    renderStarRating(4.2);
    // Math.round(4.2 * 2) / 2 = 4.0 → "4.0"
    expect(screen.getByTestId('star-rating-label')).toHaveTextContent('4.0');
  });

  test('shows numeric rating value "5.0" for rating 4.7 (rounded)', () => {
    renderStarRating(4.7);
    // Math.round(4.7 * 2) / 2 = 5.0 → "5.0"
    expect(screen.getByTestId('star-rating-label')).toHaveTextContent('5.0');
  });

  test('shows numeric rating value "3.0" for rating 3.0', () => {
    renderStarRating(3.0);
    expect(screen.getByTestId('star-rating-label')).toHaveTextContent('3.0');
  });
});

// ---------------------------------------------------------------------------
// Total star count always equals 5
// ---------------------------------------------------------------------------

describe('total star count is always 5', () => {
  test('4.5 → total star elements equals 5', () => {
    renderStarRating(4.5);
    const full = screen.getAllByTestId('star-full').length;
    const half = screen.getAllByTestId('star-half').length;
    const empty = screen.queryAllByTestId('star-empty').length;
    expect(full + half + empty).toBe(5);
  });

  test('4.2 → total star elements equals 5', () => {
    renderStarRating(4.2);
    const full = screen.getAllByTestId('star-full').length;
    const half = screen.queryAllByTestId('star-half').length;
    const empty = screen.getAllByTestId('star-empty').length;
    expect(full + half + empty).toBe(5);
  });

  test('3.0 → total star elements equals 5', () => {
    renderStarRating(3.0);
    const full = screen.getAllByTestId('star-full').length;
    const half = screen.queryAllByTestId('star-half').length;
    const empty = screen.getAllByTestId('star-empty').length;
    expect(full + half + empty).toBe(5);
  });
});
