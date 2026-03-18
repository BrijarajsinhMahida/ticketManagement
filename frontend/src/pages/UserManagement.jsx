import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, createUser, setUserPage, clearError, setUserLimit, setUserFilters, clearUserFilters } from '../store/slices/userSlice';
import { UserPlus, Mail, User, Search, RotateCcw, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';

/**
 * @page UserManagement
 * @desc Admin page to list and create users (Employees/Admins).
 * @access Private (Admin only)
 */
const UserManagement = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Employee'
    });
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const { list: users, loading, pagination, error, filters } = useSelector((state) => state.users);

    useEffect(() => {
        /**
         * Fetch users with current search filters and pagination.
         * The response includes calculated ticket statistics for each user 
         * (Open, In_Progress, Resolved) to give Admins an overview of workloads.
         */
        dispatch(fetchUsers({ page: pagination.page, limit: pagination.limit, ...filters }));
        return () => {
            dispatch(clearError());
        };
    }, [dispatch, pagination.page, pagination.limit, filters]);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        const resultAction = await dispatch(createUser(formData));
        if (createUser.fulfilled.match(resultAction)) {
            setFormData({ name: '', email: '', password: '', role: 'Employee' });
            setErrors({});
            dispatch(fetchUsers({ page: pagination.page }));
        }
    };

    const handlePageChange = (page) => {
        dispatch(setUserPage(page));
    };

    const handleLimitChange = (limit) => {
        dispatch(setUserLimit(limit));
    };

    const handleFilterChange = (e) => {
        dispatch(setUserFilters({ [e.target.name]: e.target.value, page: 1 }));
    };

    const handleClearFilters = () => {
        dispatch(clearUserFilters());
    };

    return (
        <div className="container" style={{ paddingBottom: '3rem' }}>
            <div className="page-header">
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>User Management</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Create and manage employees</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                <div>
                    <form onSubmit={handleSubmit} className="card" noValidate>
                        {error && (
                            <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#dc2626', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem', border: '1px solid #fecaca' }}>
                                {error}
                            </div>
                        )}
                        <h3 style={{ marginBottom: '1.5rem' }}>Add New User</h3>
                        <div className="form-group">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                className={`form-control ${errors.name ? 'error' : ''}`}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            {errors.name && <span className="error-text">{errors.name}</span>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className={`form-control ${errors.email ? 'error' : ''}`}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className={`form-control ${errors.password ? 'error' : ''}`}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            {errors.password && <span className="error-text">{errors.password}</span>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Role</label>
                            <select
                                className="form-control"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="Employee">Employee</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            <UserPlus size={20} />
                            Add User
                        </button>
                    </form>
                </div>

                <div>
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <h3 style={{ margin: 0 }}>Employee Directory</h3>
                            <div style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '250px' }}>
                                <div style={{ position: 'relative', flex: 1 }}>
                                    <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input 
                                        type="text" 
                                        name="search"
                                        placeholder="Search name or email..." 
                                        className="form-control" 
                                        style={{ paddingLeft: '2.5rem', fontSize: '0.9rem' }}
                                        value={filters.search}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <button 
                                    onClick={handleClearFilters}
                                    className="btn btn-secondary"
                                    style={{ padding: '0.5rem', minWidth: '40px' }}
                                    title="Reset Search"
                                >
                                    <RotateCcw size={18} />
                                </button>
                            </div>
                        </div>
                        {loading ? <Loader /> : (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {users.map((user) => (
                                        <div key={user._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: '0.75rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                                                    <User size={20} />
                                                </div>
                                                <div style={{ minWidth: 0 }}>
                                                    <div style={{ fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name} <span style={{ fontWeight: '400', fontSize: '0.75rem', color: 'var(--text-muted)' }}>({user.role})</span></div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <Mail size={12} /> {user.email}
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', margin: '0 1rem' }}>
                                                <div style={{ textAlign: 'center' }} title="Open Tickets">
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#3b82f6' }}>
                                                        <AlertCircle size={14} />
                                                        <span style={{ fontWeight: '700' }}>{user.ticketStats?.Open || 0}</span>
                                                    </div>
                                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Open</div>
                                                </div>
                                                <div style={{ textAlign: 'center' }} title="In Progress">
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#f59e0b' }}>
                                                        <Clock size={14} />
                                                        <span style={{ fontWeight: '700' }}>{user.ticketStats?.In_Progress || 0}</span>
                                                    </div>
                                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active</div>
                                                </div>
                                                <div style={{ textAlign: 'center' }} title="Resolved Tickets">
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#10b981' }}>
                                                        <CheckCircle size={14} />
                                                        <span style={{ fontWeight: '700' }}>{user.ticketStats?.Resolved || 0}</span>
                                                    </div>
                                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Done</div>
                                                </div>
                                            </div>
                                            
                                            <span 
                                                className={`badge ${user.role === 'Admin' ? 'badge-high' : 'badge-progress'}`}
                                                style={{ fontSize: '0.7rem' }}
                                            >
                                                {user.role}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <Pagination 
                                    pagination={pagination} 
                                    onPageChange={handlePageChange} 
                                    onLimitChange={handleLimitChange}
                                    label="user" 
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
