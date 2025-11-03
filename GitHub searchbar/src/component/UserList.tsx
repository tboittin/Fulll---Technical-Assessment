import type { UserCardData } from "../utils/types";
import styles from "./UserList.module.css";
import { UserCard } from "./UserCard";

interface UserListProps {
    users: UserCardData[];
    loading: boolean;
    error: string | null;
    searchTerm: string;
    handleDeleteSelection: () => void;
    handleDuplicateSelection: () => void;
    setSelectedUsers: React.Dispatch<React.SetStateAction<Set<string>>>;
    selectedUsers: Set<string>;
}

export const UserList = ({ users, loading, error, searchTerm, handleDeleteSelection, handleDuplicateSelection, setSelectedUsers, selectedUsers }: UserListProps) => {

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

    const handleSelectAll = () => {
        setSelectedUsers(new Set(users.map(user => user.appId)));
    };

    const handleSelectNone = () => {
        setSelectedUsers(new Set());
    };

    return (
        <div className={styles.container}>
            <div className={styles.resultsHeader}>
                {selectedUsers.size > 0 && (
                    <span className={styles.selectionCount}>
                        {selectedUsers.size} element{selectedUsers.size > 1 ? 's' : ''} selected
                    </span>
                )}
                {selectedUsers.size === users.length ?
                    <button onClick={() => handleSelectNone()} className={styles.clearButton}>
                        Select None
                    </button>
                    :
                    <button onClick={() => handleSelectAll()} className={styles.clearButton}>
                        Select All
                    </button>
                }
                <button onClick={() => handleDeleteSelection()} className={styles.clearButton}>
                    Delete
                </button>
                <button onClick={() => handleDuplicateSelection()} className={styles.clearButton}>
                    Duplicate
                </button>
            </div>

            <div className={styles.list}>
                {
                    loading &&
                    !error &&
                    users.length === 0 && (
                        <div className={styles.container}>
                            <div className={styles.loadingMessage}>
                                <p>Searching for "{searchTerm}"...</p>
                            </div>
                        </div>
                    )}

                {
                    !loading &&
                    !error &&
                    users.length === 0 &&
                    searchTerm.length > 0 && (
                        <div className={styles.container}>
                            <div className={styles.noResultsMessage}>
                                <p>No user match for "{searchTerm}".</p>
                            </div>
                        </div>
                    )}

                {
                    !loading &&
                    error && (
                        <div className={styles.container}>
                            <div className={styles.errorMessage}>
                                <p>{error}</p>
                            </div>
                        </div>
                    )}

                {
                    !loading &&
                    !error &&
                    users.length > 0 &&
                    users.map(user => (
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