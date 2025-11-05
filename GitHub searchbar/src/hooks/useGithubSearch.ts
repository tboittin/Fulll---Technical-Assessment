import { useEffect, useState } from "react";
import { searchUsers } from "../api/github";
import type { GithubUser, UserCardData } from "../utils/types";
import { useDebounce } from "./useDebounce";

const DEBOUNCE_DELAY_MS = 500;

const mapUsersToCardData = (users: GithubUser[]): UserCardData[] => {
    return users.map(user => ({
        ...user,
        appId: crypto.randomUUID(),
    }));
};

/**
 * @description
 * Custom hook to manage searching the GitHub user API.
 * 
 * This hook encapsulates the following logic:
 * - Debounces the search term to prevent excessive API calls.
 * - Manages the state for `users`, `loading`, and `error`.
 * - Fetches data from the `searchUsers` API.
 * - Maps the API response to the `UserCardData` format.
 * - Handles request cleanup (cancellation) to prevent race conditions
 *   if the search term changes before a request completes.
 *
 * @param {string} searchTerm The search query string, typically from an input field.
 *
 * @returns {{
 *   users: UserCardData[],
 *   loading: boolean,
 *   error: string | null
 * }}
 * An object containing the search results, loading state, and error state.
 */
export const useGithubSearch = (searchTerm: string) => {
    const [users, setUsers] = useState<UserCardData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY_MS);

    useEffect(() => {

        setLoading(true);
        setError(null);

        let isCancelled = false;

        const performSearch = async () => {

            try {
                const data = await searchUsers(debouncedSearchTerm);

                if (!isCancelled) {
                    const cardData = mapUsersToCardData(data.items);
                    setUsers(cardData);
                }
            } catch (error) {
                if (!isCancelled) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    console.error("Error from github api :", errorMessage);
                    setError(errorMessage);
                    setUsers([]);
                }
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }

        };
        performSearch();

        return () => {
            isCancelled = true;
        };
    }, [debouncedSearchTerm]);

    return {
        users,
        loading,
        error,
    };
}