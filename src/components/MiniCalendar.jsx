import React from 'react';
import { getDateString } from '../hooks/useDashboardData';

export function MiniCalendar({ tasks, todayStr, onNavigate }) {
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - currentDayOfWeek);

    const dayNames = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
    const days = [];

    for(let i = 0; i < 7; i++) {
        const d = new Date(sunday);
        d.setDate(sunday.getDate() + i);
        const dStr = getDateString(d);

        const starts = tasks.filter(t => t.startDate === dStr && !t.completed);
        const dues = tasks.filter(t => t.dueDate === dStr && !t.completed);
        const isToday = dStr === todayStr;

        days.push(
            // החזרנו את data-date הנה
            <div key={i} className={`calendar-day ${isToday ? 'today' : ''}`} data-date={dStr} style={{ minHeight: 'auto', padding: '15px 5px' }}>
                <div className="calendar-day-header">{dayNames[i]}</div>
                <div className="calendar-date" style={{ color: isToday ? 'var(--accent-teal)' : 'inherit' }}>{d.getDate()}</div>
                <div className="calendar-indicators">
                    {starts.map(t => <div key={`s-${t.id}`} className="indicator-start" />)}
                    {dues.map(t => <div key={`d-${t.id}`} className="indicator-due" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="card" id="mini-calendar-card" style={{ marginBottom: '25px', cursor: 'pointer', transition: '0.2s' }} onClick={onNavigate}>
            <div className="card-header" style={{ marginBottom: '15px', borderBottom: 'none', paddingBottom: 0 }}>
                <span><i className="fa-regular fa-calendar" style={{color: 'var(--accent-teal)'}}></i> השבוע הקרוב</span>
                <i className="fa-solid fa-chevron-left" style={{color: 'var(--text-muted)', fontSize: '14px'}}></i>
            </div>
            <div className="calendar-grid">
                {days}
            </div>
        </div>
    );
}