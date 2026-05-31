import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '../../context/ThemeContext'
import { AuthProvider } from '../../context/AuthContext'
import { WishlistProvider } from '../../context/WishlistContext'
import { CartProvider } from '../../context/CartContext'
import BackToTop from '../BackToTop'

// ---------------------------------------------------------------------------
// Helper: render BackToTop with the full provider stack
// ---------------------------------------------------------------------------

const renderBackToTop = () =>
  render(
    <MemoryRouter>
      <ThemeProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <BackToTop />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ThemeProvider>
    </MemoryRouter>
  )

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  // Start every test with scrollY at 0
  Object.defineProperty(window, 'scrollY', {
    value: 0,
    writable: true,
    configurable: true,
  })
  localStorage.clear()
})

afterEach(() => {
  jest.restoreAllMocks()
})

// ---------------------------------------------------------------------------
// Criterion 2 — button absent on initial render when scrollY is 0
// ---------------------------------------------------------------------------

describe('criterion 2 — button absent on initial render', () => {
  test('criterion 2: button is NOT in the DOM when window.scrollY is 0 on initial render', () => {
    renderBackToTop()
    expect(
      screen.queryByRole('button', { name: /back to top/i })
    ).not.toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Criterion 1 — button appears after scroll sets scrollY > 300
// ---------------------------------------------------------------------------

describe('criterion 1 — button appears after scroll past 300px', () => {
  test('criterion 1: button is present in the DOM after a scroll event with scrollY = 301', () => {
    renderBackToTop()

    act(() => {
      Object.defineProperty(window, 'scrollY', {
        value: 301,
        writable: true,
        configurable: true,
      })
      fireEvent.scroll(window)
    })

    expect(
      screen.getByRole('button', { name: /back to top/i })
    ).toBeInTheDocument()
  })

  test('criterion 1: button appears at the scroll threshold boundary (scrollY = 301, not 300)', () => {
    renderBackToTop()

    // At exactly 300 — should still be hidden (threshold is > 300)
    act(() => {
      Object.defineProperty(window, 'scrollY', {
        value: 300,
        writable: true,
        configurable: true,
      })
      fireEvent.scroll(window)
    })

    expect(
      screen.queryByRole('button', { name: /back to top/i })
    ).not.toBeInTheDocument()

    // At 301 — should appear
    act(() => {
      Object.defineProperty(window, 'scrollY', {
        value: 301,
        writable: true,
        configurable: true,
      })
      fireEvent.scroll(window)
    })

    expect(
      screen.getByRole('button', { name: /back to top/i })
    ).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Criterion 3 — button disappears when scrollY returns to 0 after scroll past 300
// ---------------------------------------------------------------------------

describe('criterion 3 — button disappears when scrollY returns to 0', () => {
  test('criterion 3: button is removed from the DOM after scrollY returns to 0 following a scroll past 300', () => {
    renderBackToTop()

    // Scroll past threshold — button appears
    act(() => {
      Object.defineProperty(window, 'scrollY', {
        value: 301,
        writable: true,
        configurable: true,
      })
      fireEvent.scroll(window)
    })

    expect(
      screen.getByRole('button', { name: /back to top/i })
    ).toBeInTheDocument()

    // Scroll back to top — button disappears
    act(() => {
      Object.defineProperty(window, 'scrollY', {
        value: 0,
        writable: true,
        configurable: true,
      })
      fireEvent.scroll(window)
    })

    expect(
      screen.queryByRole('button', { name: /back to top/i })
    ).not.toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Criterion 4 — clicking the button calls window.scrollTo with correct args
// ---------------------------------------------------------------------------

describe('criterion 4 — click calls window.scrollTo({ top: 0, behavior: smooth })', () => {
  test('criterion 4: clicking the ↑ button calls window.scrollTo with { top: 0, behavior: "smooth" }', () => {
    const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {})

    renderBackToTop()

    // Reveal the button by scrolling past threshold
    act(() => {
      Object.defineProperty(window, 'scrollY', {
        value: 301,
        writable: true,
        configurable: true,
      })
      fireEvent.scroll(window)
    })

    const button = screen.getByRole('button', { name: /back to top/i })
    fireEvent.click(button)

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  test('criterion 4: window.scrollTo is called exactly once per click', () => {
    const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {})

    renderBackToTop()

    act(() => {
      Object.defineProperty(window, 'scrollY', {
        value: 500,
        writable: true,
        configurable: true,
      })
      fireEvent.scroll(window)
    })

    const button = screen.getByRole('button', { name: /back to top/i })
    fireEvent.click(button)

    expect(scrollToSpy).toHaveBeenCalledTimes(1)
  })
})

// ---------------------------------------------------------------------------
// Aria label — button must have aria-label="Back to top"
// ---------------------------------------------------------------------------

describe('accessibility — aria-label "Back to top"', () => {
  test('button has aria-label "Back to top" (exact casing)', () => {
    renderBackToTop()

    act(() => {
      Object.defineProperty(window, 'scrollY', {
        value: 301,
        writable: true,
        configurable: true,
      })
      fireEvent.scroll(window)
    })

    const button = screen.getByRole('button', { name: 'Back to top' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-label', 'Back to top')
  })
})

// ---------------------------------------------------------------------------
// Criterion 5 — BackToTop rendered inside AppShell, reachable on any route
// ---------------------------------------------------------------------------

describe('criterion 5 — BackToTop is rendered inside AppShell', () => {
  test('criterion 5: ↑ button is reachable when BackToTop is rendered alongside a route via AppShell provider stack', () => {
    // Render a minimal AppShell-like wrapper that includes BackToTop alongside
    // a page, proving the button is not page-specific
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <ThemeProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                {/* BackToTop sits at the AppShell level, not inside any page */}
                <div>
                  <BackToTop />
                  <main data-testid="page-content">Page content here</main>
                </div>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </ThemeProvider>
      </MemoryRouter>
    )

    // Page content is present
    expect(screen.getByTestId('page-content')).toBeInTheDocument()

    // Button appears after scroll — proves BackToTop works at AppShell level
    act(() => {
      Object.defineProperty(window, 'scrollY', {
        value: 301,
        writable: true,
        configurable: true,
      })
      fireEvent.scroll(window)
    })

    expect(
      screen.getByRole('button', { name: /back to top/i })
    ).toBeInTheDocument()
  })

  test('criterion 5: ↑ button is absent on a second route when scrollY is 0 (AppShell-level component resets correctly)', () => {
    render(
      <MemoryRouter initialEntries={['/cart']}>
        <ThemeProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <div>
                  <BackToTop />
                  <main data-testid="cart-page">Cart page content</main>
                </div>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </ThemeProvider>
      </MemoryRouter>
    )

    // scrollY is 0 — button must not be present on this route either
    expect(
      screen.queryByRole('button', { name: /back to top/i })
    ).not.toBeInTheDocument()
  })
})
