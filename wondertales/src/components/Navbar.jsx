import React from 'react'
import ProfileInfo from './ProfileInfo'
import { Link, useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar'

const Navbar = ({ userInfo, searchQuery, setSearchQuery, onSearchNote, handleClearSearch }) => {
    const isToken = !!localStorage.getItem('token')
    const navigate = useNavigate();

    const onLogOut = () => {
        localStorage.clear();
        navigate("/login")
    }
    const handleSearch = () => {
        if (searchQuery) {
            onSearchNote(searchQuery);
        }
    }
    const onClearSearch = () => {
        handleClearSearch();
        setSearchQuery('')
    }
    return (
        <div className="bg-white dark:bg-gray-900 flex items-center justify-between px-6 py-3 shadow-md sticky top-0 z-20 transition-all">
            {/* Logo */}
            <Link to="/" className="text-blue-500 dark:text-blue-400 font-bold text-2xl">
                WonderTales
            </Link>

            {/* Search Bar (Hidden on Small Screens) */}
            <div className="hidden sm:flex flex-1 justify-center">
                <SearchBar
                    value={searchQuery}
                    onChange={({ target }) => setSearchQuery(target.value)}
                    handleSearch={handleSearch}
                    onClearSearch={onClearSearch}
                />
            </div>

            {/* Profile Info / Login */}
            <div className="flex items-center space-x-4">
                {isToken ? (
                    <ProfileInfo userInfo={userInfo} onLogOut={onLogOut} />
                ) : (
                    <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-all">
                        Login
                    </Link>
                )}

                {/* Mobile Search Button (For Small Screens) */}
                <button className="sm:hidden text-gray-700 dark:text-gray-300" onClick={handleSearch}>
                    🔍
                </button>
            </div>
        </div>

    )
}

export default Navbar
