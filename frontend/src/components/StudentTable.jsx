import React, { useEffect } from 'react'
import NavBar from './NavBar'
import { IoMdAdd } from "react-icons/io";
import Modal from "react-modal"
import CreateStudent from './student_action/CreateStudent';
import DeleteStudent from './student_action/DeleteStudent';
import ManageNote from './student_action/ManageNote';
import { useState } from 'react';
import axios from 'axios';
import CreateGroup from './CreateGroup';
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import DeleteGroup from './DeleteGroup';
const StudentTable = ({ students, handleAdd, getAllStudent }) => {
    const [openModal, setOpenModal] = useState(false)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [openModalNote, setOpenModalNote] = useState(false)
    const [selected, setSelected] = useState("")
    const [openModalGroup, setOpenModalGroup] = useState(false)
    const [modalAddGroup, setModalAddGroup] = useState(false)
    const [modalDeleteGroup, setModalDeleteGroup] = useState(false)
    const [group, setGroup] = useState("")
    const [allGroup, setAllGroup] = useState([])
    const myStudents = students.sort((a, b) => a.group < b.group ? -1 : 1)
    console.log(myStudents)
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

    const getAllGroup = () => {
        const token = localStorage.getItem("token")
        axios.get('http://localhost:5000/get-all-group', {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong headers
            }
        })
            .then((response) => {
                setAllGroup(response.data.groups)
            })
    }

    const handleAddGroup = (mssv) => {
        const token = localStorage.getItem("token")
        axios.post("http://localhost:5000/add-to-group", {
            "mssv": mssv,
            "group_name": group
        }, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong headers
            }
        })
            .then((response) => {
                getAllStudent()
                setModalAddGroup(false)
                getAllGroup()
            })
            .catch((error) => {

            })
    }

    const handleDelete = () => {
        const token = localStorage.getItem("token")
        axios.post(`http://localhost:5000/delete/${selected}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong headers
            }
        })
            .then((response) => {
                getAllStudent();
                setOpenModalDelete(false)
            })
            .catch((error) => {

            })
    }
    useEffect(() => {
        getAllGroup()
    }, [])

    return (
        <div>
            <NavBar />
            {students.length > 0 ? (
                <div className=''>
                    <div className="flex flex-col justify-center mt-4">
                        <div className="flex justify-between items-center my-4">
                            <h2 className="text-3xl font-semibold ml-40">Student List</h2>
                            {/* Có thể thêm nút Add ở đây nếu muốn */}
                            <div className='flex flex-row mr-40 space-x-2'>
                                <button
                                    onClick={handleAdd = () => setOpenModal(true)}
                                    className="flex items-center bg-blue-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                                >
                                    <IoMdAdd className="mr-2 text-xl" />
                                    Thêm sinh viên
                                </button>
                                <button
                                    onClick={() => setOpenModalGroup(true)}
                                    className="flex items-center bg-sky-500 text-white font-medium px-4 py-2  rounded-lg hover:bg-blue-600 transition duration-200"
                                >
                                    <IoMdAdd className="mr-2 text-xl" />
                                    Tạo nhóm
                                </button>
                                <button
                                    onClick={() => setModalDeleteGroup(true)}
                                    className="flex items-center bg-red-500 text-white font-medium px-4 py-2  rounded-lg hover:bg-blue-600 transition duration-200"
                                >
                                    <RiDeleteBin6Line className="mr-2 text-xl" />
                                    Xóa nhóm
                                </button>
                            </div>
                            <Modal
                                isOpen={openModalGroup}
                                onRequestClose={() => setOpenModalGroup(false)}
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

                                <CreateGroup onClose={() => {
                                    setOpenModalGroup(false)
                                }}
                                    students={students}
                                    getAllStudent={getAllStudent}
                                    getAllGroup={getAllGroup}
                                />
                            </Modal>
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
                                    deleteFuntion={handleDelete} />
                            </Modal>

                            <Modal
                                isOpen={modalDeleteGroup}
                                onRequestClose={() => setModalDeleteGroup(false)}
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

                                <DeleteGroup onClose={() => {
                                    setModalDeleteGroup(false)
                                }}
                                    groups={allGroup}
                                    getAllGroup={getAllGroup} />
                            </Modal>

                            <Modal
                                isOpen={modalAddGroup}
                                onRequestClose={() => setModalAddGroup(false)}
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
                                <form
                                    className="bg-white shadow-md rounded-lg px-6 pt-6 pb-4"
                                    onSubmit={(e) => {
                                        e.preventDefault(); // Ngăn reload
                                        handleAddGroup(selected);
                                    }}
                                >
                                    <div className="mb-4">
                                        <label htmlFor="group" className="block text-gray-700 text-sm font-medium mb-1">
                                            Chọn nhóm
                                        </label>
                                        <select
                                            id="group"
                                            value={group}
                                            className="border border-gray-300 rounded w-full py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            onChange={(e) => setGroup(e.target.value)}
                                        >
                                            <option value="">-Chọn-</option>
                                            {allGroup.map((grup) => (
                                                <option key={grup._id} value={grup.group}>{grup.group}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                                        >
                                            OK
                                        </button>
                                    </div>
                                </form>
                            </Modal>
                        </div >
                        <table className="table-auto border border-collapse border-blue-700 mx-40">
                            <thead>
                                <tr>
                                    <th className="border border-blue-500 text-center px-4 py-2">MSSV</th>
                                    <th className="border border-blue-500 text-center px-4 py-2">Name</th>
                                    <th className="border border-blue-500 text-center px-4 py-2">Group</th>
                                    <th className="border border-blue-500 text-center px-4 py-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    < tr key={student.mssv} >
                                        <td className="border border-blue-300 text-center px-4 py-2">{student.mssv}</td>
                                        <td className="border border-blue-300 text-center px-4 py-2">{student.hoten}</td>
                                        {(student.group !== undefined) && (student.group !== "") ? (
                                            <td className="border border-blue-300 text-center px-4 py-2">
                                                <div className="flex flex-row justify-center items-center h-full">
                                                    <p>{student.group}</p>
                                                    <CiEdit onClick={() => {
                                                        setSelected(student.mssv)
                                                        setModalAddGroup(true)
                                                    }} className='ml-6' />
                                                </div>
                                            </td>
                                        ) : (
                                            <td className="border border-blue-300 text-center px-4 py-2">
                                                <div className="flex justify-center items-center h-full">
                                                    {allGroup.length > 0 ? (
                                                        <button onClick={() => {
                                                            setModalAddGroup(true)
                                                            setSelected(student.mssv)
                                                        }} className="p-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600">
                                                            Thêm vào nhóm
                                                        </button>
                                                    ) : (
                                                        <p>Tạo nhóm trước</p>
                                                    )}

                                                </div>
                                            </td>
                                        )}
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
                                                <button
                                                    onClick={() => {
                                                        setSelected(student.mssv)
                                                        setOpenModalNote(true)
                                                    }}
                                                    className="bg-green-400 text-white p-2 rounded-xl hover:bg-green-500"
                                                >
                                                    Xem ghi chú
                                                </button>
                                                <Modal
                                                    isOpen={openModalNote}
                                                    onRequestClose={() => setOpenModalNote(false)}
                                                    style={{
                                                        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.4)' },
                                                        content: {
                                                            width: '900',
                                                            margin: 'auto',
                                                            borderRadius: '1rem',
                                                            padding: '2rem',
                                                            height: "600"
                                                        },
                                                    }
                                                    }
                                                >

                                                    <ManageNote onClose={() => {
                                                        setOpenModalNote(false)
                                                    }}
                                                        mssv={selected}
                                                    />
                                                </Modal>


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
                        onClick={() => setOpenModal(true)}
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