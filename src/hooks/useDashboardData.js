import { useState, useEffect } from 'react';

// פונקציית עזר לתאריכים (מונעת באגים של אזורי זמן)
export const getDateString = (dateObj) => {
    const offset = dateObj.getTimezoneOffset() * 60000;
    return (new Date(dateObj - offset)).toISOString().split('T')[0];
};

const defaultState = {
    habits: [
        { id: 1, name: 'נשימות וים הוף', completedDates: [] },
        { id: 2, name: 'עמידה ביעד חלבון יומי', completedDates: [] },
        { id: 3, name: 'כתיבה ביומן תודות', completedDates: [] }
    ],
    tasks: [
        { id: 1, title: 'סיום מודול פרויקט פורטפוליו', startDate: '', dueDate: '2026-08-10', completed: false, completedAt: null },
        { id: 2, title: 'הרשמה לקורסי בחירה', startDate: '2026-09-01', dueDate: '2026-09-15', completed: false, completedAt: null }
    ],
    goals: [
        { id: 1, title: 'שיפור ביצועים במבנה נתונים', completed: false, completedAt: null }
    ],
    customPages: [],
    notes: [],
    activeCustomPageId: null
};

export function useDashboardData() {
    // טעינה ראשונית מ-LocalStorage או שימוש בברירת המחדל
    const [state, setState] = useState(() => {
        const saved = localStorage.getItem('personal_dashboard_data');
        if (!saved) return defaultState;
        
        try {
            const parsed = JSON.parse(saved);
            // מיזוג המבנה החדש עם הנתונים השמורים למניעת קריסות (Fallback)
            return { ...defaultState, ...parsed };
        } catch (e) {
            console.error("שגיאה בטעינת נתונים מהזיכרון המקומי", e);
            return defaultState;
        }
    });

    // שמירה אוטומטית ל-LocalStorage בכל פעם ש-state משתנה (מחליף את פונקציית saveState הישנה)
    useEffect(() => {
        localStorage.setItem('your_storage_key', JSON.stringify({
            tasks: state.tasks,
            goals: state.goals,
            habits: state.habits,
            marineAnimals: state.marineAnimals,
            customPages: state.customPages,
            archive: state.archive // <--- הוסף את השורה הזו חובה!
        }));
    }, [state]);

    return [state, setState];
}