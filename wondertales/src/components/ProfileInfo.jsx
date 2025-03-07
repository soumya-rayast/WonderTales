import React from 'react'
import { getInitials } from '../utils/helper'

const ProfileInfo = ({ userInfo = {}, onLogOut }) => {
    return (
        <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer">
            {/* Profile Image / Initials */}
            <div className="w-12 h-12 flex items-center justify-center rounded-full text-white font-medium bg-blue-500 dark:bg-blue-600">
                {userInfo?.profilePic ? (
                    <img
                        src={userInfo.profilePic}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                    />
                ) : (
                    getInitials(userInfo?.fullName || "Guest")
                )}
            </div>

            {/* User Info */}
            <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {userInfo?.fullName || "Guest"}
                </p>
                <button
                    className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-all underline"
                    onClick={onLogOut}
                >
                    Logout
                </button>
            </div>
        </div>

    )
}

export default ProfileInfo
