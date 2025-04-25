import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
const DeleteStudent = ({ onClose, getAllStudent, mssv }) => {
    const [error, setError] = useState("")
    const handleDelete = () => {
        const token = localStorage.getItem("token")
        axios.post(`http://localhost:5000/delete/${mssv}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong headers
            }
        })
            .then((response) => {
                getAllStudent();
                onClose();
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.error) {
                    setError(error.response.data.error);
                } else {
                    setError('An error occurred. Please try again.');
                }
            })
    }
    return (
        <div>
            <div className='flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto'>
                <h3 className='text-2xl'>Are You Sure to delete ?</h3>
                <div className='flex flex-row'>
                    <button
                        className='p-4 bg-red-600 text-white rounded-lg m-8 w-2/4'
                        onClick={handleDelete}
                    >
                        Yes
                    </button>
                    <button
                        className='p-4 bg-blue-600 text-white rounded-lg m-8 w-full'
                        onClick={onClose}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteStudent