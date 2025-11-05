import React, { useEffect, useRef, useState } from 'react';
import style from "./SearchInput.module.css";

interface SearchInputProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    isLoading: boolean;
}

/**
 * @description
 * A controlled input component for handling search queries.
 * 
 * This component manages its own focus state to provide a conditional placeholder
 * (placeholder only visible when empty and not focused).
 * It automatically re-focuses the input
 * field when a search operation (`isLoading`) completes, preventing the user
 * from having to click back into the input.
 *
 * @param {SearchInputProps} props The component props.
 * @param {string} props.searchQuery The current value of the search query (controlled).
 * @param {(query: string) => void} props.setSearchQuery Callback function to update the search query state.
 * @param {boolean} props.isLoading Boolean indicating if a search operation is currently in progress.
 * @returns {JSX.Element} A search input field.
 */
export const SearchInput: React.FC<SearchInputProps> = ({
    searchQuery,
    setSearchQuery,
    isLoading
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const prevIsLoadingRef = useRef(isLoading);

    useEffect(() => {
      if (prevIsLoadingRef.current && !isLoading) {
        inputRef.current?.focus();
      }
      prevIsLoadingRef.current = isLoading;
    }, [isLoading]);
    
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };
    
    return (
    <div className={style.searchContainer}>
      <input
        type="text"
        placeholder={(searchQuery.length === 0 && !isFocused) ? "Search input" : ""}
        value={searchQuery}
        onChange={handleSearchChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="search-input"
        disabled={isLoading}
        ref={inputRef}
      />
    </div>
    );
};
