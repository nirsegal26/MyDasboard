import React, { useState } from 'react';
import { TaskItem } from '../components/TaskItem';

export default function CustomPage({ page, onToggle, onDelete, onEdit, onAdd }) {
    const [title, setTitle] = useState('');

    const handleAdd = () => {
        if (title.trim()) {
            onAdd('custom', { pageId: page.id, task: { id: Date.now(), title: title.trim(), completed: false, completedAt: null } });
            setTitle('');
        }
    };

    return (
        <div className="card">
            <div className="add-task-bar">
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAdd()} placeholder="הוסף פריט לרשימה..." style={{flex: 1}} />
                <button className="btn-primary" onClick={handleAdd}>הוסף</button>
            </div>
            <ul className="task-list full-list">
                {!page.tasks || page.tasks.length === 0 ? <li style={{color: 'var(--text-muted)'}}>הרשימה ריקה.</li> : 
                    page.tasks.map(task => (
                        <TaskItem key={task.id} item={task} collectionName="custom" customPageId={page.id} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
                    ))
                }
            </ul>
        </div>
    );
}