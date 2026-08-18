import React, { useState } from 'react';
import { TaskItem } from '../components/TaskItem';

export default function Tasks({ tasks = [], onToggle, onDelete, onEdit, onAdd, onReorder }) {
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [draggedIdx, setDraggedIdx] = useState(null);

    const handleAdd = () => {
        if (title.trim()) {
            onAdd('tasks', { 
                id: Date.now(), 
                title: title.trim(), 
                startDate, 
                dueDate, 
                completed: false, 
                completedAt: null 
            });
            setTitle(''); 
            setStartDate(''); 
            setDueDate('');
        }
    };

    const openDatePicker = (e) => {
        if (e.target.showPicker) e.target.showPicker();
    };

    const openTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    const handleDragStart = (e, index) => {
        setDraggedIdx(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, targetIndex) => {
        e.preventDefault();
        if (draggedIdx === null || draggedIdx === targetIndex) return;

        const updatedOpenTasks = [...openTasks];
        const [movedTask] = updatedOpenTasks.splice(draggedIdx, 1);
        updatedOpenTasks.splice(targetIndex, 0, movedTask);

        setDraggedIdx(targetIndex);
        if (onReorder) {
            onReorder('tasks', [...updatedOpenTasks, ...completedTasks]);
        }
    };

    const handleDragEnd = () => {
        setDraggedIdx(null);
    };

    return (
        <div className="card view-card" style={{ padding: '25px', display: 'flex', flexDirection: 'column', height: 'auto', minHeight: 'unset', overflow: 'visible' }}>
            <div className="add-task-bar">
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()} 
                    placeholder="שם המשימה..." 
                    style={{ flex: 2 }} 
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
            
            <div style={{ overflow: 'visible' }}>
                {/* בלוק משימות פתוחות */}
                <ul className="task-list full-list" style={{ maxHeight: 'none', overflow: 'visible' }}>
                    {openTasks.length === 0 ? (
                        <li style={{ color: 'var(--text-muted)' }}>אין משימות פתוחות.</li>
                    ) : (
                        openTasks.map((task, index) => (
                            <li 
                                key={task.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragEnd={handleDragEnd}
                                style={{
                                    listStyle: 'none',
                                    opacity: draggedIdx === index ? 0.4 : 1,
                                    cursor: 'grab'
                                }}
                            >
                                <TaskItem 
                                    item={task} 
                                    index={index}
                                    collectionName="tasks" 
                                    onToggle={onToggle} 
                                    onDelete={onDelete} 
                                    onEdit={onEdit} 
                                />
                            </li>
                        ))
                    )}
                </ul>

                {/* בלוק משימות שבוצעו - ללא גלילה פנימית */}
                {completedTasks.length > 0 && (
                    <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', overflow: 'visible' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fa-solid fa-circle-check"></i> משימות שבוצעו ({completedTasks.length})
                        </h3>
                        <ul className="task-list no-drag" style={{ opacity: 0.75, maxHeight: 'none', overflow: 'visible' }}>
                            {completedTasks.map(task => (
                                <li key={task.id} style={{ listStyle: 'none' }}>
                                    <TaskItem 
                                        item={task} 
                                        collectionName="tasks" 
                                        onToggle={onToggle} 
                                        onDelete={onDelete} 
                                        onEdit={onEdit} 
                                        hideDragHandle
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}