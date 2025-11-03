import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
    
    // TODO
    // it('should call focus when isLoading changes from true to false', () => {
    //     const { rerender } = render(<SearchInput {...setupProps({ isLoading: true })} />);
    //     expect(mockFocus).not.toHaveBeenCalled();

    //     rerender(<SearchInput {...setupProps({ isLoading: false })} />); 
        
    //     expect(mockFocus).toHaveBeenCalledTimes(1);
    // });

    // it('should not call focus when isLoading changes from false to true', () => {
    //     const { rerender } = render(<SearchInput {...setupProps({ isLoading: false })} />);
    //     expect(mockFocus).not.toHaveBeenCalled();

    //     rerender(<SearchInput {...setupProps({ isLoading: true })} />); 
        
    //     expect(mockFocus).not.toHaveBeenCalled();
    // });

    // it('ne devrait PAS appeler focus si isLoading reste false', () => {
    //     // Étape 1 : Rendu initial avec loading = false
    //     const { rerender } = render(<SearchInput {...setupProps({ isLoading: false })} />);
    //     expect(mockFocus).not.toHaveBeenCalled();

    //     // Étape 2 : Changement d'une autre prop (ici searchQuery)
    //     rerender(<SearchInput {...setupProps({ isLoading: false, searchQuery: 'new' })} />); 
        
    //     // Vérifie que focus n'est pas appelé
    //     expect(mockFocus).not.toHaveBeenCalled();
    // });
});
