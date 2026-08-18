import React, { useState } from 'react';
import { TaskItem } from '../components/TaskItem';

export default function CustomPage({ page, onToggle, onDelete, onEdit, onAdd, onReorder }) {
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [dueDate, setDueDate] = useState('');

    const tasks = page.tasks || [];
    const openTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

    const handleAdd = () => {
        if (title.trim()) {
            onAdd('custom', {
                pageId: page.id,
                task: {
                    id: Date.now(),
                    title: title.trim(),
                    startDate,
                    dueDate,
                    completed: false,
                    completedAt: null
                }
            });
            setTitle('');
            setStartDate('');
            setDueDate('');
        }
    };

    const openDatePicker = (e) => {
        if (e.target.showPicker) e.target.showPicker();
    };

    return (
        <div className="card view-card" style={{ padding: '25px', display: 'flex', flexDirection: 'column', height: 'auto', minHeight: 'unset', overflow: 'visible' }}>
            <div className="add-task-bar">
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()} 
                    placeholder="משימה חדשה לדף זה..." 
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
                {/* משימות פתוחות */}
                <ul className="task-list full-list" style={{ maxHeight: 'none', overflow: 'visible' }}>
                    {openTasks.length === 0 ? (
                        <li style={{ color: 'var(--text-muted)' }}>אין משימות פתוחות בדף זה.</li>
                    ) : (
                        openTasks.map((task, index) => (
                            <li key={task.id} style={{ listStyle: 'none' }}>
                                <TaskItem 
                                    item={task} 
                                    index={index}
                                    collectionName="custom" 
                                    customPageId={page.id}
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
                                        collectionName="custom" 
                                        customPageId={page.id}
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