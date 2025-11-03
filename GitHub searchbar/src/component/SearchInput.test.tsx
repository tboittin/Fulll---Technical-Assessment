import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SearchInput } from './SearchInput';
import '@testing-library/jest-dom';

describe('SearchInput', () => {
    let renderResult: ReturnType<typeof render>;

    let mockSetSearchQuery: (query: string) => void; 
    const placeholderText = 'Search input';

    beforeEach(() => {
        mockSetSearchQuery = vi.fn();
        
        renderResult = render(
            <SearchInput
                searchQuery=""
                setSearchQuery={mockSetSearchQuery}
                isLoading={false}
            />
        );
    });
    
    afterEach(() => {
        renderResult.unmount();
    });

    it('should render with the initial value and placeholder when not focused', () => {
        const inputElement = screen.getByPlaceholderText(placeholderText);

        expect(inputElement).toBeInTheDocument();
        expect(inputElement).toHaveValue('');
        expect(inputElement).not.toBeDisabled();
    });

    it('should call setSearchQuery with the new value on input change', () => {
        const inputElement = screen.getByPlaceholderText(placeholderText);
        const newValue = 'new search term';

        fireEvent.change(inputElement, { target: { value: newValue } });

        expect(mockSetSearchQuery).toHaveBeenCalledTimes(1);
        expect(mockSetSearchQuery).toHaveBeenCalledWith(newValue);
    });

    it('should hide the placeholder when focused and search query is empty', () => {
        const inputElement = screen.getByPlaceholderText(placeholderText);

        fireEvent.focus(inputElement);
        expect(screen.queryByPlaceholderText(placeholderText)).not.toBeInTheDocument();
        expect(inputElement).toBeInTheDocument();
    });

    it('should be disabled when isLoading is true and show a loading indicator', () => {
        renderResult.rerender(
            <SearchInput
                searchQuery="test"
                setSearchQuery={mockSetSearchQuery}
                isLoading={true}
            />
        );

        const inputElement = screen.getByRole('textbox');
        const loadingIndicator = screen.getByText(/Loading.../i);

        expect(inputElement).toBeDisabled();
        expect(loadingIndicator).toBeInTheDocument();
    });

    it('should hide the placeholder when query is NOT empty, even after blur', () => {
        renderResult.rerender(
            <SearchInput
                searchQuery="a"
                setSearchQuery={mockSetSearchQuery}
                isLoading={false}
            />
        );

        expect(screen.queryByPlaceholderText(placeholderText)).not.toBeInTheDocument();

        const inputElement = screen.getByRole('textbox');

        fireEvent.focus(inputElement);
        fireEvent.blur(inputElement);

        expect(screen.queryByPlaceholderText(placeholderText)).not.toBeInTheDocument();
        expect(inputElement).toBeInTheDocument();
    });
});
