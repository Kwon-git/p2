import React, { useState } from 'react'
import axios from 'axios'

const AddNoteForm = ({ onClose, mssv }) => {
    const [sent, setSent] = useState("0")
    const [message, setMessage] = useState("")
    const [title, setTitle] = useState("")
    const handleCheckboxChange = () => {
        if (sent == "0") setSent("1")
        else setSent("0")
    }

    const handleAddNote = (mssv) => {
        const token = localStorage.getItem("token")
        axios.post(`http://localhost:5000/take-note/${mssv}`, {
            "title": title,
            "note_message": message,
            "sent": sent
        }, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong headers
            }
        })
            .then(() => {
                onClose()
            })
            .catch(() => {

            })
    }

    return (
        <div className="p-2 relative">
            <h2 className="text-2xl font-bold mb-4">Note</h2>
            {/* {message && <p className="mb-4 text-sm text-red-500">{message}</p>} */}
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border p-2 rounded w-full"
                        placeholder="Enter title"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="border p-2 rounded w-full"
                        rows="7"
                        placeholder="Enter message note"
                    ></textarea>
                </div>
                <div className="flex items-center mb-4">
                    <input id="sent" type="checkbox" value="" onChange={() => handleCheckboxChange()} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                    <label for="sent" className="w-full ms-2 text-sm font-medium text-gray-900 rounded-sm dark:text-gray-300">Gửi đến sinh viên</label>
                </div>
                <button
                    onClick={
                        () => handleAddNote(mssv)// Xử lý logic tạo mới
                    }
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Ok
                </button>

            </div>
        </div >
    )
}

export default AddNoteForm