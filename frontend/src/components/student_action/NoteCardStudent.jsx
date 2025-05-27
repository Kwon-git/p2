import React from 'react'

const NoteCardStudent = ({ note }) => {
    return (
        <div className={`border rounded p-4 hover:shadow-xl transition-all ease-in-out relative `}>
            < div className='flex items-center justify-between'>
                < div >
                    <h6 className='text-xl font-medium'>{note.title}</h6>
                </div >
            </div >

            <p className='text-xs text-slate-600 mt-2'>{note.message.slice(0, 30)}</p>
            <p className="text-sm text-gray-500">Ngày:{' '} {new Date(note.timestamp).toLocaleString()} </p>
        </div >
    )
}

export default NoteCardStudent