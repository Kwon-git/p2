import { useState } from "react";

const ScheduleForm = ({ onSubmit }) => {
    const [schedule, setSchedule] = useState({});

    const days = [
        { value: 1, label: "Thứ Hai" },
        { value: 2, label: "Thứ Ba" },
        { value: 3, label: "Thứ Tư" },
        { value: 4, label: "Thứ Năm" },
        { value: 5, label: "Thứ Sáu" },
        { value: 6, label: "Thứ Bảy" },
        { value: 7, label: "Chủ Nhật" },
    ];

    const hours = Array.from({ length: 24 }, (_, i) => i + 0.5); // [0.5, 1.0, 1.5, ..., 23.5]

    // Thêm thời gian mới vào ngày đã chọn
    const addSchedule = (day) => {
        const newEntry = { start_time: "", end_time: "" };
        setSchedule((prev) => ({
            ...prev,
            [day]: prev[day] ? [...prev[day], newEntry] : [newEntry],
        }));
    };

    // Cập nhật giá trị giờ cho lịch trình
    const updateSchedule = (day, index, field, value) => {
        setSchedule((prev) => {
            const updatedDay = [...prev[day]];
            updatedDay[index][field] = value ? parseFloat(value) : "";
            return { ...prev, [day]: updatedDay };
        });
    };

    // Gửi lịch trình khi submit
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(schedule); // Gửi dữ liệu lên backend
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-lg font-bold mb-4">Chọn Lịch Trình</h2>
            <div className="space-y-4">
                {days.map((day) => (
                    <div key={day.value} className="border p-4 rounded-md">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold">{day.label}</h3>
                            <button
                                type="button"
                                className="bg-blue-500 text-white px-3 py-1 rounded-md"
                                onClick={() => addSchedule(day.value)}
                            >
                                + Thêm giờ
                            </button>
                        </div>
                        {schedule[day.value]?.map((entry, index) => (
                            <div key={index} className="flex gap-2 mt-2">
                                <select
                                    className="border p-2 rounded-md"
                                    value={entry.start_time}
                                    onChange={(e) => updateSchedule(day.value, index, "start_time", e.target.value)}
                                >
                                    <option value="">Chọn giờ bắt đầu</option>
                                    {hours.map((hour) => (
                                        <option key={hour} value={hour}>{hour}:00</option>
                                    ))}
                                </select>
                                <select
                                    className="border p-2 rounded-md"
                                    value={entry.end_time}
                                    onChange={(e) => updateSchedule(day.value, index, "end_time", e.target.value)}
                                >
                                    <option value="">Chọn giờ kết thúc</option>
                                    {hours.map((hour) => (
                                        <option key={hour} value={hour}>{hour}:00</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <button type="submit" className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md">
                Lưu lịch trình
            </button>
        </form>
    );
};

export default ScheduleForm;
