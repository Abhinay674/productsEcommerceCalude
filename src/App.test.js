import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the app with ShopReact brand', () => {
  render(<App />);
  const brandElement = screen.getByText(/ShopReact/i);
  expect(brandElement).toBeInTheDocument();
});
