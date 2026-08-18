import { useState, useEffect } from 'react';

const STORAGE_KEY = 'dashboard_app_data';

export const getDateString = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const initialData = {
    tasks: [],
    goals: [],
    habits: [],
    notes: [],
    marineAnimals: [],
    customPages: [],
    archive: []
};

export function useDashboardData() {
    const [state, setState] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                return {
                    tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
                    goals: Array.isArray(parsed.goals) ? parsed.goals : [],
                    habits: Array.isArray(parsed.habits) ? parsed.habits : [],
                    notes: Array.isArray(parsed.notes) ? parsed.notes : [],
                    marineAnimals: Array.isArray(parsed.marineAnimals) ? parsed.marineAnimals : [],
                    customPages: Array.isArray(parsed.customPages) ? parsed.customPages : [],
                    archive: Array.isArray(parsed.archive) ? parsed.archive : []
                };
            }
        } catch (e) {
            console.error('Error loading data from localStorage:', e);
        }
        return initialData;
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error('Error saving data to localStorage:', e);
        }
    }, [state]);

    return [state, setState];
}