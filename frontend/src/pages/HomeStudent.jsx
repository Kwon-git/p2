import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useSnackbar } from 'notistack'
const HomeStudent = () => {
    const navigate = useNavigate();
    const [schedule, setSchedule] = useState({});
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const daysOfWeek = [2, 3, 4, 5, 6, 7]; // Thứ 2 -> 7
    const timeOptions = Array.from({ length: 48 }, (_, i) => (8 + i * 0.25).toFixed(2)) // Tạo danh sách từ 8.0 đến 19.5
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
        getAllSchedule();
        return () => { };
    }, []);

    const formatTime = (time) => {
        const hours = Math.floor(time).toString().padStart(2, '0');
        const fraction = time % 1;
        let minutes = '00';

        if (fraction === 0.25) minutes = '15';
        else if (fraction === 0.5) minutes = '30';
        else if (fraction === 0.75) minutes = '45';

        return `${hours}h${minutes}`;
    };



    // Thêm một khung giờ mới cho ngày đã chọn
    const addSchedule = (day) => {
        const newEntry = { start_time: "", end_time: "" };
        setSchedule((prev) => ({
            ...prev,
            [day]: prev[day] ? [...prev[day], newEntry] : [newEntry],
        }));
    };


    // Cập nhật thời gian của lịch
    // const updateSchedule = (day, index, field, value) => {
    //     setSchedule((prev) => {
    //         const updatedDay = [...prev[day]];
    //         updatedDay[index][field] = value ? parseFloat(value) : "";
    //         return { ...prev, [day]: updatedDay };
    //     });
    // };
    // const updateSchedule = (day, index, field, value) => {
    //     setSchedule((prevSchedule) => ({
    //         ...prevSchedule,
    //         [day]: prevSchedule[day].map((slot, i) =>
    //             i === index ? { ...slot, [field]: value } : slot
    //         ),

    //     }));
    // };
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

    return (
        <div>
            <NavBar />
            <div className="max-w-3xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">Your Schedule</h1>

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
                                    className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md justify-center"
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
                    className="mt-6 bg-green-500 text-white px-4 py-2 hover:bg-green-600 rounded-md block mx-auto center"
                    onClick={() => {
                        saveSchedule()
                        enqueueSnackbar('Lưu lịch thành công', { variant: 'success' })
                    }
                    }
                >
                    Lưu lịch trình
                </button >
            </div >
        </div >
    );
};

export default HomeStudent;
