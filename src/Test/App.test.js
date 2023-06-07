import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders Employee Directory heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Employee Directory/i);
  expect(headingElement).toBeInTheDocument();
});

