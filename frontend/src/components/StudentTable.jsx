import React from 'react'
import NavBar from './NavBar'
import { IoMdAdd } from "react-icons/io";
import Modal from "react-modal"
import CreateStudent from './student_action/CreateStudent';
import DeleteStudent from './student_action/DeleteStudent';
import { useState } from 'react';
import axios from 'axios';
const StudentTable = ({ students, handleAdd, getAllStudent }) => {
    const [openModal, setOpenModal] = useState(false)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [selected, setSelected] = useState("")

    const handleCreateAccount = (mssv) => {
        const token = localStorage.getItem("token")
        axios.post(`http://localhost:5000/create-account/${mssv}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong headers
            }
        })
            .then(() => {
                getAllStudent()
            })
            .catch(() => {

            })
    }
    return (
        <div>
            <NavBar />
            {students.length > 0 ? (
                <div className=''>
                    <div className="flex flex-col justify-center mt-4">
                        <div className="flex justify-between items-center my-4">
                            <h2 className="text-xl font-semibold ml-40">Student List</h2>
                            {/* Có thể thêm nút Add ở đây nếu muốn */}
                            <button
                                onClick={handleAdd = () => setOpenModal(true)}
                                className="flex items-center bg-blue-500 text-white font-medium px-4 py-2 mr-40 rounded-lg hover:bg-blue-600 transition duration-200"
                            >
                                <IoMdAdd className="mr-2 text-xl" />
                                Thêm sinh viên
                            </button>
                            <Modal
                                isOpen={openModal}
                                onRequestClose={() => setOpenModal(false)}
                                style={{
                                    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.4)' },
                                    content: {
                                        width: '300',
                                        maxWidth: '500px',
                                        margin: 'auto',
                                        borderRadius: '1rem',
                                        padding: '2rem',
                                        height: "fit-content"
                                    },
                                }
                                }
                            >

                                <CreateStudent onClose={() => {
                                    setOpenModal(false)
                                }}
                                    getAllStudent={getAllStudent}
                                />
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
                                    getAllStudent={getAllStudent} mssv={selected} />
                            </Modal>
                        </div >
                        <table className="table-auto border border-collapse border-blue-700 mx-40">
                            <thead>
                                <tr>
                                    <th className="border border-blue-500 text-center px-4 py-2">MSSV</th>
                                    <th className="border border-blue-500 text-center px-4 py-2">Name</th>
                                    <th className="border border-blue-500 text-center px-4 py-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (

                                    < tr key={student.mssv} >
                                        <td className="border border-blue-300 text-center px-4 py-2">{student.mssv}</td>
                                        <td className="border border-blue-300 text-center px-4 py-2">{student.hoten}</td>
                                        <td className="border border-blue-300 text-center px-4 py-2">
                                            <div className='flex justify-center gap-x-4'>
                                                <button
                                                    onClick={() => {
                                                        setSelected(student.mssv)
                                                        setOpenModalDelete(true)
                                                    }}
                                                    className="bg-red-400 text-white p-2 rounded-xl hover:bg-red-500"
                                                >
                                                    Xoá
                                                </button>
                                                {student.username === undefined ? (
                                                    < div >
                                                        <button
                                                            onClick={() => {
                                                                handleCreateAccount(student.mssv)
                                                            }}
                                                            className="bg-yellow-400 text-white p-2 rounded-xl hover:bg-yellow-500"
                                                        >
                                                            Tạo tài khoản
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <button disabled
                                                            onClick={() => {
                                                                handleCreateAccount()
                                                            }}
                                                            className="bg-gray-300 text-white p-2 rounded-xl cursor-not-allowed"
                                                        >
                                                            Đã tạo tài khoản
                                                        </button>
                                                    </div>
                                                )}


                                            </div>
                                        </td>
                                    </tr>

                                ))}
                            </tbody>
                        </table>
                    </div>
                </div >
            ) : (
                <div>
                    <h2 className='p-3'> Không có sinh viên</h2>
                    <Modal
                        isOpen={openModal}
                        onRequestClose={() => setOpenModal(false)}
                        style={{
                            overlay: { backgroundColor: 'rgba(0, 0, 0, 0.4)' },
                            content: {
                                width: '300',
                                maxWidth: '500px',
                                margin: 'auto',
                                borderRadius: '1rem',
                                padding: '2rem',
                                height: "fit-content"
                            },
                        }
                        }
                    >

                        <CreateStudent onClose={() => {
                            setOpenModal(false)
                        }}
                            getAllStudent={getAllStudent}
                        />
                    </Modal>
                    <button
                        onClick={handleAdd = () => setOpenModal(true)}
                        className="flex items-center bg-blue-500 text-white font-medium px-4 py-2 mr-40 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        <IoMdAdd className="mr-2 text-xl" />
                        Thêm sinh viên
                    </button>
                </div>
            )
            }

        </div >
    )
}

export default StudentTable