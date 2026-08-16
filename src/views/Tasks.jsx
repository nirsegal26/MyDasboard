import React, { useState } from 'react';
import { TaskItem } from '../components/TaskItem';

export default function Tasks({ tasks = [], onToggle, onDelete, onEdit, onAdd, onReorder }) {
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    
    // סטייט לניהול הגרירה
    const [draggedIdx, setDraggedIdx] = useState(null);

    const handleAdd = () => {
        if (title.trim()) {
            onAdd('tasks', { id: Date.now(), title: title.trim(), startDate, dueDate, completed: false, completedAt: null });
            setTitle(''); 
            setStartDate(''); 
            setDueDate('');
        }
    };

    const openDatePicker = (e) => {
        if (e.target.showPicker) e.target.showPicker();
    };

    // פונקציות ניהול גרירה עצמאיות
    const onDragStart = (e, index) => {
        setDraggedIdx(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index);
        setTimeout(() => { e.target.style.opacity = '0.4'; }, 0);
    };

    const onDragEnd = (e) => {
        e.target.style.opacity = '1';
        setDraggedIdx(null);
    };

    const onDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIdx === null || draggedIdx === index) return;
        
        const newTasks = [...tasks];
        const draggedTask = newTasks[draggedIdx];
        newTasks.splice(draggedIdx, 1);
        newTasks.splice(index, 0, draggedTask);
        
        if (onReorder) {
            onReorder('tasks', newTasks);
        }
        setDraggedIdx(index);
    };

    return (
        <div className="card view-card" style={{ padding: '25px', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
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
            
            <div style={{ flex: 1, overflowY: 'auto' }}>
                <ul className="task-list full-list">
                    {tasks.length === 0 ? <li style={{color: 'var(--text-muted)'}}>אין משימות.</li> : 
                        tasks.map((task, index) => (
                            <div 
                                key={task.id}
                                draggable={!task.completed} // לא מאפשר גרירה למשימות שהושלמו וירדו למטה
                                onDragStart={(e) => onDragStart(e, index)}
                                onDragEnd={onDragEnd}
                                onDragOver={(e) => onDragOver(e, index)}
                                style={{ cursor: task.completed ? 'default' : 'grab' }}
                            >
                                <TaskItem 
                                    item={task} 
                                    collectionName="tasks" 
                                    onToggle={onToggle} 
                                    onDelete={onDelete} 
                                    onEdit={onEdit} 
                                    index={index} 
                                />
                            </div>
                        ))
                    }
                </ul>
            </div>
        </div>
    );
}