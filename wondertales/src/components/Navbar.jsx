import React from 'react'
import ProfileInfo from './ProfileInfo'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ userInfo }) => {
    const isToken = localStorage.getItem('token')
    const navigate = useNavigate();

    const onLogOut = () => {
        localStorage.clear();
        navigate("/login")
    }
    return (
        <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10'>
            {/* logo */}
            <img src="" alt="" />
            {isToken && <ProfileInfo userInfo={userInfo} onLogOut={onLogOut} />}
        </div>
    )
}

export default Navbar
