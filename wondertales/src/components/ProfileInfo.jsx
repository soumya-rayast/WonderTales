import React from 'react'
import { getInitials } from '../utils/helper'

const ProfileInfo = ({ userInfo ={}, onLogOut }) => {
    return (
        <div className='flex items-center gap-3'>
            <div className='w-12 h-12 flex items-center justify-center rounded-full text-white bg-blue-400 font-medium bg-slate-100'>
                {getInitials(userInfo?.fullName || "Guest")}
            </div>
            <div>
                <p className='text-sm font-medium'>{userInfo?.fullName || ""}</p>
                <button className='text-sm text-slate-700 underline'
                    onClick={onLogOut}>
                    Logout
                </button>
            </div>
        </div>
    )
}

export default ProfileInfo
