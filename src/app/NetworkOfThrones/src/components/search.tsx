import { useState, FormEvent } from 'react';

const Search = (): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // add your search logic here
  }

  return (
    <form onSubmit={handleSearch} className="flex items-center bg-white border border-gray-200 px-3 shadow-lg rounded-3xl">
      <input type="text" className="w-full outline-none bg-white text-gray-500 p-1 text-lg placeholder-gray-400" value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit" className="outline-none focus:outline-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M22 22l-6-6"></path>
          <circle cx="10" cy="10" r="8"></circle>
        </svg>
      </button>
    </form>
  );
};

export default Search;
