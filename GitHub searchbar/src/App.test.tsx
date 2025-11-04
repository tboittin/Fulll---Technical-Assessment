import { describe, vi } from "vitest";
import * as useGithubSearchModule from './hooks/useGithubSearch';
import type { UserCardData } from './utils/types';
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

const mockUsers: UserCardData[] = [
    { appId: 'a1', id: 101, login: 'octocat', avatar_url: 'url1', html_url: 'link1', type: 'User' },
    { appId: 'b2', id: 102, login: 'github', avatar_url: 'url2', html_url: 'link2', type: 'Organization' },
    { appId: 'c3', id: 103, login: 'gemini', avatar_url: 'url3', html_url: 'link3', type: 'User' },
];

const mockUseGithubSearch = vi.spyOn(useGithubSearchModule, 'useGithubSearch');

vi.mock('./component/SearchInput', () => ({
    SearchInput: vi.fn(({ setSearchQuery, isLoading }) => (
        <input
            data-testid="search-input"
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading}
        />
    )),
}));

vi.mock('./component/UserList', () => ({
    UserList: vi.fn(({
        users,
        loading,
        error,
        handleDeleteSelection,
        handleDuplicateSelection,
        setSelectedUsers,
        selectedUsers
    }) => {
        const handleSelectUser1 = () => {
            setSelectedUsers((prev: Set<string>) => {
                const newSet = new Set(prev);
                newSet.has('a1') ? newSet.delete('a1') : newSet.add('a1');
                return newSet;
            });
        };

        return (
            <div data-testid="user-list">
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                {users.map((user: UserCardData) => <div key={user.appId} data-testid={`user-card-${user.appId}`}>{user.login}</div>)}

                <button data-testid="select-user1-btn" onClick={handleSelectUser1}>Select/Unselect user1</button>
                <button data-testid="delete-btn" onClick={handleDeleteSelection} disabled={selectedUsers.size === 0}>Delete</button>
                <button data-testid="duplicate-btn" onClick={handleDuplicateSelection} disabled={selectedUsers.size === 0}>Duplicate</button>
            </div>
        );
    }),
}));

beforeEach(() => {
    mockUseGithubSearch.mockReturnValue({
        users: mockUsers,
        loading: false,
        error: null,
    });
    vi.clearAllMocks();
});

describe('App', () => {
    it('should display users', () => {
        mockUseGithubSearch.mockReturnValueOnce({ users: [], loading: true, error: null });

        render(<App />);

        expect(screen.queryByText('user1')).not.toBeInTheDocument();

        mockUseGithubSearch.mockReturnValue({ users: mockUsers, loading: false, error: null });
        fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'a' } });

        expect(screen.getByText('octocat')).toBeInTheDocument();
        expect(screen.getByText('gemini')).toBeInTheDocument();
    });

    it('should delete selected users', () => {
        mockUseGithubSearch.mockReturnValueOnce({ users: [], loading: true, error: null });

        render(<App />);

        fireEvent.click(screen.getByTestId('select-user1-btn'));

        const deleteButton = screen.getByTestId('delete-btn');
        fireEvent.click(deleteButton);

        expect(screen.queryAllByText('octocat')).toHaveLength(0);
        expect(screen.getByText('gemini')).toBeInTheDocument();
        expect(screen.getByText('github')).toBeInTheDocument();
    });


    it('should duplicate selected users', () => {
        mockUseGithubSearch.mockReturnValueOnce({ users: [], loading: true, error: null });

        render(<App />);

        fireEvent.click(screen.getByTestId('select-user1-btn'));

        const duplicateButton = screen.getByTestId('duplicate-btn');
        fireEvent.click(duplicateButton);

        expect(screen.queryAllByText('octocat')).toHaveLength(2);
        expect(screen.queryAllByText('gemini')).toHaveLength(1);
        expect(screen.queryAllByText('github')).toHaveLength(1);
    });
});

