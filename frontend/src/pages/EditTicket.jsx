import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateTicket } from '../store/slices/ticketSlice';
import { fetchUsers } from '../store/slices/userSlice';
import { ArrowLeft, Save } from 'lucide-react';
import Loader from '../components/Loader';

/**
 * @page EditTicket
 * @desc Allows users to update ticket details.
 * @access Private (Admins: All fields, Employees: Status only on assigned tickets)
 */
const EditTicket = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { list: tickets, loading: ticketsLoading } = useSelector((state) => state.tickets);
    const { list: users } = useSelector((state) => state.users);
    const { user: currentUser } = useSelector((state) => state.auth);
    
    const [formData, setFormData] = useState({
        status: 'Open',
        priority: 'Low',
        assignedTo: ''
    });
    const [errors, setErrors] = useState({});
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        dispatch(fetchUsers());
        const ticket = tickets.find(t => t._id === id);
        if (ticket) {
            setFormData({
                status: ticket.status,
                priority: ticket.priority,
                assignedTo: ticket.assignedTo?._id || ''
            });
        }
    }, [dispatch, id, tickets]);

    const validateForm = () => {
        let newErrors = {};
        // Status and Priority are always selected from predefined values, but keeping it for completeness if needed.
        if (!formData.status) newErrors.status = 'Status is required';
        if (!formData.priority) newErrors.priority = 'Priority is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const ticketData = {
            ...formData,
            assignedTo: formData.assignedTo === '' ? null : formData.assignedTo
        };

        const resultAction = await dispatch(updateTicket({ id, ticketData }));
        if (updateTicket.fulfilled.match(resultAction)) {
            setIsRedirecting(true);
            navigate('/');
        }
    };

    if (ticketsLoading) return <Loader />;

    const ticket = tickets.find(t => t._id === id);
    if (!ticket) return <div className="container">Ticket not found</div>;

    // Protection for Employee: Cannot edit if not assigned to them
    // We skip this check if we are currently redirecting after a successful update
    if (!isRedirecting && currentUser?.role === 'Employee' && ticket.assignedTo?._id !== currentUser.id) {
        return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>
            <h2 style={{ color: 'var(--danger)' }}>Access Denied</h2>
            <p>You can only access tickets assigned specifically to you.</p>
            <button onClick={() => navigate('/')} className="btn btn-secondary" style={{ marginTop: '1rem' }}>Back to Tickets</button>
        </div>;
    }

    const isAdmin = currentUser?.role === 'Admin';

    return (
        <div className="container animate-fade" style={{ maxWidth: '800px', paddingBottom: '3rem' }}>
            <div className="page-header">
                <div>
                    <button onClick={() => navigate('/')} className="btn btn-secondary" style={{ marginBottom: '1rem', padding: '0.4rem 0.8rem' }}>
                        <ArrowLeft size={16} /> Back
                    </button>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Update Ticket</h1>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--primary)' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>{ticket.title}</h3>
                <p style={{ color: 'var(--text-muted)' }}>{ticket.description}</p>
            </div>

            <form onSubmit={handleSubmit} className="card" noValidate>
                <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                        className={`form-control ${errors.status ? 'error' : ''}`}
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                        <option value="Open">Open</option>
                        <option value="In_Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                    {errors.status && <span className="error-text">{errors.status}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Priority</label>
                    {/* Only Admins can change the priority level of a ticket */}
                    <select
                        className="form-control"
                        disabled={!isAdmin}
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                {(isAdmin || currentUser?.role === 'Employee') && (
                    <div className="form-group">
                        <label className="form-label">Assign To</label>
                        {/* Both Admins and Employees can now change the ticket assignee */}
                        <select
                            className="form-control"
                            value={formData.assignedTo}
                            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                        >
                            <option value="">Select User</option>
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>{user.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary">
                        <Save size={20} />
                        Update Ticket
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditTicket;
