import React, { useEffect, useState } from 'react'
import axios from 'axios'
import NoteCardStudent from '../components/student_action/NoteCardStudent'
import NavBar from "../components/NavBar";

const StudentGetNote = () => {
    const [notes, setNotes] = useState([])
    const getNotes = () => {
        const token = localStorage.getItem('token')
        axios.get('http://localhost:5000/get-note', {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong headers
            },
        })
            .then((response) => {
                setNotes(response.data.note)
            })
            .catch(() => {

            })
    }
    useEffect(() => {
        getNotes()
    }, [])

    return (
        <div>
            <NavBar />
            {
                notes.length > 0 ? (
                    <div className='container mx-auto pl-8 pr-8 '  >
                        <div className="grid grid-cols-3 gap-4 mt-8">
                            {notes.map((item, index) => {
                                return (
                                    <NoteCardStudent
                                        note={item} key={item._id
                                        }
                                    />
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <h2>Chua co thong bao nao </h2>
                )
            }
        </div>
    )
}

export default StudentGetNote