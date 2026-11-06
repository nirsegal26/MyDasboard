import React, { useState } from 'react';

const DAYS = [
    { key: 'sunday', name: " ראשון" },
    { key: 'monday', name: " שני" },
    { key: 'tuesday', name: " שלישי" },
    { key: 'wednesday', name: " רביעי" },
    { key: 'thursday', name: " חמישי" },
    { key: 'friday', name: " שישי" }
];

const DEFAULT_HOURS = [
    "08:30", "09:30", "10:30", "11:30", "12:50", 
    "13:50", "14:50", "15:50", "16:50", "17:50" 
];

const EVENT_COLORS = [
    { label: 'טורקיז', val: 'rgba(79, 209, 197, 0.25)', border: 'var(--accent-teal)' },
    { label: 'כתום', val: 'rgba(246, 173, 85, 0.25)', border: 'var(--accent-orange)' },
    { label: 'סגול', val: 'rgba(167, 139, 250, 0.25)', border: '#a78bfa' },
    { label: 'כחול', val: 'rgba(96, 165, 250, 0.25)', border: '#60a5fa' },
    { label: 'ירוק', val: 'rgba(74, 222, 128, 0.25)', border: '#4ade80' }
];

export default function Schedule({ scheduleEvents = [], onSaveEvent, onDeleteEvent }) {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [subject, setSubject] = useState('');
    const [location, setLocation] = useState('');
    const [color, setColor] = useState(EVENT_COLORS[0].val);

    const handleCellClick = (dayKey, hour) => {
        const existing = scheduleEvents.find(e => e.day === dayKey && e.hour === hour);
        if (existing) {
            setSubject(existing.subject || '');
            setLocation(existing.location || '');
            setColor(existing.color || EVENT_COLORS[0].val);
            setSelectedSlot({ day: dayKey, hour, id: existing.id });
        } else {
            setSubject('');
            setLocation('');
            setColor(EVENT_COLORS[0].val);
            setSelectedSlot({ day: dayKey, hour, id: null });
        }
    };

    const handleSave = () => {
        if (!subject.trim()) return;
        onSaveEvent({
            id: selectedSlot.id || 'sch_' + Date.now(),
            day: selectedSlot.day,
            hour: selectedSlot.hour,
            subject: subject.trim(),
            location: location.trim(),
            color: color
        });
        setSelectedSlot(null);
    };

    const handleDelete = () => {
        if (selectedSlot.id) {
            onDeleteEvent(selectedSlot.id);
        }
        setSelectedSlot(null);
    };

    return (
        <div 
            className="card view-card" 
            style={{ 
                padding: '25px', 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%', 
                boxSizing: 'border-box',
                overflow: 'hidden' 
            }}
        >
            <div 
                style={{ 
                    flex: 1, 
                    overflowX: 'auto', 
                    overflowY: 'hidden', 
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid var(--border-color)', 
                    borderRadius: '10px' 
                }}
            >
                <table 
                    style={{ 
                        width: '100%', 
                        height: '100%', 
                        borderCollapse: 'collapse', 
                        textAlign: 'center', 
                        minWidth: '700px' 
                    }}
                >
                    <thead>
                        <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '14px', width: '90px', borderLeft: '1px solid var(--border-color)' }}>שעה</th>
                            {DAYS.map(d => (
                                <th key={d.key} style={{ padding: '14px', borderLeft: '1px solid var(--border-color)', fontSize: '14px' }}>
                                    {d.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {DEFAULT_HOURS.map(hour => (
                            <tr key={hour} style={{ borderBottom: '1px solid var(--border-color)', height: '1px' }}>
                                <td style={{ 
                                    padding: '8px', 
                                    fontWeight: 'bold', 
                                    fontSize: '13px', 
                                    color: 'var(--text-muted)', 
                                    borderLeft: '1px solid var(--border-color)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.01)'
                                }}>
                                    {hour}
                                </td>
                                {DAYS.map(day => {
                                    const event = scheduleEvents.find(e => e.day === day.key && e.hour === hour);
                                    return (
                                        <td 
                                            key={day.key} 
                                            onClick={() => handleCellClick(day.key, hour)}
                                            style={{ 
                                                borderLeft: '1px solid var(--border-color)', 
                                                cursor: 'pointer',
                                                padding: '6px 8px',
                                                transition: 'background 0.2s',
                                                verticalAlign: 'top',
                                                backgroundColor: event ? event.color : 'transparent'
                                            }}
                                        >
                                            {event ? (
                                                <div style={{ padding: '4px', borderRadius: '4px' }}>
                                                    <div style={{ fontWeight: 'bold', fontSize: '13px', color: 'var(--text-main)' }}>
                                                        {event.subject}
                                                    </div>
                                                    {event.location && (
                                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                            <i className="fa-solid fa-location-dot" style={{ marginLeft: '3px' }}></i>
                                                            {event.location}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div style={{ height: '100%' }} />
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedSlot && (
                <div className="modal-overlay" onClick={() => setSelectedSlot(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <span>
                                <i className="fa-regular fa-clock" style={{ marginLeft: '8px', color: 'var(--accent-teal)' }}></i>
                                שיבוץ: {DAYS.find(d => d.key === selectedSlot.day)?.name} בשעה {selectedSlot.hour}
                            </span>
                            <button className="icon-btn" onClick={() => setSelectedSlot(null)}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>שם הקורס / האירוע:</label>
                                <input 
                                    autoFocus
                                    type="text" 
                                    value={subject} 
                                    onChange={(e) => setSubject(e.target.value)} 
                                    className="inline-edit-input"
                                    style={{ padding: '10px', borderRadius: '6px' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>מיקום / כיתה:</label>
                                <input 
                                    type="text" 
                                    value={location} 
                                    onChange={(e) => setLocation(e.target.value)} 
                                    className="inline-edit-input"
                                    style={{ padding: '10px', borderRadius: '6px' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>צבע תצוגה:</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {EVENT_COLORS.map(c => (
                                        <div 
                                            key={c.label}
                                            onClick={() => setColor(c.val)}
                                            style={{
                                                width: '28px',
                                                height: '28px',
                                                borderRadius: '50%',
                                                backgroundColor: c.border,
                                                cursor: 'pointer',
                                                border: color === c.val ? '3px solid white' : '2px solid transparent'
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button className="btn-primary" style={{ flex: 1 }} onClick={handleSave}>שמור</button>
                                {selectedSlot.id && (
                                    <button className="btn-danger" style={{ flex: 1 }} onClick={handleDelete}>מחק שיעור</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}