import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ pagination, onPageChange, onLimitChange, label = 'ticket' }) => {
    const { page, totalPages, total, limit } = pagination;

    if (total === 0) return null;

    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', padding: '1rem', background: 'white', borderRadius: '0.75rem', border: '1px solid var(--border)', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Showing <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{start}-{end}</span> of <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{total}</span> {label}s
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Rows per page:</span>
                    <select 
                        value={limit} 
                        onChange={(e) => onLimitChange(Number(e.target.value))}
                        style={{ padding: '0.2rem 0.5rem', borderRadius: '0.4rem', border: '1px solid var(--border)', outline: 'none', background: 'var(--background)' }}
                    >
                        {[6, 10, 20, 50].map(l => (
                            <option key={l} value={l}>{l}</option>
                        ))}
                    </select>
                </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button 
                    className="btn btn-secondary" 
                    style={{ padding: '0.4rem 0.8rem' }}
                    disabled={page === 1}
                    onClick={() => onPageChange(page - 1)}
                >
                    <ChevronLeft size={18} />
                </button>
                
                <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0.5rem' }}>
                        Page <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{page}</span> of {totalPages}
                    </span>
                </div>

                <button 
                    className="btn btn-secondary" 
                    style={{ padding: '0.4rem 0.8rem' }}
                    disabled={page === totalPages || totalPages === 0}
                    onClick={() => onPageChange(page + 1)}
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
