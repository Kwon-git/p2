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
        // <nav class="bg-rose-500">
        //     <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        //         <div class="relative flex h-16 items-center justify-between">
        //             <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
        //                 <button type="button" class="relative inline-flex items-center justify-center rounded-md p-2 text-while-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset" aria-controls="mobile-menu" aria-expanded="false">
        //                     <span class="absolute -inset-0.5"></span>
        //                     <span class="sr-only">Open main menu</span>

        //                     <svg class="block size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
        //                         <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        //                     </svg>

        //                     <svg class="hidden size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
        //                         <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        //                     </svg>
        //                 </button>
        //             </div>
        //             <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">

        //                 <div class="hidden sm:ml-6 sm:block">
        //                     <div class="flex space-x-4">

        //                         <a href="#" class="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" aria-current="page">Dashboard</a>
        //                         <a href="#" class="rounded-md px-3 py-2 text-sm font-medium text-white-500 hover:bg-blue-700 hover:text-white">Team</a>
        //                         <a href="/manage-student" class="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 hover:text-white">Student Management</a>
        //                     </div>
        //                 </div>
        //             </div>
        //             <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
        //                 <button type="button" class="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
        //                     <span class="absolute -inset-1.5"></span>
        //                     <span class="sr-only">View notifications</span>
        //                     <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
        //                         <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        //                     </svg>
        //                 </button>

        //                 <div class="relative ml-3" ref={menuRef}>
        //                     <div>
        //                         <FaRegUser
        //                             onClick={() => setOpen((prev) => !prev)}
        //                             className="cursor-pointer text-white hover:text-blue-400 transition duration-200 w-6 h-6"
        //                         />
        //                     </div>


        //                     {open && (<div class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-hidden" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
        //                         <a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-0">Your Profile</a>
        //                         <a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-1">Settings</a>
        //                         <button class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-2" onClick={onLogout}>Sign out</button>
        //                     </div>
        //                     )
        //                     }
        //                 </div>
        //             </div>
        //         </div>
        //     </div>


        //     <div class="sm:hidden" id="mobile-menu">
        //         <div class="space-y-1 px-2 pt-2 pb-3">

        //             <a href="#" class="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white" aria-current="page">Dashboard</a>
        //             <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Team</a>
        //             <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Projects</a>
        //             <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Calendar</a>
        //         </div>
        //     </div>
        // </nav >
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