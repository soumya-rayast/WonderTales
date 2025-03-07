import React from 'react'
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from 'react-icons/io';

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div
      className="w-full sm:w-80 flex items-center px-4 bg-slate-100 dark:bg-gray-800 rounded-lg shadow-sm transition-all"
      onClick={() => document.getElementById('searchInput').focus()}
    >
      {/* Search Input */}
      <input
        id="searchInput"
        type="text"
        placeholder="Search Notes"
        className="w-full text-sm bg-transparent py-2 outline-none dark:text-white"
        value={value}
        onChange={onChange}
      />

      {/* Clear Button */}
      {value && (
        <IoMdClose
          className="text-lg text-gray-500 dark:text-gray-400 cursor-pointer hover:text-black dark:hover:text-white transition-all mr-3"
          onClick={onClearSearch}
        />
      )}

      {/* Search Icon */}
      <FaSearch
        className="text-gray-400 dark:text-gray-300 cursor-pointer hover:text-black dark:hover:text-white transition-all"
        onClick={handleSearch}
      />
    </div>
  )
}

export default SearchBar
