import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTickets, setFilters, setLimit, clearFilters } from '../store/slices/ticketSlice';
import { fetchUsers } from '../store/slices/userSlice';
import TicketCard from '../components/TicketCard';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import { Search, Filter, Plus, RotateCcw } from 'lucide-react';

/**
 * @page TicketList
 * @desc Displays a searchable and filterable list of tickets.
 * @access Private (Admins see all, Employees see assigned only handled by backend)
 */
const TicketList = () => {
    const dispatch = useDispatch();
    const { list, loading, filters, pagination } = useSelector((state) => state.tickets);
    const { user: currentUser } = useSelector((state) => state.auth);
    const { list: users } = useSelector((state) => state.users);

    useEffect(() => {
        /**
         * Fetch tickets based on current filters and pagination.
         * Note: The backend automatically handles role-based filtering 
         * (Employees only see their assigned tickets).
         */
        dispatch(fetchTickets({ ...filters, limit: pagination.limit }));
        
        // Admins need the full user list to populate the 'Assigned To' filter dropdown
        if (currentUser?.role === 'Admin') {
            dispatch(fetchUsers({ limit: 100 })); 
        }
    }, [dispatch, filters, pagination.limit, currentUser?.role]);

    const handleFilterChange = (e) => {
        dispatch(setFilters({ [e.target.name]: e.target.value, page: 1 }));
    };

    const handleClearFilters = () => {
        dispatch(clearFilters());
    };

    const handlePageChange = (page) => {
        dispatch(setFilters({ page }));
    };

    const handleLimitChange = (limit) => {
        dispatch(setLimit(limit));
    };

    return (
        <div className="container" style={{ paddingBottom: '3rem' }}>
            <div className="page-header">
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Tickets</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage and track your assigned issues</p>
                </div>
                {currentUser?.role === 'Admin' && (
                    <Link to="/create" className="btn btn-primary">
                        <Plus size={20} />
                        Create New Ticket
                    </Link>
                )}
            </div>

            <div className="filters-bar">
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search 
                        size={20} 
                        style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
                    />
                    <input
                        type="text"
                        name="search"
                        placeholder="Search tickets by title..."
                        className="form-control"
                        style={{ paddingLeft: '3rem' }}
                        value={filters.search}
                        onChange={handleFilterChange}
                    />
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Filter size={18} color="var(--text-muted)" />
                        <select 
                            name="priority" 
                            className="form-control" 
                            style={{ padding: '0.6rem' }}
                            value={filters.priority}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Priority</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    <select 
                        name="status" 
                        className="form-control" 
                        style={{ padding: '0.6rem' }}
                        value={filters.status}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Status</option>
                        <option value="Open">Open</option>
                        <option value="In_Progress">In_Progress</option>
                        <option value="Resolved">Resolved</option>
                    </select>

                    {currentUser?.role === 'Admin' && (
                        <select 
                            name="assignedTo" 
                            className="form-control" 
                            style={{ padding: '0.6rem', minWidth: '180px' }}
                            value={filters.assignedTo}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Assignees</option>
                            {users.map(u => (
                                <option key={u._id} value={u._id}>
                                    {u.name} ({u.role})
                                </option>
                            ))}
                        </select>
                    )}

                    <button 
                        onClick={handleClearFilters}
                        className="btn btn-secondary"
                        style={{ padding: '0.6rem 1rem', background: '#f1f5f9', color: 'var(--text-muted)' }}
                        title="Clear Filters"
                    >
                        <RotateCcw size={16} />
                        Clear
                    </button>
                </div>
            </div>

            {loading ? <Loader /> : (
                <>
                    <div className="ticket-grid">
                        {list.length > 0 ? list.map((ticket) => (
                            <TicketCard key={ticket._id} ticket={ticket} />
                        )) : (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', background: 'white', borderRadius: '1rem', border: '1px dashed var(--border)' }}>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No tickets found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                    <Pagination 
                        pagination={pagination} 
                        onPageChange={handlePageChange} 
                        onLimitChange={handleLimitChange}
                    />
                </>
            )}
        </div>
    );
};

export default TicketList;
