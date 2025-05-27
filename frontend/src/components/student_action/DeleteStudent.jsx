import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
const DeleteStudent = ({ onClose, deleteFuntion }) => {
    return (
        <div>
            <div className='flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto'>
                <h3 className='text-2xl'>Are You Sure to delete ?</h3>
                <div className='flex flex-row'>
                    <button
                        className='p-4 bg-red-600 text-white rounded-lg m-8 w-2/4'
                        onClick={deleteFuntion}
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