import type { UserCardData } from "../utils/types";
import styles from "./UserCard.module.css";

interface UserCardProps {
    user: UserCardData,
    isSelected: boolean,
    onSelect: (appId: string) => void,
    editMode: boolean
}

/**
 * @description
 * Renders a single user card, displaying their avatar, ID, and login.
 * 
 * This component conditionally displays a checkbox for selection if `editMode`
 * User logins are truncated if they exceed 10 characters.
 *
 * @param {UserCardProps} props The component props.
 * @param {UserCardData} props.user The data object for the user to display.
 * @param {boolean} props.isSelected True if the card is currently selected.
 * @param {(appId: string) => void} props.onSelect Callback function triggered when the checkbox is changed.
 * @param {boolean} props.editMode True if the parent list is in edit mode, enabling the checkbox.
 * @returns {JSX.Element} A user card component.
 */
export const UserCard = ({ user, isSelected, onSelect, editMode }: UserCardProps) => {

    const handleSelect = () => {
        onSelect(user.appId);
    };

    const cropLogin = (login: string) => login.length > 10 ? `${login.slice(0, 10)}...` : login;
    
    return (
        <div className={styles.card}>
            {editMode && (
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={handleSelect}
                    className={styles.checkbox}
                    aria-label={`Select user ${user.login}`}
                />
            )}
            <img
                src={user.avatar_url}
                alt={`${user.login}'s avatar`}
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