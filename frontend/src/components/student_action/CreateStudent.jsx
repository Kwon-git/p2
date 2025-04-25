import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { IoMdClose } from 'react-icons/io';
import axios from 'axios';
const CreateStudent = ({ onClose, getAllStudent }) => {
    const navigate = useNavigate();
    const [mssv, setMssv] = useState("")
    const [name, setName] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        axios.post("http://localhost:5000/create-student", {
            "mssv": mssv,
            "hoten": name
        }, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong headers
            }
        }
        )
            .then((response) => {
                console.log(response.data.message)
                getAllStudent();
                onClose();
            })
            .catch((error) => {
                setLoading(false);
                if (error.response && error.response.data && error.response.data.error) {
                    setError(error.response.data.error);
                } else {
                    setError('An error occurred. Please try again.');
                }
            });
    }

    return (
        <div className="w-full max-w-sm relative">
            <button
                className="w-8 h-8 rounded-full flex items-center justify-center absolute -top-2 -right-2 hover:bg-slate-300"
                onClick={onClose}
            >
                <IoMdClose className="text-lg text-slate-500" />
            </button>

            <form
                className="bg-white shadow-md rounded-lg px-6 pt-6 pb-4"
                onSubmit={handleSubmit}
            >
                <div className="mb-4">
                    <label htmlFor="mssv" className="block text-gray-700 text-sm font-medium mb-1">
                        Mã số sinh viên
                    </label>
                    <input
                        id="mssv"
                        type="text"
                        className="border border-gray-300 rounded w-full py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e) => setMssv(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="hoten" className="block text-gray-700 text-sm font-medium mb-1">
                        Họ tên
                    </label>
                    <input
                        id="hoten"
                        type="text"
                        className="border border-gray-300 rounded w-full py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                    >
                        OK
                    </button>
                </div>
            </form>
        </div>

    )
}

export default CreateStudent