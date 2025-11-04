import type { UserCardData } from "../utils/types";
import styles from "./UserCard.module.css";

interface UserCardProps {
    user: UserCardData,
    isSelected: boolean,
    onSelect: (appId: string) => void,
    editMode: boolean
}

export const UserCard = ({ user, isSelected, onSelect, editMode }: UserCardProps) => {

    const handleSelect = () => {
        onSelect(user.appId);
    };

    const cardSelectedClass = `${styles.card} ${isSelected ? styles.selected : ''}`;

    const cropLogin = (login: string) => login.length > 10 ? `${login.slice(0, 10)}...` : login;
    
    return (
        <div className={cardSelectedClass}>
            {editMode && (
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={handleSelect}
                    className={styles.checkbox}
                    aria-label={`Sélectionner l'utilisateur ${user.login}`}
                />
            )}
            <img
                src={user.avatar_url}
                alt={`Avatar de ${user.login}`}
                className={styles.avatar}
            />
            <div className={styles.identification}>
                <p>{user.id}</p>
                <p>{cropLogin(user.login)}</p>
            </div>
            <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkContainer}
            >
                <button className={styles.link}>View Profile</button>
            </a>
        </div>
    );
};