import React, { useState } from 'react'
import axios from 'axios'
const CreateGroup = ({ students, onClose, getAllStudent, getAllGroup }) => {
    const [groupName, setGroupName] = useState("")
    const [dssv, setDssv] = useState([])
    const [error, setError] = useState("")
    const availableStudents = students.filter(student => !student.group)
    const handleCreateGroup = () => {
        const token = localStorage.getItem('token')
        axios.post('http://localhost:5000/create-group', {
            "groupName": groupName,
            "dssv": dssv
        }, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong headers
            }
        })
            .then(() => {
                getAllStudent()
                onClose()
            })
            .catch((error) => {
                if (error.response.data.error) {
                    setError(error.response.data.error)
                }
                else {
                    setError("Error!")
                }
            })
    }

    const handleCheckboxChange = (mssv) => {
        setDssv(prev =>
            prev.includes(mssv) ? prev.filter(id => id !== mssv) : [...prev, mssv]
        )
    }

    return (
        <div className="w-full max-w-xs">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                {error && <h2 className='text-red-500'>{error}</h2>}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" for="groupname">
                        Group Name
                    </label>
                    <input onChange={(e) => setGroupName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="groupname" type="text" />
                </div>

                {availableStudents.length > 0 ? (
                    <ul className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownSearchButton">
                        {availableStudents.map((student) => (
                            <li key={student.mssv}>
                                <div className="flex items-center p-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-600">
                                    <input id={student.mssv} type="checkbox" value="" onChange={() => handleCheckboxChange(student.mssv)} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                    <label for={student.mssv} className="w-full ms-2 text-sm font-medium text-gray-900 rounded-sm dark:text-gray-300">{student.mssv + " - " + student.hoten}</label>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div>0 student</div>
                )}
                <div className="flex items-center justify-between">
                    <button onClick={() => {
                        handleCreateGroup()
                        getAllGroup()
                    }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                        Create
                    </button>
                </div>
            </form >
        </div >
    )
}

export default CreateGroup