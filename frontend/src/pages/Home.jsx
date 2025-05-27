import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import SortForm from "../components/SortForm";
import Modal from 'react-modal'
import TimeTable from "../components/TimeTable";
import ScheduleForm from "../components/ScheduleForm";

const Home = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [scheduleResult, setScheduleResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [duration, setDuration] = useState('')
    const [error, setError] = useState("")
    const [students, setStudents] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [openModalSchedule, setOpenModalSchedule] = useState(false)


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
        console.log("duration:", duration);
        console.log("Events đã cập nhật:", events);
    }, [events]);



    const convert = (x) => {
        //tinh gio
        const a = Math.floor(x / 24);//thu
        const b = (x - a * 24) * 60;
        let c = Math.floor(b / 60);
        c = c.toString().padStart(2, '0');
        let d = Math.floor(b - c * 60);
        if (d === 0) d = '00';
        else d = d.toString().padStart(2, '0');
        const res = c + ':' + d;
        //Tinh ngay
        const date = new Date()
        const today = new Date(date)
        const currentDay = today.getDay() // 0 = Chủ nhật, 1 = Thứ hai, ..., 6 = Thứ bảy
        const d1 = new Date(today)
        d1.setDate(today.getDate() + (a + 1 - currentDay))
        const res2 = d1.toLocaleDateString("en-CA").slice(0, 10) // 'YYYY-MM-DD'
        return res2 + ' ' + res;
    }

    const getEvents = () => {
        if (!scheduleResult || scheduleResult.length === 0 || !duration) return;
        const newEvents = scheduleResult.map(([mssv, time], index) => ({
            id: index.toString(),
            title: mssv,
            start: convert(time),
            end: convert(time + parseFloat(duration)),
        }));
        console.log(newEvents)
        setEvents(newEvents);
    }

    const handleCreateOk = (selectedStudents) => {
        const token = localStorage.getItem("token")
        axios.post('http://localhost:5000/sort-schedule', { 'dssv': selectedStudents }, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong headers
            }
        })
            .then((response) => {
                getLichHen()
                setOpenModal(false)
            })
            .catch(() => {

            })
    }

    const getLichHen = () => {
        const token = localStorage.getItem("token")
        axios.get('http://localhost:5000/get-lichhen', {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong headers
            }
        })
            .then((response) => {
                setScheduleResult(response.data.lichhen);
            })
            .catch(() => {
                console.log(error.response);
            })
    }


    useEffect(() => {
        getDuration();
        if (scheduleResult.length > 0 && duration) {
            getEvents();
        }
    }, [scheduleResult, duration]);

    useEffect(() => {
        getDuration();
        getAllStudent();
        getLichHen();
        return () => { };
    }, []);

    const getDuration = () => {
        const token = localStorage.getItem("token");
        axios.get("http://localhost:5000/get-duration", {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong headers
            },
        })
            .then((response) => {
                setDuration(response.data.duration);
            })
            .catch((error) => {
                setLoading(false);
                if (error.response && error.response.data && error.response.data.error) {
                    setError(error.response.data.error);
                } else {
                    setError('An error occurred. Please try again.');
                }
            });
    }

    return (
        <div>
            <NavBar />
            <div className="flex flex-col">
                <div className="flex flex-row">
                    < button
                        className="mt-3 mb-3 bg-cyan-500 text-white text-l hover:bg-cyan-600 px-4 py-2 rounded-md block mx-auto center"
                        onClick={() => setOpenModalSchedule(true)}
                    >
                        Schedule
                    </button >
                    <Modal
                        isOpen={openModalSchedule}
                        onRequestClose={() => setOpenModalSchedule(false)}
                        style={{
                            overlay: {
                                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                zIndex: 1000  // đảm bảo overlay nằm trên các phần tử khác
                            },
                            content: {
                                zIndex: 1001,  // modal phải cao hơn overlay và các phần tử khác
                                position: 'fixed', // hoặc 'absolute' / 'fixed' nếu cần
                                // Bạn có thể giữ các style khác nếu cần
                                width: '1000px',
                                maxWidth: '2500px',
                                margin: 'auto',
                                borderRadius: '1rem',
                                padding: '2rem',
                                height: '700px',
                                overflowY: 'auto',
                            },
                        }}
                    >
                        <ScheduleForm />
                    </Modal>
                    < button
                        className="mt-3 mb-3 bg-cyan-500 text-white text-xl hover:bg-cyan-600 px-4 py-2 rounded-md block mx-auto center"
                        onClick={() => setOpenModal(true)}
                    >
                        Sắp xếp lịch
                    </button >
                    <Modal
                        isOpen={openModal}
                        onRequestClose={() => setOpenModal(false)}
                        style={{
                            overlay: {
                                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                zIndex: 1000  // đảm bảo overlay nằm trên các phần tử khác
                            },
                            content: {
                                zIndex: 1001,  // modal phải cao hơn overlay và các phần tử khác
                                position: 'relative', // hoặc 'absolute' / 'fixed' nếu cần
                                width: '500px',
                                maxWidth: '500px',
                                margin: 'auto',
                                borderRadius: '1rem',
                                padding: '2rem',
                                height: 'fit-content',
                            },
                        }}
                    >
                        <SortForm students={students} handleCreateOk={handleCreateOk} />
                    </Modal>
                </div>
                {events.length > 0 ? (
                    <TimeTable events={events} />
                ) : (
                    <p>Đang tải dữ liệu lịch hẹn...</p>
                )}
            </div>
        </div>
    );

};

export default Home;


