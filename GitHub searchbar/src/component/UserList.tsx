import type { UserCardData } from "../utils/types";
import styles from "./UserList.module.css";
import { UserCard } from "./UserCard";
import { useEffect, useRef, useState } from "react";
import deleteIcon from "../assets/delete.svg";
import duplicateIcon from "../assets/duplicate.svg";

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
    const [editMode, setEditMode] = useState(false);

    const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

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

    const handleListDisplay = () => {
        if (loading) {
            return (
                <div className={styles.loadingMessage}>
                    <p>Searching for "{searchTerm}"...</p>
                </div>
            )
        }

        if (error) {
            return (
                <div className={styles.errorMessage}>
                    <p>{error}</p>
                </div>
            )
        }

        if (users.length === 0 && searchTerm.length > 0) {
            return (
                <div className={styles.noResultsMessage}>
                    <p>No user match for "{searchTerm}".</p>
                </div>
            )
        }

        if (users.length > 0) {
            return (
                <div className={styles.list}>
                    {users.map(user => (
                        <UserCard
                            key={user.appId}
                            user={user}
                            isSelected={selectedUsers.has(user.appId)}
                            onSelect={handleSelect}
                            editMode={editMode}
                        />
                    ))}
                </div>
            )
        }
    }

    const handleSelectAllOrNone = () => {
        if (selectAllCheckboxRef.current) {
            if (selectAllCheckboxRef.current.checked) {
                handleSelectAll();
            } else {
                handleSelectNone();
            }
        }
    };

    useEffect(() => {
        if (selectAllCheckboxRef.current) {
            const numSelected = selectedUsers.size;
            const numTotal = users.length;

            if (numSelected === 0) {
                selectAllCheckboxRef.current.checked = false;
                selectAllCheckboxRef.current.indeterminate = false;
            } else if (numSelected === numTotal) {
                selectAllCheckboxRef.current.checked = true;
                selectAllCheckboxRef.current.indeterminate = false;
            } else {
                selectAllCheckboxRef.current.checked = false;
                selectAllCheckboxRef.current.indeterminate = true;
            }
        }
    }, [selectedUsers, users]);

    return (
        <div className={styles.container}>
            <div className={styles.listHeader}>
                <div>
                    <button onClick={() => setEditMode(!editMode)} className={`${styles.editButton} ${editMode ? styles.editButtonActive : styles.editButtonInactive}`}>
                        {editMode ? 'Edit mode on' : 'Edit mode off'}
                    </button>
                </div>
                {editMode && (
                    <div className={styles.buttonContainer}>
                        <div className={styles.selectBox}>
                            <input
                                type="checkbox"
                                ref={selectAllCheckboxRef}
                                onChange={handleSelectAllOrNone}
                                aria-label="Select all users"
                            />
                            {selectedUsers.size > 0 && (
                                <span className={styles.selectionCount}>
                                    <b>{selectedUsers.size}</b> element{selectedUsers.size > 1 ? 's' : ''} selected
                                </span>
                            )}
                        </div>
                        <div className={styles.actionButtons}>
                            <button onClick={() => handleDuplicateSelection()} className={styles.clearButton}>
                                <img src={duplicateIcon} className={styles.icon} alt="Duplicate" />
                            </button>
                            <button
                                onClick={() => handleDeleteSelection()}
                                className={styles.clearButton}
                                disabled={selectedUsers.size === 0}
                            >
                                <img src={deleteIcon} className={styles.icon} alt="Delete" />
                            </button>
                        </div>
                    </div>
                )
                }
            </div>
            {handleListDisplay()}
        </div >
    );
}