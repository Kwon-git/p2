import React, { useEffect } from 'react';
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react';
import {
    createViewDay,
    createViewWeek,
    createViewMonthGrid,
    createViewMonthAgenda,
} from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/index.css';

const TimeTable = ({ events }) => {
    const calendar = useCalendarApp({
        defaultView: 'week',
        views: [
            createViewDay(),
            createViewWeek(
                { gridHeight: 1500, }
            ),
            createViewMonthGrid(),
            createViewMonthAgenda(),
        ],
        dayBoundaries: {
            start: '08:00',
            end: '20:00',
        },
        events: [], // Initialize with empty events
        plugins: [],
    });

    // Update calendar events when the events prop changes
    useEffect(() => {
        if (calendar && events) {
            calendar.events.set(events); // Update the calendar's events
        }
    }, [calendar, events]); // Run when calendar or events change

    return (
        <div className="sx-react-calendar-wrapper w-[1150px] h-[900px]  border rounded-lg shadow mx-auto">
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
