import React, { useState, useRef, useEffect } from 'react';

export function TaskItem({ item, collectionName, customPageId = null, onToggle, onDelete, onEdit, isDashboard = false }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(item.title || item.name);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isEditing && inputRef.current) inputRef.current.focus();
    }, [isEditing]);

    const handleSave = () => {
        if (editText.trim() !== '' && editText !== (item.title || item.name)) {
            onEdit(item.id, collectionName, editText.trim(), customPageId);
        }
        setIsEditing(false);
    };

    const isCompleted = collectionName === 'habits' 
        ? (item.completedDates && item.completedDates.includes(item.todayStr || new Date().toISOString().split('T')[0]))
        : item.completed;

    return (
        <li className={`task-item ${isCompleted ? 'completed' : ''}`}>
            <div className="task-content">
                {collectionName === 'tasks' && !isDashboard && (
                    <i className="fa-solid fa-grip-vertical drag-handle" title="גרור לשינוי סדר"></i>
                )}
                <input 
                    type="checkbox" 
                    className="task-checkbox" 
                    checked={isCompleted || false} 
                    onChange={() => onToggle(item.id, collectionName, customPageId)} 
                />
                <div style={{ flexGrow: 1 }}>
                    {isEditing ? (
                        <input 
                            ref={inputRef} type="text" value={editText} onChange={e => setEditText(e.target.value)}
                            onKeyDown={e => { if(e.key === 'Enter') handleSave(); if(e.key === 'Escape') { setEditText(item.title || item.name); setIsEditing(false); } }}
                            onBlur={handleSave}
                            style={{ width: '90%', maxWidth: '300px', padding: '4px', border: '1px solid var(--accent-teal)', background: 'var(--bg-color)', color: 'var(--text-main)' }}
                        />
                    ) : (
                        <div className="task-text">{item.title || item.name}</div>
                    )}
                    {(item.startDate || item.dueDate) && (
                        <div className="task-meta">
                            {item.startDate && <span>התחלה: {item.startDate}</span>}
                            {item.dueDate && <span>תג"ב: {item.dueDate}</span>}
                        </div>
                    )}
                </div>
            </div>
            <div className="task-actions">
                <button className="icon-btn edit-btn" onClick={() => setIsEditing(true)}><i className="fa-solid fa-pen"></i></button>
                <button className="icon-btn delete-btn" onClick={() => onDelete(item.id, collectionName, customPageId)}><i className="fa-solid fa-trash"></i></button>
            </div>
        </li>
    );
}