import React, { useState } from 'react'
import axios from 'axios'
const DeleteGroup = ({ groups, getAllGroup, onClose }) => {
    const [groupList, setGroupList] = useState([])
    const validGroups = groups.filter(group => group.dssv.length === 0)
    const handleCheckboxChange = (group) => {
        setGroupList(prev => prev.includes(group) ? prev.filter(id => id !== group) : [...prev, group])
    }

    const handleDeleteGroup = () => {
        const token = localStorage.getItem('token')
        axios.post('http://localhost:5000/delete-group', {
            "groups": groupList
        }, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong headers
            }
        })
            .then(() => {
                getAllGroup()
                onClose()
            })
    }
    return (
        <div>
            <div id="dropdownSearch" class="z-10 bg-white rounded-lg shadow-sm w-60 dark:bg-gray-700">
                <h2>Chọn nhóm cần xóa</h2>
                {validGroups.length > 0 ? (
                    <ul className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownSearchButton">
                        {validGroups.map((validGroup) => (
                            <li key={validGroup._id}>
                                <div className="flex items-center p-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-600">
                                    <input id={validGroup._id} type="checkbox" value="" onChange={() => handleCheckboxChange(validGroup.group)} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                    <label for={validGroup._id} className="w-full ms-2 text-sm font-medium text-gray-900 rounded-sm dark:text-gray-300">{validGroup.group}</label>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div>0 Group</div>
                )}

            </div>
            < button
                className="mt-6 bg-cyan-500 text-white hover:bg-cyan-600 px-4 py-2 rounded-md block mx-auto center"
                onClick={() => {
                    handleDeleteGroup()
                }}
            >
                OK
            </button >
        </div >
    )
}

export default DeleteGroup