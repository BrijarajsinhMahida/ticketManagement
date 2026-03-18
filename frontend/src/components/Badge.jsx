import React from 'react';

export const StatusBadge = ({ status }) => {
    const getClassName = () => {
        switch (status) {
            case 'Open': return 'badge badge-open';
            case 'In_Progress': return 'badge badge-progress';
            case 'Resolved': return 'badge badge-resolved';
            default: return 'badge';
        }
    };
    const displayStatus = status === 'In_Progress' ? 'In Progress' : status;
    return <span className={getClassName()}>{displayStatus}</span>;
};

export const PriorityBadge = ({ priority }) => {
    const getClassName = () => {
        switch (priority) {
            case 'Low': return 'badge badge-low';
            case 'Medium': return 'badge badge-medium';
            case 'High': return 'badge badge-high';
            default: return 'badge';
        }
    };
    return <span className={getClassName()}>{priority}</span>;
};
