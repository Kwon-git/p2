import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaRegUser, FaSchool } from "react-icons/fa";
const NavBar = () => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const role = localStorage.getItem('role')
    const onLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role')
        navigate('/login');
    }
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (
        <nav className="bg-blue-600 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo hoặc tên app */}
                    <div className="flex items-center space-x-2">
                        <FaSchool className="text-white w-6 h-6" />
                        <span className="text-white font-semibold text-lg">My Web</span>
                    </div>

                    {/* Menu chính */}
                    <div className="hidden md:flex space-x-4">
                        <a href="/home" className="text-white hover:text-yellow-300 transition">Home</a>
                        {role == 'lecturer' ? (<a href="/manage-student" className="text-white hover:text-yellow-300 transition">Students</a>) : ('')}
                        <a href="/contact" className="text-white hover:text-yellow-300 transition">Contact</a>
                    </div>

                    {/* Icon người dùng */}
                    <div className="flex items-center" ref={menuRef}>
                        <FaRegUser
                            onClick={() => setOpen((prev) => !prev)}
                            className="text-white hover:text-yellow-300 cursor-pointer w-6 h-6"
                        />
                        {open && (<div class="absolute right-2 z-10 mt-40 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-hidden" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-0">Your Profile</a>
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-1">Settings</a>
                            <button class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-2" onClick={onLogout}>Sign out</button>
                        </div>
                        )
                        }
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default NavBar