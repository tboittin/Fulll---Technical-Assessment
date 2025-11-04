import { useEffect, useState } from 'react';

import { SearchInput } from './component/SearchInput';
import { UserList } from './component/UserList';
import { useGithubSearch } from './hooks/useGithubSearch';

import type { UserCardData } from './utils/types';

import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const { users, loading, error } = useGithubSearch(searchQuery);
  const [usersList, setUsersList] = useState<UserCardData[]>([]);

  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  const handleDeleteSelection = () => {
    if (selectedUsers.size === 0) {
      return
    }
    const usersListCopy = usersList.filter(user => !selectedUsers.has(user.appId));
    setUsersList(usersListCopy);
    setSelectedUsers(new Set());
  };

  const handleDuplicateSelection = () => {
    if (selectedUsers.size === 0) {
      return
    }
    let usersListCopy = [...usersList];
    selectedUsers.forEach((appId) => {
      const index = usersListCopy.findIndex((user) => user.appId === appId);
      if (index !== -1) {
        usersListCopy.push({
          ...usersListCopy[index],
          appId: usersListCopy[index].appId + "_duplicate_" + Date.now(),
        })
      }
    })
    setUsersList(usersListCopy);
    setSelectedUsers(new Set());
  }

  useEffect(() => {
    setUsersList(users);
    setSelectedUsers(new Set());
  }, [users]);

  return (
    <>
      <header>
        <h1>Github Search</h1>
      </header>

      <div className="search-container">
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isLoading={loading}
        />
      </div>

      <UserList
        users={usersList}
        loading={loading}
        error={error}
        searchTerm={searchQuery}
        handleDeleteSelection={handleDeleteSelection}
        handleDuplicateSelection={handleDuplicateSelection}
        setSelectedUsers={setSelectedUsers}
        selectedUsers={selectedUsers}
      />
    </>
  );
}

export default App;

