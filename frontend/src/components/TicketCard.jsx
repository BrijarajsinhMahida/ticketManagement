import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Edit2, Clock } from 'lucide-react';
import { StatusBadge, PriorityBadge } from './Badge';

const TicketCard = ({ ticket }) => {
    const navigate = useNavigate();

    return (
        <div className="card animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <PriorityBadge priority={ticket.priority} />
                <StatusBadge status={ticket.status} />
            </div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: '600' }}>{ticket.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {ticket.description}
            </p>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: '500' }}>
                        <User size={14} style={{ color: 'var(--primary)' }} />
                        <span>
                            {/* Display assignee name and role clearly for context */}
                            Assigned To: {ticket.assignedTo ? `${ticket.assignedTo.name} (${ticket.assignedTo.role})` : 'Unassigned'}
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
                        {/* 
                          * DATE FORMATTING:
                          * We convert UTC strings from the database to the browser's 
                          * local timezone automatically using toLocaleString.
                          */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                            <Calendar size={13} />
                            <span>Created: {new Date(ticket.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                            <Clock size={13} />
                            <span>Updated: {new Date(ticket.updatedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => navigate(`/edit/${ticket._id}`)}
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem' }}
                >
                    <Edit2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default TicketCard;
