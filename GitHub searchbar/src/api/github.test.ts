import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GithubSearchResponse } from '../utils/types';
import { searchUsers } from './github';

const mockFetch = vi.spyOn(globalThis, 'fetch');

const mockSuccessData: GithubSearchResponse = {
    total_count: 1,
    incomplete_results: false,
    items: [
        {
            id: 1,
            login: 'testuser',
            avatar_url: 'http://example.com/avatar',
            html_url: 'http://github.com/testuser',
            type: 'User',
        },
    ],
}

beforeEach(() => {
    mockFetch.mockClear();
});

describe('searchUsers', () => {
    it('should return users when query is not empty', async () => {

        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: () => Promise.resolve(mockSuccessData),
            headers: new Headers(),
        } as Response);

        const result = await searchUsers('testuser');

        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledWith('https://api.github.com/search/users?q=testuser');
        expect(result).toEqual(mockSuccessData);

    })

    it('should return an empty array when query is empty', async () => {
        const result = await searchUsers('');
        expect(result).toEqual({
            "incomplete_results": false,
            "items": [],
            "total_count": 0,
        });
    });

    it("should throw an Rate Limit error when status code is 403", async () => {

        const mockResetTime = (50).toString();

        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 403,
            json: async () => ({ message: 'API rate limit exceeded' }),
            headers: new Headers({ 'X-RateLimit-Reset': mockResetTime }),
        } as Response);

        await expect(searchUsers('longquery')).rejects.toThrow('Rate limit exceeded. Please try again in 50 seconds');

        expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should throw an API error when status code is 404', async () => {
        
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            statusText: 'Not Found',
            json: async () => ({ message: 'Not Found' }),
            headers: new Headers(),
        } as Response);

        await expect(searchUsers('notfoundquery')).rejects.toThrow('API error (404): Not Found');

        expect(mockFetch).toHaveBeenCalledTimes(1);
    });
});