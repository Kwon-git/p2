import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import SortForm from "../components/SortForm";
import Modal from 'react-modal'
const Home = () => {
    const navigate = useNavigate();
    const [scheduleResult, setScheduleResult] = useState([]);
    const [schedule, setSchedule] = useState({});
    const [loading, setLoading] = useState(false);
    const [duration, setDuration] = useState('')
    const [backDuration, setBackDuration] = useState('')
    const [error, setError] = useState("")
    const [students, setStudents] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [selected, setSelected] = useState([])
    const daysOfWeek = [2, 3, 4, 5, 6, 7]; // Thứ 2 -> 7
    //const timeOptions = Array.from({ length: 48 }, (_, i) => (8 + i * 0.25).toFixed(2)) / / Tạo danh sách từ 8.0 đến 19.5
    const [timeOptions, setTimeOptions] = useState([])
    const array = [0.25, 0.5, 0.75, 1]


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
    const handleCreateOk = (selectedStudents) => {
        const token = localStorage.getItem("token")
        axios.post('http://localhost:5000/sort-schedule', { 'dssv': selectedStudents }, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong headers
            }
        })
            .then((response) => {
                setScheduleResult(response.data.schedule_res);
                setOpenModal(false)
            })
            .catch(() => {

            })
    }
    const getTimeOptions = (backDuration) => {
        switch (backDuration) {
            case '0.25':
                setTimeOptions(Array.from({ length: 48 }, (_, i) => (8 + i * 0.25).toFixed(2)));
                break;
            case '0.5':
                setTimeOptions(Array.from({ length: 24 }, (_, i) => (8 + i * 0.5).toFixed(2)));
                break;
            case '0.75':
                setTimeOptions(Array.from({ length: 16 }, (_, i) => (8 + i * 0.75).toFixed(2)));
                break;
            case '1':
                setTimeOptions(Array.from({ length: 13 }, (_, i) => (8 + i * 1).toFixed(2)));
        }
    };
    const convert = (x) => {
        const a = Math.floor(x / 24);
        const b = (x - a * 24) * 60;
        const c = Math.floor(b / 60);
        let d = Math.floor(b - c * 60);

        if (d === 0) d = '00';
        else d = d.toString().padStart(2, '0');

        const res = 'T' + (a + 2) + ' ' + c + 'h' + d;
        return res;
    }

    const getAllSchedule = async () => {
        setLoading(true);
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        axios.get("http://localhost:5000/get_schedule", {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong headers
            },
        })
            .then((response) => {
                setSchedule(response.data.schedule);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    };

    useEffect(() => {
        getDuration();
        getAllStudent();
        getAllSchedule();
        return () => { };
    }, []);

    useEffect(() => {
        if (backDuration) {
            getTimeOptions(backDuration);
        }
    }, [backDuration]);

    const formatTime = (time) => {
        const hours = Math.floor(time).toString().padStart(2, '0');
        const fraction = time % 1;
        let minutes = '00';

        if (fraction === 0.25) minutes = '15';
        else if (fraction === 0.5) minutes = '30';
        else if (fraction === 0.75) minutes = '45';

        return `${hours}h${minutes}`;
    };

    const formatDuration = (time) => {
        let minute = time * 60;
        return `${minute} minutes`
    }


    // Thêm một khung giờ mới cho ngày đã chọn
    const addSchedule = (day) => {
        const newEntry = { start_time: "", end_time: "" };
        setSchedule((prev) => ({
            ...prev,
            [day]: prev[day] ? [...prev[day], newEntry] : [newEntry],
        }));
    };


    const updateSchedule = (day, index, field, value) => {
        setSchedule((prev) => ({
            ...prev,
            [day]: prev[day].map((slot, i) => {
                let updatedSlot = { ...slot, [field]: value };

                if (field === "start_time") {
                    // Nếu nhập start_time trước, end_time phải lớn hơn start_time
                    if (slot.end_time && parseFloat(value) >= parseFloat(slot.end_time)) {
                        updatedSlot.end_time = "";
                    }
                }

                if (field === "end_time") {
                    // Nếu nhập end_time trước, start_time phải nhỏ hơn end_time
                    if (slot.start_time && parseFloat(value) <= parseFloat(slot.start_time)) {
                        updatedSlot.start_time = "";
                    }
                }

                return i === index ? updatedSlot : slot;
            }),
        }));
    };

    const removeLastSchedule = (day) => {
        setSchedule((prevSchedule) => {
            if (!prevSchedule[day] || prevSchedule[day].length === 0) return prevSchedule;
            return {
                ...prevSchedule,
                [day]: prevSchedule[day].slice(0, -1), // Xóa phần tử cuối cùng
            };
        });
    };

    // Gửi lịch trình lên backend
    const saveSchedule = async () => {
        const token = localStorage.getItem("token");
        setLoading(true);
        axios
            .post(
                "http://localhost:5000/update_schedule",
                { schedule: schedule },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Gửi token qua header
                    },
                }
            )
            .then(() => {
                setLoading(false);
                navigate("/home");
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    };

    const handleDuration = (e) => {
        e.preventDefault();
        setLoading(true)
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        axios.post("http://localhost:5000/update-duration", {
            "duration": duration
        }, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong headers
            }
        }
        )
            .then((response) => {
                navigate('/home');
                setBackDuration(duration);
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

    const getDuration = () => {
        const token = localStorage.getItem("token");
        axios.get("http://localhost:5000/get-duration", {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong headers
            },
        })
            .then((response) => {
                setDuration(response.data.duration);
                setBackDuration(response.data.duration);
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
            <div className="flex flex-row">
                <div className="max-w-xl mx-3">
                    <form
                        className="bg-white shadow-md rounded-lg px-6 pt-6 pb-4"
                        onSubmit={handleDuration}
                    >
                        <div className="mb-4">
                            <label htmlFor="duration" className="block text-gray-700 text-sm font-medium mb-1">
                                Thời gian hẹn
                            </label>
                            <select
                                id="duration"
                                value={duration || ""}
                                className="border border-gray-300 rounded w-full py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                onChange={(e) => setDuration(e.target.value)}
                            >
                                <option value="">Giờ</option>
                                {array.map((time) => (
                                    <option key={time} value={time}>{formatDuration(time)}</option>
                                ))}
                            </select>
                            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
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
                </div>

                <div className="max-w-3xl mx-auto p-6">
                    <h1 className="text-2xl font-bold mb-4">Your Schedule</h1>
                    {timeOptions.length > 0 ? (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-50 gap-y-10 justify-center">
                                {daysOfWeek.map((day) => (
                                    <div key={day} className="border p-6 rounded-md shadow w-full min-w-[300px] max-w-[350px]">
                                        <h2 className="text-lg font-semibold">Thứ {day}</h2>

                                        {/* Hiển thị danh sách khung giờ */}
                                        {schedule[day] && schedule[day].length > 0 ? (
                                            schedule[day].map((slot, index) => (
                                                <div key={index} className="flex gap-2 mb-2 items-center">
                                                    <h3> from </h3>
                                                    <select
                                                        value={slot.start_time}
                                                        onChange={(e) => updateSchedule(day, index, "start_time", e.target.value)}
                                                        className="border p-2 rounded-md w-24"
                                                    >
                                                        <option value="">Giờ</option>
                                                        {timeOptions.map((time) => (
                                                            <option key={time} value={time}>{formatTime(time)}</option>
                                                        ))}
                                                    </select>
                                                    <h3> to </h3>
                                                    <select
                                                        value={slot.end_time}
                                                        onChange={(e) => updateSchedule(day, index, "end_time", e.target.value)}
                                                        className="border p-2 rounded-md w-24"
                                                    >
                                                        <option value="">Giờ</option>
                                                        {timeOptions
                                                            .filter((time) => !slot.start_time || parseFloat(time) > parseFloat(slot.start_time))
                                                            .map((time) => (
                                                                <option key={time} value={time}>{formatTime(time)}</option>
                                                            ))}
                                                    </select>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">Chưa có lịch trống</p>
                                        )}
                                        {/* Nút thêm khung giờ */}
                                        <button
                                            className="mt-2 bg-blue-500 text-white hover:bg-blue-600 px-3 py-1 rounded-md"
                                            onClick={() => addSchedule(day)}
                                        >
                                            + Thêm khoảng thời gian
                                        </button>
                                        {/* Nút xóa khoảng thời gian cuối cùng */}
                                        {schedule[day] && schedule[day].length > 0 && (
                                            <button
                                                className="mt-2 bg-red-500 text-white hover:bg-red-600 px-3 py-1 rounded-md justify-center"
                                                onClick={() => removeLastSchedule(day)}
                                            >
                                                Xóa
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Nút lưu lịch trình */}
                            < button
                                className="mt-6 bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-md block mx-auto center"
                                onClick={saveSchedule}
                            >
                                Lưu lịch trình
                            </button >

                            < button
                                className="mt-6 bg-cyan-500 text-white hover:bg-cyan-600 px-4 py-2 rounded-md block mx-auto center"
                                onClick={() => setOpenModal(true)}
                            >
                                Sắp xếp lịch
                            </button >
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
                                <SortForm students={students} handleCreateOk={handleCreateOk} />
                            </Modal>
                            {scheduleResult.length > 0 && (
                                <ul className="mt-4">
                                    {scheduleResult.map(([mssv, time], index) => (
                                        <li key={index}>
                                            <strong>{mssv}</strong> - {convert(time)}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ) : (
                        <p>Hãy nhập thời gian trước</p>
                    )}
                </div>
            </div>
        </div >
    );

};

export default Home;