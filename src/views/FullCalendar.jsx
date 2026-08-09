import React, { useState } from 'react';
import { getDateString } from '../hooks/useDashboardData';

export default function FullCalendar({ tasks, onAdd }) {
    const [currentViewMonth, setCurrentViewMonth] = useState(new Date().getMonth());
    const [currentViewYear, setCurrentViewYear] = useState(new Date().getFullYear());
    const todayStr = getDateString(new Date());

    const [selectedDateToAdd, setSelectedDateToAdd] = useState(null);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDueDate, setNewTaskDueDate] = useState('');

    const monthNames = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
    const dayNames = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

    const getTasksForDate = (dateStr) => {
        const starts = (tasks || []).filter(t => t.startDate === dateStr && !t.completed);
        const dues = (tasks || []).filter(t => t.dueDate === dateStr && !t.completed);
        return { starts, dues };
    };

    const firstDay = new Date(currentViewYear, currentViewMonth, 1).getDay();
    const daysInMonth = new Date(currentViewYear, currentViewMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentViewYear, currentViewMonth, 0).getDate();

    const renderDays = () => {
        const days = [];
        for (let i = firstDay - 1; i >= 0; i--) {
            const d = new Date(currentViewYear, currentViewMonth - 1, prevMonthDays - i);
            days.push(createDayElement(d, false));
        }
        for (let i = 1; i <= daysInMonth; i++) {
            const d = new Date(currentViewYear, currentViewMonth, i);
            days.push(createDayElement(d, true));
        }
        const remaining = 42 - days.length;
        for (let i = 1; i <= remaining; i++) {
            const d = new Date(currentViewYear, currentViewMonth + 1, i);
            days.push(createDayElement(d, false));
        }
        return days;
    };

    const createDayElement = (dateObj, isCurrentMonth) => {
        const dStr = getDateString(dateObj);
        const { starts, dues } = getTasksForDate(dStr);
        const isToday = dStr === todayStr;
        const isPast = dStr < todayStr;

        return (
            <div 
                key={dStr} 
                className={`calendar-day ${isToday ? 'today' : ''}`} 
                data-date={dStr}
                style={{ 
                    opacity: isCurrentMonth ? 1 : 0.4,
                    display: 'flex', 
                    flexDirection: 'column', 
                    height: '100%', 
                    minHeight: 0,
                    border: isToday ? '1px solid var(--accent-teal, #4fd1c5)' : '1px solid var(--border-color)', 
                    borderRadius: '6px', 
                    padding: '10px',
                    cursor: isPast ? 'default' : 'pointer',
                    transition: '0.2s',
                    backgroundColor: isPast ? 'rgba(0,0,0,0.15)' : (isToday ? 'rgba(79, 209, 197, 0.08)' : undefined)
                }}
                onClick={() => {
                    if (!isPast) setSelectedDateToAdd(dStr);
                }}
            >
                <div className="calendar-date" style={{ fontWeight: 'bold', marginBottom: '5px', color: isToday ? 'var(--accent-teal, #4fd1c5)' : 'inherit' }}>{dateObj.getDate()}</div>
                <div className="calendar-indicators" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {starts.map(t => <div key={`s-${t.id}`} className="indicator-start" title={t.title}></div>)}
                    {dues.map(t => <div key={`d-${t.id}`} className="indicator-due" title={t.title}></div>)}
                </div>
            </div>
        );
    };

    const handleSaveTask = () => {
        if (newTaskTitle.trim() && onAdd) {
            onAdd('tasks', {
                id: Date.now(),
                title: newTaskTitle.trim(),
                startDate: selectedDateToAdd,
                dueDate: newTaskDueDate || null,
                completed: false,
                completedAt: null
            });
            closeModal();
        }
    };

    const closeModal = () => {
        setNewTaskTitle('');
        setNewTaskDueDate('');
        setSelectedDateToAdd(null);
    };

    return (
        <div className="card view-card" style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '15px 25px', minHeight: 0, height: '100%' }}>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '10px', flexShrink: 0}}>
                <button className="icon-btn" onClick={() => { if(currentViewMonth===0){setCurrentViewMonth(11);setCurrentViewYear(y=>y-1)} else setCurrentViewMonth(m=>m-1) }}><i className="fa-solid fa-chevron-right" style={{fontSize:'20px'}}></i></button>
                <h2 style={{minWidth: '150px', textAlign: 'center', margin: 0}}>{monthNames[currentViewMonth]} {currentViewYear}</h2>
                <button className="icon-btn" onClick={() => { if(currentViewMonth===11){setCurrentViewMonth(0);setCurrentViewYear(y=>y+1)} else setCurrentViewMonth(m=>m+1) }}><i className="fa-solid fa-chevron-left" style={{fontSize:'20px'}}></i></button>
            </div>
            
            <div className="calendar-legend" style={{marginBottom: '15px', display: 'flex', gap: '15px', fontSize: '13px', color: 'var(--text-muted)', flexShrink: 0}}>
                <div><span className="indicator-start" style={{display:'inline-block', marginLeft:'5px'}}></span>תחילת עבודה</div>
                <div><span className="indicator-due" style={{display:'inline-block', marginLeft:'5px'}}></span>תאריך יעד (תג"ב)</div>
            </div>
            
            <div style={{
                display: 'grid', 
                gridTemplateColumns: 'repeat(7, 1fr)', 
                gridTemplateRows: '25px repeat(6, 1fr)', 
                gap: '10px', 
                flex: 1, 
                minHeight: 0 
            }}>
                {dayNames.map(d => <div key={d} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--text-muted)' }}>{d}</div>)}
                {renderDays()}
            </div>

            {selectedDateToAdd && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <span><i className="fa-solid fa-calendar-plus" style={{marginLeft: '10px'}}></i>משימה ל-{selectedDateToAdd.split('-').reverse().join('/')}</span>
                            <button className="icon-btn" onClick={closeModal}>
                                <i className="fa-solid fa-xmark" style={{fontSize: '20px'}}></i>
                            </button>
                        </div>
                        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input 
                                autoFocus 
                                type="text" 
                                placeholder="מה תרצה לבצע?" 
                                value={newTaskTitle} 
                                onChange={(e) => setNewTaskTitle(e.target.value)} 
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveTask()}
                                className="inline-edit-input"
                                style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '15px' }}
                            />
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>תאריך יעד (תג"ב - אופציונלי):</label>
                                <input 
                                    type="date" 
                                    value={newTaskDueDate} 
                                    onChange={(e) => setNewTaskDueDate(e.target.value)} 
                                    className="inline-edit-input"
                                    min={selectedDateToAdd}
                                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '14px', fontFamily: 'inherit' }}
                                />
                            </div>

                            <button className="btn-primary" onClick={handleSaveTask}>הוסף משימה</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}