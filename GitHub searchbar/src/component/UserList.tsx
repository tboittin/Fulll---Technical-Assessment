import { useState } from "react";
import type { UserCardData } from "../utils/types";
import styles from "./UserList.module.css";
import { UserCard } from "./UserCard";

interface UserListProps {
    users: UserCardData[];
    loading: boolean;
    error: string | null;
    searchTerm: string;
}

export const UserList = ({ users, loading, error, searchTerm }: UserListProps) => {
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

    const handleSelect = (appId: string) => {
        setSelectedUsers(prevSelected => {
            const newSet = new Set(prevSelected)
            if (newSet.has(appId)) {
                newSet.delete(appId)
            } else {
                newSet.add(appId)
            }
            return newSet
        });
    };

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.errorMessage}>
                    <p>⚠️ Erreur lors de la recherche GitHub :</p>
                    <p>{error}</p>
                    <p className={styles.suggestion}>Vérifiez votre connexion ou l'état du service GitHub.</p>
                </div>
            </div>
        );
    }

    
    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingMessage}>
                    <p>Recherche en cours pour "{searchTerm}"...</p>
                </div>
            </div>
        );
    }

        if (users.length === 0 && searchTerm.length >= 3) {
        return (
            <div className={styles.container}>
                <div className={styles.noResultsMessage}>
                    <p>Aucun utilisateur trouvé pour "{searchTerm}".</p>
                    <p className={styles.suggestion}>Essayez un autre terme de recherche.</p>
                </div>
            </div>
        );
    }
    return (
        <div className={styles.container}>
            <div className={styles.resultsHeader}>
                <p>
                    {users.length} résultats trouvés. 
                    {selectedUsers.size > 0 && (
                        <span className={styles.selectionCount}>
                             ({selectedUsers.size} sélectionné{selectedUsers.size > 1 ? 's' : ''})
                        </span>
                    )}
                </p>
            </div>
            
            <div className={styles.list}>
                {users.map(user => (
                    <UserCard 
                        key={user.appId}
                        user={user}
                        isSelected={selectedUsers.has(user.appId)}
                        onSelect={handleSelect}
                    />
                ))}
            </div>
        </div>
    );
}