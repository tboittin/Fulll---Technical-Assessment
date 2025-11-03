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


    //TODO: 
    // it('should call setSelectedUsers to toggle individual selection', () => {
    //     const { setSelectedUsers } = setupProps();
    //     render(<UserList {...setupProps({ setSelectedUsers })} />);

    //     const checkbox1 = screen.getByRole('checkbox', { name: 'user1' });
    //     fireEvent.click(checkbox1);

    //     const setSelectedUsersMock = setSelectedUsers as Mock;

    //     expect(setSelectedUsersMock).toHaveBeenCalledTimes(1);
    //     expect(typeof setSelectedUsersMock.mock.calls[0][0]).toBe('function');
    // });

    it('should display selection count when there are the correct amount of selected users', () => {
        const selectedUsers = new Set(['app1', 'app3']);
        render(<UserList {...setupProps({ selectedUsers })} />);

        expect(screen.getByText('2 elements selected')).toBeInTheDocument();
    });

    it('should call setSelectedUsers with all IDs when "Select All" is clicked', () => {
        const { setSelectedUsers } = setupProps({ selectedUsers: new Set(['app1']) }); // 1/3 sélectionné
        render(<UserList {...setupProps({ setSelectedUsers, selectedUsers: new Set(['app1']) })} />);

        const selectAllButton = screen.getByRole('button', { name: /Select All/i });
        fireEvent.click(selectAllButton);

        const setSelectedUsersMock = setSelectedUsers as Mock;

        expect(setSelectedUsersMock).toHaveBeenCalledTimes(1);
        const calledSet = setSelectedUsersMock.mock.calls[0][0] as Set<string>;
        expect(calledSet.size).toBe(3);
        expect(calledSet).toEqual(new Set(['a1', 'b2', 'c3']));
    });

    it('should call setSelectedUsers with an empty Set when "Select None" is clicked', () => {
        const { setSelectedUsers } = setupProps({ selectedUsers: new Set(['app1', 'app2', 'app3']) }); // Tout sélectionné
        render(<UserList {...setupProps({ setSelectedUsers, selectedUsers: new Set(['app1', 'app2', 'app3']) })} />);

        const selectNoneButton = screen.getByRole('button', { name: /Select None/i });
        fireEvent.click(selectNoneButton);

        const setSelectedUsersMock = setSelectedUsers as Mock;

        expect(setSelectedUsersMock).toHaveBeenCalledTimes(1);
        const calledSet = setSelectedUsersMock.mock.calls[0][0] as Set<string>;
        expect(calledSet.size).toBe(0);
    });

    it('should call handleDeleteSelection when "Delete" is clicked', () => {
        const { handleDeleteSelection } = setupProps();
        render(<UserList {...setupProps({ handleDeleteSelection })} />);

        const deleteButton = screen.getByRole('button', { name: /Delete/i });
        fireEvent.click(deleteButton);

        expect(handleDeleteSelection).toHaveBeenCalledTimes(1);
    });

    it('should call handleDuplicateSelection when "Duplicate" is clicked', () => {
        const { handleDuplicateSelection } = setupProps();
        render(<UserList {...setupProps({ handleDuplicateSelection })} />);

        const duplicateButton = screen.getByRole('button', { name: /Duplicate/i });
        fireEvent.click(duplicateButton);

        expect(handleDuplicateSelection).toHaveBeenCalledTimes(1);
    });
});
