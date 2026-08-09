import React from 'react';
import { createPortal } from 'react-dom';

export function CalendarTooltip({ tooltip }) {
    if (!tooltip.visible) return null;

    return createPortal(
        <div className="calendar-tooltip" style={{ display: 'block', top: tooltip.y + 15, left: tooltip.x + 15 }}>
            <div className="tooltip-title">{tooltip.dateStr}</div>
            {tooltip.starts.map(t => (
                <div key={`s-${t.id}`} className="tooltip-item">
                    <div className="indicator-start"></div> <span>{t.title}</span>
                </div>
            ))}
            {tooltip.dues.map(t => (
                <div key={`d-${t.id}`} className="tooltip-item">
                    <div className="indicator-due"></div> <span>{t.title} (תג"ב)</span>
                </div>
            ))}
        </div>,
        document.body
    );
}