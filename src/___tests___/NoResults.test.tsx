import React from 'react';
import { render, screen } from '@testing-library/react';
import { NoResults } from '../components/AutoComplete/NoResults';

test('renders the NoResults component', () => {
  render(<NoResults />);
  const noResultsElement = screen.getByTestId('no-results');
  expect(noResultsElement).toBeInTheDocument();
  expect(noResultsElement).toHaveTextContent('No results found');
});
