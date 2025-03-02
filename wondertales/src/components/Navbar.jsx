import React from 'react'
import ProfileInfo from './ProfileInfo'
import { useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar'

const Navbar = ({ userInfo, searchQuery, setSearchQuery, onSearchNote, handleClearSearch }) => {
    const isToken = localStorage.getItem('token')
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
        <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10'>
            {/* logo */}
            <img src="" alt="" className='h-9' />
            <SearchBar
                value={searchQuery}
                onChange={({ target }) => setSearchQuery(target.value)}
                handleSearch={handleSearch}
                onClearSearch={onClearSearch}
            />

            {isToken && <ProfileInfo userInfo={userInfo} onLogOut={onLogOut} />}
        </div>
    )
}

export default Navbar
