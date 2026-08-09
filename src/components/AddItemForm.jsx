import React, { useState } from 'react';

export function AddItemForm({ placeholder, onSubmit, showDates = false }) {
    const [text, setText] = useState('');
    const [startDate, setStartDate] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault(); // מונע מהדף להתרענן בלחיצה על אנטר או על הכפתור
        
        if (!text.trim()) return;

        // שולחים את הנתונים למעלה בחזרה לאב
        onSubmit({ text: text.trim(), startDate, dueDate });
        
        // מנקים את השדות אחרי ההוספה
        setText('');
        setStartDate('');
        setDueDate('');
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input 
                type="text" 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={placeholder}
                style={{ flexGrow: 1, padding: '8px', background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid #444', borderRadius: '4px' }}
            />
            
            {showDates && (
                <>
                    <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        title="תאריך התחלה"
                        style={{ padding: '8px', background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid #444', borderRadius: '4px' }}
                    />
                    <input 
                        type="date" 
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        title="תאריך יעד"
                        style={{ padding: '8px', background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid #444', borderRadius: '4px' }}
                    />
                </>
            )}
            
            <button type="submit" className="btn">הוסף <i className="fa-solid fa-plus"></i></button>
        </form>
    );
}