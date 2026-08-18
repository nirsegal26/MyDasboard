import React, { useState, useEffect } from 'react';
import { getDateString } from '../hooks/useDashboardData';

export default function Statistics({ state, todayStr }) {
    const [dailyFact, setDailyFact] = useState('טוען עובדה יומית...');

    useEffect(() => {
        fetch('https://uselessfacts.jsph.pl/api/v2/facts/random')
            .then(res => res.json())
            .then(data => setDailyFact(data.text))
            .catch(() => setDailyFact('Rubber bands last much longer when refrigerated.'));
    }, []);

    const currentDayOfWeekGlobal = new Date().getDay();

    // איחוד משימות פתוחות/קיימות עם משימות שהושלמו ונמחקו (ארכיון)
    const archivedTasks = (state.archive || []).filter(a => !a.archivedFrom || a.archivedFrom === 'tasks' || a.archivedFrom === 'custom');
    const archivedGoals = (state.archive || []).filter(a => a.archivedFrom === 'goals');

    const allHistoricalTasks = [...(state.tasks || []), ...archivedTasks];
    const allHistoricalGoals = [...(state.goals || []), ...archivedGoals];

    const relevantHabitsForToday = (state.habits || []).filter(h => {
        const name = h.title || h.name || '';
        return !(name.includes('תפילין') && currentDayOfWeekGlobal === 6);
    });

    const relevantTasksForToday = allHistoricalTasks.filter(t => {
        const isRelevant = !t.startDate || t.startDate <= todayStr;
        const isDoneToday = t.completed && t.completedAt === todayStr;
        return (isRelevant && !t.completed) || isDoneToday;
    });
    
    const tasksDoneToday = relevantTasksForToday.filter(t => t.completed).length;
    const totalDailyTasks = relevantTasksForToday.length;

    const totalHabits = relevantHabitsForToday.length;
    const habitsDoneToday = relevantHabitsForToday.filter(h => h.completedDates && h.completedDates.includes(todayStr)).length;

    const todayDoneTotal = tasksDoneToday + habitsDoneToday;
    const todayTargetTotal = totalDailyTasks + totalHabits;
    
    const productivity = todayTargetTotal === 0 ? 0 : Math.round((todayDoneTotal / todayTargetTotal) * 100);

    const bestHabit = (state.habits || []).length > 0 ? state.habits.reduce((prev, current) => 
        ((prev.completedDates || []).length > (current.completedDates || []).length) ? prev : current
    , state.habits[0]) : null;
    
    const bestHabitName = bestHabit ? (bestHabit.title || bestHabit.name) : '';

    const generalCount = (state.tasks || []).length;
    const goalsCount = (state.goals || []).length;
    const totalItemCount = generalCount + goalsCount;
    const generalPercent = totalItemCount > 0 ? Math.round((generalCount / totalItemCount) * 100) : 0;
    const goalsPercent = totalItemCount > 0 ? Math.round((goalsCount / totalItemCount) * 100) : 0;

    const renderHeatmap = () => {
        const today = new Date();
        const currentDayOfWeek = today.getDay();
        const sunday = new Date(today);
        sunday.setDate(today.getDate() - currentDayOfWeek);
        const dayLabels = ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"];
        const days = [];

        for (let i = 0; i < 7; i++) {
            const d = new Date(sunday);
            d.setDate(sunday.getDate() + i);
            const dayStr = getDateString(d);
            const isFuture = i > currentDayOfWeek;
            let intensity = 0;
            let percentage = 0;

            if (!isFuture) {
                const habitsDone = (state.habits || []).filter(h => h.completedDates?.includes(dayStr)).length;
                const tasksDone = allHistoricalTasks.filter(t => t.completedAt === dayStr).length;
                const goalsDone = allHistoricalGoals.filter(g => g.completedAt === dayStr).length;
                intensity = habitsDone + tasksDone + goalsDone;

                const activeTasksOnDay = allHistoricalTasks.filter(t => {
                    const started = !t.startDate || t.startDate <= dayStr;
                    const notDoneBefore = !t.completed || t.completedAt >= dayStr;
                    return started && notDoneBefore;
                }).length;
                
                const activeHabitsOnDay = (state.habits || []).filter(h => {
                    const name = h.title || h.name || '';
                    return !(name.includes('תפילין') && d.getDay() === 6);
                }).length;

                const totalTargetOnDay = activeTasksOnDay + activeHabitsOnDay;

                if (totalTargetOnDay > 0) {
                    percentage = intensity / totalTargetOnDay;
                } else if (intensity > 0) {
                    percentage = 1;
                }
            }

            let bg = 'var(--bg-color)';
            if (!isFuture) {
                if (percentage >= 1) bg = 'rgba(216, 235, 233, 0.9)';         
                else if (percentage >= 0.7) bg = 'rgba(110, 221, 210, 0.9)';  
                else if (percentage >= 0.4) bg = 'rgba(72, 189, 177, 0.7)';   
                else if (percentage > 0) bg = 'rgba(79, 209, 197, 0.2)';      
            }

            days.push(
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold' }}>{dayLabels[i]}</span>
                    <div className="heatmap-cell" style={{ background: bg, opacity: isFuture ? 0.3 : 1 }} title={isFuture ? 'טרם הגיע' : `${Math.round(percentage * 100)}% הושלמו (${intensity} פעולות)`} />
                </div>
            );
        }
        return <div className="heatmap-grid">{days}</div>;
    };

    return (
        <>
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-title">ציון פרודוקטיביות (היום)</div>
                    <div className="kpi-value" style={{ color: productivity >= 75 ? 'var(--accent-teal)' : productivity >= 40 ? 'var(--accent-orange)' : 'var(--text-main)' }}>{productivity}%</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-title">משימות פתוחות (סה"כ)</div>
                    <div className="kpi-value">{(state.tasks || []).filter(t => !t.completed).length}</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-title">הרגלים שהושלמו (היום)</div>
                    <div className="kpi-value">{habitsDoneToday}/{totalHabits}</div>
                </div>
            </div>

            <div className="dashboard-grid" style={{ marginBottom: '25px' }}>
                <div className="card">
                    <div className="card-header"><span><i className="fa-solid fa-fire"></i> פעילות (שבוע נוכחי)</span></div>
                    <div className="heatmap-container">
                        {renderHeatmap()}
                        <div className="heatmap-legend">
                            <span>פחות</span>
                            <div className="heatmap-cell" style={{backgroundColor: 'var(--bg-color)'}}></div>
                            <div className="heatmap-cell" style={{backgroundColor: 'rgba(79, 209, 197, 0.2)'}}></div>
                            <div className="heatmap-cell" style={{backgroundColor: 'rgba(72, 189, 177, 0.7)'}}></div>
                            <div className="heatmap-cell" style={{backgroundColor: 'rgba(110, 221, 210, 0.9)'}}></div>
                            <div className="heatmap-cell" style={{backgroundColor: 'rgba(216, 235, 233, 0.9)'}}></div>
                            <span>יותר</span>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header"><span><i className="fa-solid fa-lightbulb" style={{color: '#fbbf24'}}></i> תובנות אוטומטיות</span></div>
                    <ul className="insights-list">
                        <li className="insight-item">
                            <i className="fa-solid fa-bolt"></i>
                            <div>סיימת היום <strong>{todayDoneTotal}/{todayTargetTotal}</strong> משימות והרגלים מתוך היעדים הפתוחים שלך.</div>
                        </li>
                        {bestHabit && bestHabit.completedDates?.length > 0 && (
                            <li className="insight-item">
                                <i className="fa-solid fa-award" style={{color: 'var(--accent-orange)', backgroundColor: 'rgba(246, 173, 85, 0.1)'}}></i>
                                <div>ההרגל העקבי ביותר שלך הוא <strong>"{bestHabitName}"</strong>.</div>
                            </li>
                        )}
                        <li className="insight-item">
                            <i className="fa-solid fa-lightbulb" style={{color: 'var(--accent-orange)', backgroundColor: 'rgba(246, 173, 85, 0.1)'}}></i>
                            <div><strong>הידעת?</strong><br/>{dailyFact}</div>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="card">
                    <div className="card-header"><span><i className="fa-solid fa-leaf" style={{color: 'var(--accent-teal)'}}></i> עקביות הרגלים (Streaks)</span></div>
                    <ul className="stats-list full-list">
                        {(state.habits || []).map(habit => {
                            let streak = 0; 
                            let d = new Date(); 
                            const dates = habit.completedDates || [];
                            const displayName = habit.title || habit.name || '';
                            const isTefillin = displayName.includes('תפילין');

                            while (true) {
                                if (isTefillin && d.getDay() === 6) {
                                    d.setDate(d.getDate() - 1);
                                    continue;
                                }

                                const dStr = getDateString(d);
                                
                                if (dates.includes(dStr)) {
                                    streak++;
                                    d.setDate(d.getDate() - 1);
                                } else if (dStr === todayStr) {
                                    d.setDate(d.getDate() - 1);
                                } else {
                                    break; 
                                }
                            }
                            
                            return (
                                <li key={habit.id} className="streak-item">
                                    <span className="streak-name">{displayName}</span>
                                    <span className="streak-count"><i className="fa-solid fa-fire"></i> {streak} ימים</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                
                <div className="card">
                    <div className="card-header"><span><i className="fa-solid fa-chart-pie" style={{color: 'var(--accent-orange)'}}></i> התפלגות משימות</span></div>
                    <div className="distribution-chart">
                        <div className="dist-item">
                            <div className="dist-header"><span>משימות כלליות</span><span>{generalPercent}%</span></div>
                            <div className="stat-progress-bar"><div className="stat-progress-fill" style={{ width: `${generalPercent}%`, backgroundColor: 'var(--accent-orange)' }}></div></div>
                        </div>
                        <div className="dist-item">
                            <div className="dist-header"><span>מטרות ארוכות טווח</span><span>{goalsPercent}%</span></div>
                            <div className="stat-progress-bar"><div className="stat-progress-fill" style={{ width: `${goalsPercent}%`, backgroundColor: '#a78bfa' }}></div></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}