import React, { useState } from 'react';
import { TaskItem } from '../components/TaskItem';

export default function Goals({ goals = [], onToggle, onDelete, onEdit, onAdd }) {
    const [title, setTitle] = useState('');

    const handleAdd = () => {
        if (title.trim()) {
            onAdd('goals', { id: Date.now(), title: title.trim(), completed: false, completedAt: null });
            setTitle('');
        }
    };

    return (
        <div className="card">
            <div className="add-task-bar">
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAdd()} placeholder="הגדר מטרה חדשה..." style={{flex: 1}} />
                <button className="btn-primary" onClick={handleAdd}>הוסף מטרה</button>
            </div>
            <ul className="task-list full-list">
                {goals.length === 0 ? <li style={{color: 'var(--text-muted)'}}>אין מטרות פעילות.</li> : 
                    goals.map(goal => (
                        <TaskItem key={goal.id} item={goal} collectionName="goals" onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
                    ))
                }
            </ul>
        </div>
    );
}