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