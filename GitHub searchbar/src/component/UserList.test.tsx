import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, type Mock } from 'vitest';
import type { UserCardData } from '../utils/types';
import { UserList } from './UserList';
import '@testing-library/jest-dom';


vi.mock('./UserCard', () => ({
    UserCard: vi.fn(({ user, isSelected, onSelect }) => (
        <div data-testid={`user-card-${user.appId}`} onClick={() => onSelect(user.appId)}>
            <span>{user.login}</span>
            <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(user.appId)}
                data-testid={`checkbox-${user.appId}`}
            />
        </div>
    )),
}));

const mockUsers: UserCardData[] = [
    { appId: 'a1', id: 101, login: 'octocat', avatar_url: 'url1', html_url: 'link1', type: 'User' },
    { appId: 'b2', id: 102, login: 'github', avatar_url: 'url2', html_url: 'link2', type: 'Organization' },
    { appId: 'c3', id: 103, login: 'gemini', avatar_url: 'url3', html_url: 'link3', type: 'User' },
];

const setupProps = (overrides: Partial<React.ComponentProps<typeof UserList>> = {}) => ({
    users: mockUsers,
    loading: false,
    error: null,
    searchTerm: 'test',
    handleDeleteSelection: vi.fn(),
    handleDuplicateSelection: vi.fn(),
    setSelectedUsers: vi.fn(),
    selectedUsers: new Set<string>(),
    ...overrides,
});

describe('UserList', () => {

    it('should display loading message when loading is true', () => {
        render(<UserList {...setupProps({ users: [], loading: true })} />);
        expect(screen.getByText(/Searching for "test".../i)).toBeInTheDocument();
        expect(screen.queryByText('user1')).not.toBeInTheDocument();
    });

    it('should display error message when error is not null', () => {
        const errorMessage = 'Rate Limit reached.';
        render(<UserList {...setupProps({ users: [], error: errorMessage })} />);
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
        expect(screen.queryByText('user1')).not.toBeInTheDocument();
    });

    it('should display no results message for valid search term but empty results', () => {
        render(<UserList {...setupProps({ users: [], searchTerm: 'nonexistent' })} />);
        expect(screen.getByText(/No user match for "nonexistent"./i)).toBeInTheDocument();
    });


    it('should display nothing when users.length is 0 and searchTerm is empty', () => {
        render(<UserList {...setupProps({ users: [], searchTerm: '' })} />);

        expect(screen.queryByText(/No user match/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Searching for/i)).not.toBeInTheDocument();
    });

    it('should display the list of users and the "Edit mode off" button by default', () => {
        render(<UserList {...setupProps()} />);
        expect(screen.queryAllByTestId(/user-card/i)).toHaveLength(mockUsers.length);
        expect(screen.getByRole('button', { name: /Edit mode off/i })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Select All/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Delete/i })).not.toBeInTheDocument();
    });

    it('should toggle edit mode and display action buttons', () => {
        render(<UserList {...setupProps()} />);

        const editButton = screen.getByRole('button', { name: /Edit mode off/i });
        fireEvent.click(editButton);

        expect(screen.getByRole('checkbox', { name: /Select all users/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Delete selected users/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Duplicate selected users/i })).toBeInTheDocument();

        const editModeOnButton = screen.getByRole('button', { name: /Edit mode on/i });
        fireEvent.click(editModeOnButton);

        expect(screen.getByRole('button', { name: /Edit mode off/i })).toBeInTheDocument();

        expect(screen.queryByRole('checkbox', { name: /Select all users/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Delete selected users/i })).not.toBeInTheDocument();
    });

    it('should display selection count and call handlers appropriately', () => {
        const { handleDeleteSelection, handleDuplicateSelection } = setupProps();
        const selectedUsers = new Set(['a1', 'c3']);

        render(<UserList {...setupProps({ selectedUsers, handleDeleteSelection, handleDuplicateSelection })} />);

        fireEvent.click(screen.getByRole('button', { name: /Edit mode off/i }));

        const deleteButton = screen.getByRole('button', { name: /Delete selected users/i });
        fireEvent.click(deleteButton);
        expect(handleDeleteSelection).toHaveBeenCalledTimes(1);

        const duplicateButton = screen.getByRole('button', { name: /Duplicate selected users/i });
        fireEvent.click(duplicateButton);
        expect(handleDuplicateSelection).toHaveBeenCalledTimes(1);
    });

    it('should call setSelectedUsers with all IDs when clicking "Select All" icon', () => {
        const { setSelectedUsers } = setupProps({ selectedUsers: new Set(['a1']) });
        render(<UserList {...setupProps({ setSelectedUsers, selectedUsers: new Set(['a1']) })} />);

        fireEvent.click(screen.getByRole('button', { name: /Edit mode off/i }));

        const selectAllCheckbox = screen.getByRole('checkbox', { name: /Select all users/i });
        fireEvent.click(selectAllCheckbox);

        const setSelectedUsersMock = setSelectedUsers as Mock;
        expect(setSelectedUsersMock).toHaveBeenCalledTimes(1);
        const calledSet = setSelectedUsersMock.mock.calls[0][0] as Set<string>;
        expect(calledSet.size).toBe(3);
        expect(calledSet).toEqual(new Set(['a1', 'b2', 'c3']));
    });
});
