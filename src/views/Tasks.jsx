import React, { useState } from 'react';
import { TaskItem } from '../components/TaskItem';

export default function Tasks({ tasks = [], onToggle, onDelete, onEdit, onAdd, onReorder }) {
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleAdd = () => {
        if (title.trim()) {
            onAdd('tasks', { id: Date.now(), title: title.trim(), startDate, dueDate, completed: false, completedAt: null });
            setTitle(''); 
            setStartDate(''); 
            setDueDate('');
        }
    };

    // פונקציה לפתיחה כפויה של חלונית התאריך המובנית בדפדפן
    const openDatePicker = (e) => {
        if (e.target.showPicker) {
            e.target.showPicker();
        }
    };

    return (
        <div className="card">
            <div className="add-task-bar">
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()} 
                    placeholder="שם המשימה..." 
                    style={{flex: 2}} 
                />
                <div className="date-input-group">
                    <label>תחילת עבודה:</label>
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                        onClick={openDatePicker}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <div className="date-input-group">
                    <label>תג"ב:</label>
                    <input 
                        type="date" 
                        value={dueDate} 
                        onChange={(e) => setDueDate(e.target.value)} 
                        onClick={openDatePicker}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <button className="btn-primary" onClick={handleAdd}>הוסף משימה</button>
            </div>
            <ul className="task-list full-list">
                {tasks.length === 0 ? <li style={{color: 'var(--text-muted)'}}>אין משימות.</li> : 
                    tasks.map(task => (
                        <TaskItem key={task.id} item={task} collectionName="tasks" onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
                    ))
                }
            </ul>
        </div>
    );
}