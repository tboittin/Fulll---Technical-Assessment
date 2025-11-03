import type { UserCardData } from "../utils/types";
import styles from "./UserCard.module.css";

interface UserCardProps {
    user: UserCardData,
    isSelected: boolean,
    onSelect: (appId: string) => void,
}

export const UserCard = ({ user, isSelected, onSelect }: UserCardProps) => {

    const handleSelect = () => {
        onSelect(user.appId);
    };

    const cardSelectedClass = `${styles.card} ${isSelected ? styles.selected : ''}`;

    return (
        <div className={cardSelectedClass}>
            <input
                type="checkbox"
                checked={isSelected}
                onChange={handleSelect}
                className={styles.checkbox}
                aria-label={`Sélectionner l'utilisateur ${user.login}`}
            />

            <img
                src={user.avatar_url}
                alt={`Avatar de ${user.login}`}
                className={styles.avatar}
            />
            <p className={styles.id}>{user.id}</p>
            <p className={styles.login}>{user.login}</p>
            <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkContainer}
            >
                <div className={styles.info}>
                    <button className={styles.type}>View Profile</button>
                </div>
            </a>
        </div>
    );
};