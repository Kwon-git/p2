import React, { useState } from 'react'
import { LuNotebookPen } from "react-icons/lu";
import AddNoteForm from './AddNoteForm';
import Modal from 'react-modal';
const ModalTimeTable = ({ event, onClose, mssv }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    return (
        <div className="flex items-center justify-center ">
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Example"
                style={{
                    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 1003 },
                    content: {
                        padding: '20px', width: '600px', margin: 'auto',
                        zIndex: 1005
                    },
                }}
            >

                <AddNoteForm onClose={() => {
                    setModalIsOpen(false)
                }}
                    mssv={mssv} />
            </Modal>
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                <h2 className="text-xl font-semibold mb-4">Chi tiết sự kiện</h2>
                <p> {event.title}</p>
                <p><strong>Bắt đầu:</strong> {event.start}</p>
                <p><strong>Kết thúc:</strong> {event.end}</p>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={() => onClose()}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Đóng
                    </button>
                </div>
                <button className='w-10 h-10 bg-green-400 hover:bg-green-500 rounded-lg justify-center' onClick={() => {
                    setModalIsOpen(true)
                }}>
                    <LuNotebookPen size={32} />
                </button>
            </div>
        </div>
    )
}

export default ModalTimeTable