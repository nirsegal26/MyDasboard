import React, { useState } from 'react';
import { TaskItem } from '../components/TaskItem';
import { MiniCalendar } from '../components/MiniCalendar';

export default function Dashboard({ state, todayStr, onToggle, onDelete, onEdit, onAdd, onNavigate }) {
    const [newNote, setNewNote] = useState('');
    const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);

    const [editingHabitId, setEditingHabitId] = useState(null);
    const [editHabitText, setEditHabitText] = useState('');
    const [isAddingHabit, setIsAddingHabit] = useState(false);
    const [newHabitText, setNewHabitText] = useState('');

    const handleAddNote = () => {
        if (newNote.trim()) {
            onAdd('notes', { id: Date.now(), content: newNote.trim(), date: todayStr });
            setNewNote('');
        }
    };

    const saveHabitEdit = (id) => {
        if (editHabitText.trim()) onEdit(id, 'habits', editHabitText.trim());
        setEditingHabitId(null);
    };

    const saveNewHabit = () => {
        if (newHabitText.trim()) onAdd('habits', { id: Date.now(), title: newHabitText.trim(), completedDates: [] });
        setIsAddingHabit(false);
        setNewHabitText('');
    };

    // סינון משימות פתוחות להיום
    const openTasksToday = (state.tasks || []).filter(task => {
        const isRelevantToday = !task.startDate || task.startDate <= todayStr;
        return isRelevantToday && !task.completed;
    });

    const dashboardTasks = (state.tasks || []).filter(task => {
        const isRelevantToday = !task.startDate || task.startDate <= todayStr;
        const isCompletedToday = task.completed && task.completedAt === todayStr;
        return (isRelevantToday && !task.completed) || isCompletedToday;
    }).sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
    });

    const currentDayOfWeek = new Date().getDay();
    const visibleHabits = (state.habits || []).filter(habit => {
        const habitName = habit.title || habit.name || '';
        if (habitName.includes('תפילין') && currentDayOfWeek === 6) return false;
        return true;
    });

    return (
        <div className="dashboard-container">
            <div className="dashboard-top">
                <MiniCalendar tasks={state.tasks || []} todayStr={todayStr} onNavigate={() => onNavigate('calendar')} />
            </div>

            <div className="dashboard-middle">
                {/* 1. משימות פתוחות להיום עם מספר המשימות הפתוחות */}
                <div className="card">
                    <div className="card-header hover-header" onClick={() => setIsTasksModalOpen(true)} title="לחץ לפתיחת כל המשימות בחלון">
                        <span>
                            <i className="fa-solid fa-rocket" style={{color: 'var(--accent-teal)'}}></i> 
                            משימות פתוחות להיום ({openTasksToday.length})
                        </span>
                        <i className="fa-solid fa-expand" style={{color: 'var(--text-muted)'}}></i>
                    </div>
                    <ul className="task-list no-drag">
                        {dashboardTasks.length === 0 ? (
                            <li style={{color: 'var(--text-muted)', padding: '10px'}}>אין משימות פתוחות להיום.</li>
                        ) : (
                            dashboardTasks.map(task => (
                                <TaskItem key={task.id} item={task} collectionName="tasks" onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} hideDragHandle={true} />
                            ))
                        )}
                    </ul>
                </div>

                {/* 2. מעקב הרגלים יומי */}
                <div className="card">
                    <div className="card-header">
                        <span><i className="fa-solid fa-leaf" style={{color: 'var(--accent-teal)'}}></i> מעקב הרגלים יומי</span>
                        {!isAddingHabit && (
                            <button className="icon-btn" onClick={() => setIsAddingHabit(true)}><i className="fa-solid fa-plus"></i></button>
                        )}
                    </div>
                    <ul className="habits-list">
                        {isAddingHabit && (
                            <li className="task-item" style={{ padding: '8px 10px', border: '1px solid var(--accent-teal)' }}>
                                <input autoFocus type="text" className="inline-edit-input" placeholder="שם ההרגל..." value={newHabitText} onChange={(e) => setNewHabitText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveNewHabit()} />
                                <button className="icon-btn" style={{color: 'var(--accent-teal)', marginRight: '5px'}} onClick={saveNewHabit}><i className="fa-solid fa-check"></i></button>
                                <button className="icon-btn" onClick={() => setIsAddingHabit(false)}><i className="fa-solid fa-xmark"></i></button>
                            </li>
                        )}
                        {visibleHabits.length === 0 && !isAddingHabit ? (
                            <li style={{color: 'var(--text-muted)', padding: '10px'}}>אין הרגלים למעקב.</li>
                        ) : (
                            visibleHabits.map(habit => {
                                const isCompletedToday = habit.completedDates?.includes(todayStr);
                                const displayName = habit.title || habit.name || 'הרגל';
                                const isEditing = editingHabitId === habit.id;

                                return (
                                    <li key={habit.id} className="task-item" style={{ padding: '12px 10px' }}>
                                        {isEditing ? (
                                            <div style={{display: 'flex', gap: '5px', flex: 1, alignItems: 'center'}}>
                                                <input autoFocus type="text" className="inline-edit-input" value={editHabitText} onChange={(e) => setEditHabitText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveHabitEdit(habit.id)} />
                                                <button className="icon-btn" style={{color: 'var(--accent-teal)'}} onClick={() => saveHabitEdit(habit.id)}><i className="fa-solid fa-check"></i></button>
                                                <button className="icon-btn" onClick={() => setEditingHabitId(null)}><i className="fa-solid fa-xmark"></i></button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="task-actions">
                                                    <button className="icon-btn" onClick={() => onDelete(habit.id, 'habits')}><i className="fa-solid fa-trash"></i></button>
                                                    <button className="icon-btn" onClick={() => {
                                                        setEditHabitText(displayName);
                                                        setEditingHabitId(habit.id);
                                                    }}><i className="fa-solid fa-pen"></i></button>
                                                </div>
                                                <div className="task-content">
                                                    <span className="task-text">{displayName}</span>
                                                </div>
                                                <input type="checkbox" className="custom-checkbox" checked={isCompletedToday} onChange={() => onToggle(habit.id, 'habits')} />
                                            </>
                                        )}
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>

                {/* 3. פתקים ורעיונות */}
                <div className="card notes-card">
                    <div className="card-header">
                        <span><i className="fa-solid fa-pen-to-square" style={{color: 'var(--accent-teal)'}}></i> פתקים ורעיונות</span>
                    </div>
                    <ul className="notes-list">
                        {(state.notes || []).length === 0 ? (
                            <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', color:'var(--text-muted)', opacity: 0.5, padding: '30px 0'}}>
                                <h2 style={{fontSize: '2rem', margin: 0}}>אין פתקים.</h2>
                            </div>
                        ) : (
                            state.notes.map(note => (
                                <li key={note.id} className="task-item" style={{justifyContent: 'space-between', padding: '12px 10px'}}>
                                    <button className="icon-btn" onClick={() => onDelete(note.id, 'notes')}><i className="fa-solid fa-trash"></i></button>
                                    <span className="task-text" style={{flex: 1, textAlign: 'right', paddingRight: '15px'}}>{note.content}</span>
                                </li>
                            ))
                        )}
                    </ul>
                    <div className="add-task-bar" style={{marginTop: 'auto', paddingTop: '15px', marginBottom: '0'}}>
                        <button className="btn-primary" onClick={handleAddNote}>שמור</button>
                        <input type="text" value={newNote} onChange={(e) => setNewNote(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddNote()} placeholder="הוסף פתק חדש..." style={{ flex: 1 }} />
                    </div>
                </div>
            </div>

            {isTasksModalOpen && (
                <div className="modal-overlay" onClick={() => setIsTasksModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <span><i className="fa-solid fa-rocket"></i> כל משימות היום</span>
                            <button className="icon-btn" onClick={() => setIsTasksModalOpen(false)}><i className="fa-solid fa-xmark" style={{fontSize: '20px'}}></i></button>
                        </div>
                        <div className="modal-body">
                            <ul className="task-list no-drag" style={{maxHeight: 'none'}}>
                                {dashboardTasks.length === 0 ? (
                                    <li style={{color: 'var(--text-muted)'}}>אין משימות להיום.</li>
                                ) : (
                                    dashboardTasks.map(task => (
                                        <TaskItem key={task.id} item={task} collectionName="tasks" onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} hideDragHandle={true} />
                                    ))
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}