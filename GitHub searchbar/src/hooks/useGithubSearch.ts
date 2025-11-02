import { useEffect, useState } from "react";
import { searchUsers } from "../api/github";
import type { GithubUser, UserCardData } from "../utils/types";


const mapUsersToCardData = (users: GithubUser[]): UserCardData[] => {
    return users.map(user => ({
        ...user,
        appId: crypto.randomUUID(),
    }));
};

export const useGithubSearch = (searchTerm: string) => {
    const [users, setUsers] = useState<GithubUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const performSearch = async (searchTerm: string) => {

        if (!searchTerm) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await searchUsers(searchTerm);
            setUsers(mapUsersToCardData(data.items));
        } catch (error) {
            setError("Failed to fetch users");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        performSearch(searchTerm);
    }, [searchTerm, performSearch]);

    return {
        users,
        loading,
        error,
    };
}