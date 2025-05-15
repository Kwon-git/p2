import React, { useEffect } from 'react';
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react';
import {
    createViewWeek,
    createViewMonthGrid,
    createViewMonthAgenda,
} from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/index.css';

const TimeTable = ({ events }) => {
    const calendar = useCalendarApp({
        views: [createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
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
        <div>
            {calendar ? (
                <ScheduleXCalendar calendarApp={calendar} />
            ) : (
                <div>Loading events...</div>
            )}
        </div>
    );
};

export default TimeTable;