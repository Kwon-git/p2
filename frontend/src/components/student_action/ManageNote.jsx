import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NoteCard from './NoteCard'
import AddNoteForm from '../AddNoteForm'
import { MdAdd } from 'react-icons/md'
import Modal from "react-modal"
const ManageNote = ({ mssv }) => {
    const [notes, setNotes] = useState([])
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const getNotes = () => {
        const token = localStorage.getItem('token')
        axios.get(`http://localhost:5000/get-all-note/${mssv}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong headers
            }
        })
            .then((response) => {
                setNotes(response.data.note)
                console.log(response.data.note)
            })
            .catch(() => {

            })
    }

    useEffect(() => {
        getNotes()
        return () => { };
    }, []);

    return (
        <div>
            <button onClick={() => setModalIsOpen(true)} className='w-8 h-8 flex items-center justify-center rounded-2xl bg-blue-500 hover:bg-blue-600'>
                <MdAdd className='text-[32px] text-white' />
            </button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Example"
                style={{
                    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.4)' },
                    content: {
                        padding: '20px', width: '600px', margin: 'auto'
                    },
                }}
            >

                <AddNoteForm onClose={() => {
                    setModalIsOpen(false)
                    getNotes()
                }}
                    mssv={mssv} />
            </Modal>
            {
                notes.length > 0 ? (
                    <div className='container mx-auto pl-8 pr-8 '  >
                        <div className="grid grid-cols-5 gap-4 mt-8">
                            {notes.map((item, index) => {
                                return (
                                    <NoteCard
                                        note={item} key={item._id
                                        }
                                        mssv={mssv}
                                        getNotes={getNotes}
                                        noteId={item._id}
                                    />
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <h2>Chưa có note nào cho sinh viên này</h2>
                )
            }
        </div >
    )
}

export default ManageNote