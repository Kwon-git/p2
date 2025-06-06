import React, { useState } from 'react'
import axios from 'axios'
import Modal from 'react-modal';
import { IoInformationCircle } from "react-icons/io5";
import { BsTrash } from "react-icons/bs";
import NoteDetail from './NoteDetail';
import DeleteStudent from './DeleteStudent';
const NoteCard = ({ note, mssv, noteId, getNotes }) => {
    const [modalDetail, setModalDetail] = useState(false)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const handleSend = () => {
        const token = localStorage.getItem('token')
        axios.post(`http://localhost:5000/send-note/${mssv}/${noteId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong headers
            }
        }).then(() => {
            getNotes()
        })
    }

    const handleDelete = () => {
        const token = localStorage.getItem('token')
        axios.post(`http://localhost:5000/delete-note/${mssv}/${noteId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong headers
            }
        })
            .then(() => {
                getNotes()
                setOpenModalDelete(false)
            })
    }

    return (
        <div className={`border rounded p-4 hover:shadow-xl transition-all ease-in-out relative `}>
            <Modal
                isOpen={modalDetail}
                onRequestClose={() => setModalDetail(false)}
                contentLabel="Example"
                style={{
                    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.4)' },
                    content: {
                        padding: '20px', width: '600px', margin: 'auto', height: 'fit-content',
                        borderRadius: '8px',
                    },
                }}
            >

                <NoteDetail onClose={() => {
                    setModalDetail(false)
                }}
                    note={note} />
            </Modal>

            <Modal
                isOpen={openModalDelete}
                onRequestClose={() => setOpenModalDelete(false)}
                style={{
                    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.4)' },
                    content: {
                        width: 'fit-content',
                        margin: 'auto',
                        borderRadius: '1rem',
                        padding: '2rem',
                        height: "fit-content"
                    },
                }
                }
            >

                <DeleteStudent onClose={() => {
                    setOpenModalDelete(false)
                }}
                    deleteFuntion={handleDelete} />
            </Modal>

            < div className='flex items-center justify-between'>
                < div >
                    <h6 className='text-xl font-medium'>{note.title}</h6>
                </div >
            </div >

            <p className='text-xs text-slate-600 mt-2'>{note.message?.slice(0, 30)}</p>
            <p className="text-sm text-gray-500">Ngày:{' '} {new Date(note.timestamp).toLocaleString()} </p>
            <div className='flex flex-row items-center justify-between gap-2 '>
                {note.sent == "1" ? (
                    <div>Đã được gửi</div>
                ) : (
                    <button onClick={() => {
                        handleSend()
                        getNotes()
                    }} className='flex items-center bg-blue-500 text-white font-medium p-2 mt-2 rounded-lg hover:bg-blue-600'>Gửi</button>
                )}
                <div className='flex flex-row space-x-3'>
                    <IoInformationCircle onClick={() => setModalDetail(true)} className='text-2xl text-green-800' />
                    <BsTrash className='text-2xl text-red-800' onClick={() => {
                        setOpenModalDelete(true)
                    }} />
                </div >
            </div>
        </div >
    )
}

export default NoteCard