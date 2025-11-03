import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import type { UserCardData } from '../utils/types';
import { UserList } from './UserList';
import '@testing-library/jest-dom';

// Données de mock de base
const mockUsers: UserCardData[] = [
    { appId: 'a1', id: 101, login: 'octocat', avatar_url: 'url1', html_url: 'link1', type: 'User' },
    { appId: 'b2', id: 102, login: 'github', avatar_url: 'url2', html_url: 'link2', type: 'Organization' },
    { appId: 'c3', id: 103, login: 'gemini', avatar_url: 'url3', html_url: 'link3', type: 'User' },
];

describe('UserList', () => {

    it('should render a list of UserCards correctly', () => {
        render(
            <UserList 
                users={mockUsers} 
                loading={false} 
                error={null} 
                searchTerm="test" 
            />
        );

        expect(screen.getAllByRole('checkbox')).toHaveLength(3);
        expect(screen.getByText('octocat')).toBeInTheDocument();
        expect(screen.getByText('github')).toBeInTheDocument();
        expect(screen.getByText('gemini')).toBeInTheDocument();
        expect(screen.getByText('3 résultats trouvés.')).toBeInTheDocument();
    });

    it('should display loading message when loading is true', () => {
        render(
            <UserList 
                users={[]} 
                loading={true} 
                error={null} 
                searchTerm="octo" 
            />
        );

        expect(screen.getByText(/Recherche en cours pour "octo"/i)).toBeInTheDocument();
        expect(screen.queryByText('octocat')).not.toBeInTheDocument();
    });

    it('should display error message when error is not null', () => {
        const errorMessage = 'Rate Limit dépassé.';
        render(
            <UserList 
                users={[]} 
                loading={false} 
                error={errorMessage} 
                searchTerm="o" 
            />
        );

        expect(screen.getByText(/Erreur lors de la recherche GitHub/i)).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    it('should display no results message for valid search term but empty results', () => {
        render(
            <UserList 
                users={[]} 
                loading={false} 
                error={null} 
                searchTerm="notfounduser" 
            />
        );

        expect(screen.getByText(/Aucun utilisateur trouvé pour "notfounduser"/i)).toBeInTheDocument();
    });
    
    it('should manage user selection via checkbox and update count', () => {
        render(
            <UserList 
                users={mockUsers} 
                loading={false} 
                error={null} 
                searchTerm="test" 
            />
        );
        
        expect(screen.queryByText('(1 sélectionné)')).not.toBeInTheDocument();
        
        const firstCheckbox = screen.getByLabelText('Sélectionner l\'utilisateur octocat');
        fireEvent.click(firstCheckbox);
        
        expect(firstCheckbox).toBeChecked();
        expect(screen.getByText('(1 sélectionné)')).toBeInTheDocument();

        const secondCheckbox = screen.getByLabelText('Sélectionner l\'utilisateur github');
        fireEvent.click(secondCheckbox);
        
        expect(secondCheckbox).toBeChecked();
        expect(screen.getByText('(2 sélectionnés)')).toBeInTheDocument();

        fireEvent.click(firstCheckbox);

        expect(firstCheckbox).not.toBeChecked();
        expect(screen.getByText('(1 sélectionné)')).toBeInTheDocument();
    });
});
