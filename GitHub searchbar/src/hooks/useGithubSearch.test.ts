import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGithubSearch } from "./useGithubSearch";
import { renderHook, waitFor } from "@testing-library/react";

import type { GithubSearchResponse, GithubUser, UserCardData } from "../utils/types";

vi.mock('./useDebounce', () => ({
    useDebounce: (value: string) => value,
}));

const mockUser: GithubUser = {
    id: 1,
    login: "testLogin",
    avatar_url: "testAvatarUrl",
    html_url: "testHtmlUrl",
    type: "testType",
};

const mockUserCardData: UserCardData = {
    ...mockUser,
    appId: "testAppId-1234-5678-9012-345678901234",
};

const mockSuccessResponse: GithubSearchResponse = {
    total_count: 1,
    incomplete_results: false,
    items: [mockUserCardData],
};

vi.mock("../api/github", () => ({
    // searchUsers renvoie directement la promesse de succès fixe
    searchUsers: () => Promise.resolve(mockSuccessResponse),
}));

beforeEach(() => {
    vi.spyOn(crypto, "randomUUID").mockReturnValue("testAppId-1234-5678-9012-345678901234" as `${string}-${string}-${string}-${string}-${string}`);
});

describe("useGithubSearch", () => {
    it("should perform a search when searchTerm changes", async () => {
        
        const { result } = renderHook(() => useGithubSearch("test"));
        
        expect(result.current.users).toEqual([]);
        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBeNull();

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.users).toEqual(mockSuccessResponse.items);
        expect(result.current.error).toBeNull();
    });
});