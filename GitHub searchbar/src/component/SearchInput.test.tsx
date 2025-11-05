import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchInput } from './SearchInput';
import '@testing-library/jest-dom';
import React from 'react';

const mockFocus = vi.fn();

vi.spyOn(React, 'useRef').mockReturnValue({ current: { focus: mockFocus } });

const mockSetSearchQuery = vi.fn();

const setupProps = (overrides: Partial<React.ComponentProps<typeof SearchInput>> = {}) => ({
    searchQuery: 'initial',
    setSearchQuery: mockSetSearchQuery,
    isLoading: false,
    ...overrides,
});

beforeEach(() => {
    mockSetSearchQuery.mockClear();
    mockFocus.mockClear();
});

describe('SearchInput', () => {

    it('should display the search query value passed as prop', () => {
        const testQuery = 'test github';
        render(<SearchInput {...setupProps({ searchQuery: testQuery })} />);

        expect(screen.getByRole('textbox')).toHaveValue(testQuery);
    });

    it('should call setSearchQuery with the new value on input change', () => {
        render(<SearchInput {...setupProps({ searchQuery: '' })} />);
        const input = screen.getByRole('textbox');
        const newQuery = 'new search';

        fireEvent.change(input, { target: { value: newQuery } });

        expect(mockSetSearchQuery).toHaveBeenCalledTimes(1);
        expect(mockSetSearchQuery).toHaveBeenCalledWith(newQuery);
    });

    
    it('should disable the input when isLoading is true', () => {
        render(<SearchInput {...setupProps({ isLoading: true })} />);
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should not disable the input when isLoading is false', () => {
        render(<SearchInput {...setupProps({ isLoading: false })} />);
        expect(screen.getByRole('textbox')).not.toBeDisabled();
    });

});
