import React from 'react'

const NoteDetail = ({ note }) => {
    return (
        <div className={`rounded p-4 transition-all ease-in-out relative `}>
            < div className='flex items-center justify-between'>
                < div >
                    <p className="text-xxl "><strong>Ngày:{' '} {new Date(note.timestamp).toLocaleString()} </strong></p>
                </div >
            </div >
            <h6 className='text-xl font-medium'>Title: {note.title}</h6>
            <p className='text-xl font-medium  mt-2'>Message</p>
            <p className='text-l text-slate-600 mt-2 break-words'>{note.message}</p>
        </div >
    )
}

export default NoteDetail