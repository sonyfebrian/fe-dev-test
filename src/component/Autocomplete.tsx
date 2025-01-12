import { useState, useEffect, useRef } from 'react';
import { IUsers, IAutocompleteProps } from '../types/types';
import Swal from 'sweetalert2'

const Autocomplete = ({ placeholder = 'Search users...', onSelect }: IAutocompleteProps) => {
    const [query, setQuery] = useState('');
  const [users, setUsers] = useState<IUsers[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const fetchUsers = async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setUsers([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://dummyjson.com/users/search?q=${searchQuery}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError('An error occurred while fetching users');
      console.error(err);
      setUsers([]);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'error fetch data',
      })
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUsers(query);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleSelectUser = (user: IUsers) => {
    onSelect(user);
    setQuery('');
    setUsers([]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prevIndex) => Math.min(prevIndex + 1, users.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectUser(users[selectedIndex]);
    }
  };

  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLLIElement;
      selectedElement.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);


  return (
    <div className="relative w-full max-w-md p-4">
         <h1 className="text-2xl font-bold mb-4">Autocomplete User Data</h1>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {loading && <div className="absolute right-5 top-2/3 animate-spin">⌛</div>}
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {users.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {users.map((user, index) => (
            <li
              key={user.id}
              onClick={() => handleSelectUser(user)}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                index === selectedIndex ? 'bg-blue-100' : ''
              }`}
            >
              <div className="font-semibold">{`${user.firstName} ${user.lastName}`}</div>
              <div className="text-sm text-gray-600">{user.email}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Autocomplete