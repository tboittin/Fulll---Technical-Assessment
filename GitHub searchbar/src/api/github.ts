import type { GithubSearchResponse } from "../utils/types";

// documentation: https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28&versionId=free-pro-team%40latest&restPage=scripting-with-the-rest-api-and-javascript#search-users
const GITHUB_SEARCH_USERS_URL = "https://api.github.com/search/users";

/**
 * @description
 * Fetches a list of users from the GitHub API based on a search query.
 * 
 * This function handles the API request, encodes the query, and manages
 * specific HTTP error cases, such as rate limiting (403) and other
 * server errors.
 *
 * @param {string} query The search term to query the GitHub API with.
 * @returns {Promise<GithubSearchResponse>} A promise that resolves to the raw 
 *          search response from the GitHub API.
 * @throws {Error} Throws an error if the API rate limit is exceeded (403), 
 *                 detailing the reset time if available.
 * @throws {Error} Throws a generic error for other non-ok HTTP responses 
 *                 (e.g., 500, 404).
 */
export const searchUsers = async (query: string): Promise<GithubSearchResponse> => {

    if (!query) {
        return {
            total_count: 0,
            incomplete_results: false,
            items: []
        };
    }

    const encodedQuery = encodeURIComponent(query);

    try {
        const response = await fetch(`${GITHUB_SEARCH_USERS_URL}?q=${encodedQuery}`);

        if (response.status === 403) {
            const rateLimitReset = response.headers.get('X-RateLimit-Reset');
            const resetTime = rateLimitReset ? Math.floor(parseInt(rateLimitReset) - Date.now() / 1000).toLocaleString() : 'inconnu';

            throw new Error(
                "Rate limit exceeded." +
                (resetTime ? " Please try again in " + resetTime + " seconds" : "")
            );
        }

        if (!response.ok) {
            throw new Error(`API error (${response.status}): ${response.statusText || 'Failure to fetch data'}`)
        }

        const data = await response.json();

        return data;
    } catch (error) {
        throw error;
    }
};

