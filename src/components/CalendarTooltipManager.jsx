import React, { useEffect } from 'react';

export function CalendarTooltipManager({ tasks }) {
    useEffect(() => {
        const tooltip = document.getElementById('calendar-tooltip');
        if (!tooltip) return;

        const getTasksForDate = (dateStr) => {
            const starts = tasks.filter(t => t.startDate === dateStr && !t.completed);
            const dues = tasks.filter(t => t.dueDate === dateStr && !t.completed);
            return { starts, dues };
        };

        const handleMouseOver = (e) => {
            const dayEl = e.target.closest('.calendar-day');
            if(dayEl && dayEl.dataset.date) {
                const dateStr = dayEl.dataset.date;
                const { starts, dues } = getTasksForDate(dateStr);
                
                if(starts.length === 0 && dues.length === 0) {
                    tooltip.style.display = 'none';
                    return;
                }
                
                const dateObj = new Date(dateStr);
                const displayDate = dateObj.toLocaleDateString('he-IL');

                let html = `<div class="tooltip-title">${displayDate}</div>`;
                starts.forEach(t => html += `<div class="tooltip-item"><div class="indicator-start"></div> <span>${t.title}</span></div>`);
                dues.forEach(t => html += `<div class="tooltip-item"><div class="indicator-due"></div> <span>${t.title} (תג"ב)</span></div>`);
                
                tooltip.innerHTML = html;
                tooltip.style.display = 'block';
            }
        };

        const handleMouseMove = (e) => {
            if(tooltip.style.display === 'block') {
                tooltip.style.top = (e.pageY + 15) + 'px';
                tooltip.style.left = (e.pageX + 15) + 'px';
            }
        };

        const handleMouseOut = (e) => {
            if(e.target.closest('.calendar-day')) {
                tooltip.style.display = 'none';
            }
        };

        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseout', handleMouseOut);

        return () => {
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseout', handleMouseOut);
        };
    }, [tasks]);

    return (
        <div id="calendar-tooltip" className="calendar-tooltip"></div>
    );
}