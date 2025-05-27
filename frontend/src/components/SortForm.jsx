import React, { useState } from 'react'
import axios from 'axios';
const SortForm = ({ students, onClose, handleCreateOk }) => {
    const [selectedStudents, setSelectedStudents] = useState([]);
    const handleCheckboxChange = (mssv) => {
        setSelectedStudents(prev =>
            prev.includes(mssv)
                ? prev.filter(id => id !== mssv) // Bỏ chọn
                : [...prev, mssv] // Thêm vào danh sách chọn
        );
    };


    return (
        <div>
            <div id="dropdownSearch" class="z-10 bg-white rounded-lg shadow-sm w-60 dark:bg-gray-700">
                <h2>Chọn người tham gia</h2>
                <div class="p-3">
                    <label for="input-group-search" class="sr-only">Search</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="text" id="input-group-search" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search user" />
                    </div>
                </div>

                {students.length > 0 ? (
                    <ul className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownSearchButton">
                        {students.map((student) => (
                            <li key={student.mssv}>
                                <div className="flex items-center p-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-600">
                                    <input id={student.mssv} type="checkbox" value="" onChange={() => handleCheckboxChange(student.mssv + '-' + student.hoten)} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                    <label for={student.mssv} className="w-full ms-2 text-sm font-medium text-gray-900 rounded-sm dark:text-gray-300">{student.mssv + " - " + student.hoten}</label>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div>0 student</div>
                )}

            </div>
            < button
                className="mt-6 bg-cyan-500 text-white hover:bg-cyan-600 px-4 py-2 rounded-md block mx-auto center"
                onClick={() => handleCreateOk(selectedStudents)}
            >
                OK
            </button >
        </div >
    )
}

export default SortForm