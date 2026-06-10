import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Foot Zone application', () => {
  render(<App />);
  const appElement = screen.getByText(/Foot Zone/i);
  expect(appElement).toBeInTheDocument();
});
