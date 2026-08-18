import React, { useState } from 'react';
import { TaskItem } from '../components/TaskItem';

export default function Goals({ goals = [], onToggle, onDelete, onEdit, onAdd, onReorder }) {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleAdd = () => {
        if (title.trim()) {
            onAdd('goals', { 
                id: Date.now(), 
                title: title.trim(), 
                dueDate, 
                completed: false, 
                completedAt: null 
            });
            setTitle(''); 
            setDueDate('');
        }
    };

    const openDatePicker = (e) => {
        if (e.target.showPicker) e.target.showPicker();
    };

    const openGoals = goals.filter(goal => !goal.completed);
    const completedGoals = goals.filter(goal => goal.completed);

    return (
        <div className="card view-card" style={{ padding: '25px', display: 'flex', flexDirection: 'column', height: 'auto', minHeight: 'unset', overflow: 'visible' }}>
            <div className="add-task-bar">
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()} 
                    placeholder="מטרה חדשה..." 
                    style={{ flex: 2 }} 
                />
                <div className="date-input-group">
                    <label>יעד להשגה:</label>
                    <input 
                        type="date" 
                        value={dueDate} 
                        onChange={(e) => setDueDate(e.target.value)} 
                        onClick={openDatePicker}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <button className="btn-primary" onClick={handleAdd}>הוסף מטרה</button>
            </div>
            
            <div style={{ overflow: 'visible' }}>
                {/* מטרות פתוחות */}
                <ul className="task-list full-list" style={{ maxHeight: 'none', overflow: 'visible' }}>
                    {openGoals.length === 0 ? (
                        <li style={{ color: 'var(--text-muted)' }}>אין מטרות פתוחות.</li>
                    ) : (
                        openGoals.map((goal, index) => (
                            <li key={goal.id} style={{ listStyle: 'none' }}>
                                <TaskItem 
                                    item={goal} 
                                    index={index}
                                    collectionName="goals" 
                                    onToggle={onToggle} 
                                    onDelete={onDelete} 
                                    onEdit={onEdit} 
                                />
                            </li>
                        ))
                    )}
                </ul>

                {/* בלוק מטרות שהוגשמו - ללא גלילה פנימית */}
                {completedGoals.length > 0 && (
                    <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', overflow: 'visible' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fa-solid fa-trophy"></i> מטרות שהוגשמו ({completedGoals.length})
                        </h3>
                        <ul className="task-list no-drag" style={{ opacity: 0.75, maxHeight: 'none', overflow: 'visible' }}>
                            {completedGoals.map(goal => (
                                <li key={goal.id} style={{ listStyle: 'none' }}>
                                    <TaskItem 
                                        item={goal} 
                                        collectionName="goals" 
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