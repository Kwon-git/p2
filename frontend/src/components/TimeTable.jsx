import React, { useEffect, useState } from 'react';
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react';
import Modal from 'react-modal';
import ModalTimeTable from './ModalTimeTable';
import {
    createViewDay,
    createViewWeek,
    createViewMonthGrid,
    createViewMonthAgenda,
} from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/index.css';

const TimeTable = ({ events }) => {
    const [mssv, setMssv] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const calendar = useCalendarApp({
        defaultView: 'week',
        views: [
            createViewDay(),
            createViewWeek(),
            createViewMonthGrid(),
            createViewMonthAgenda(),
        ],
        dayBoundaries: {
            start: '07:00',
            end: '20:00',
        },
        events: [],
        callbacks: {
            onEventClick: (event) => {
                setSelectedEvent(event); // Lưu sự kiện được nhấp
                setMssv(event.title.slice(0, 8))
                setIsModalOpen(true);    // Mở modal
            },
        }
        ,
        plugins: [],
    });

    //Update calendar events when the events prop changess
    useEffect(() => {
        if (calendar && events) {
            calendar.events.set(events); // Update the calendar's events
        }
    }, [calendar, events]); // Run when calendar or events change


    return (
        <div className="sx-react-calendar-wrapper w-[1400px] h-[580px]  border rounded-lg shadow mx-auto ">
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        zIndex: 1000
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

                <ModalTimeTable event={selectedEvent} mssv={mssv} onClose={() => {
                    setIsModalOpen(false)
                }} />
            </Modal>
            {
                calendar ? (
                    <ScheduleXCalendar calendarApp={calendar} />
                ) : (
                    <div>Loading events...</div>
                )
            }
        </div >
    );
};


export default TimeTable;
