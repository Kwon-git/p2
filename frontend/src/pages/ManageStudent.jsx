import React, { useState, useEffect } from 'react'
import StudentTable from '../components/StudentTable'
import axios from 'axios'
import { useParams } from 'react-router-dom';
import Modal from "react-modal"
const ManageStudent = () => {
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(false)
    const { mssv } = useParams();
    const getAllStudent = async () => {
        setLoading(true);
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        axios.get("http://localhost:5000/get-all-student", {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong headers
            },
        })
            .then((response) => {
                setStudents(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    };

    useEffect(() => {
        getAllStudent();
        return () => { };
    }, []);

    return (
        <StudentTable students={students} getAllStudent={getAllStudent} />
    )
}

export default ManageStudent