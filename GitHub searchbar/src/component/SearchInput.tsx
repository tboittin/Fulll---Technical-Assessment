import React, { useState } from 'react';
import style from "./SearchInput.module.css";

interface SearchInputProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    isLoading: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
    searchQuery,
    setSearchQuery,
    isLoading
}) => {
    const [isFocused, setIsFocused] = useState(false);

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
      />
      {isLoading && <span className="loading-indicator">Loading...</span>}
    </div>
    );
};
