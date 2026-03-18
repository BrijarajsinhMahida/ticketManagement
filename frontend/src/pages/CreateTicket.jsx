import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../store/slices/ticketSlice';
import { fetchUsers } from '../store/slices/userSlice';
import { ArrowLeft, Save } from 'lucide-react';

/**
 * @page CreateTicket
 * @desc Form to create new tickets and assign them to users.
 * @access Private (Admin only)
 */
const CreateTicket = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Low',
        assignedTo: ''
    });
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { list: users } = useSelector((state) => state.users);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
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

        const resultAction = await dispatch(createTicket(ticketData));
        if (createTicket.fulfilled.match(resultAction)) {
            navigate('/');
        }
    };

    return (
        <div className="container animate-fade" style={{ maxWidth: '800px', paddingBottom: '3rem' }}>
            <div className="page-header">
                <div>
                    <button onClick={() => navigate('/')} className="btn btn-secondary" style={{ marginBottom: '1rem', padding: '0.4rem 0.8rem' }}>
                        <ArrowLeft size={16} /> Back
                    </button>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Create New Ticket</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="card" noValidate>
                <div className="form-group">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className={`form-control ${errors.title ? 'error' : ''}`}
                        placeholder="Short summary of the issue"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    {errors.title && <span className="error-text">{errors.title}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                        className={`form-control ${errors.description ? 'error' : ''}`}
                        rows="4"
                        placeholder="Detail the issue and steps to reproduce"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                    {errors.description && <span className="error-text">{errors.description}</span>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="form-group">
                        <label className="form-label">Priority</label>
                        <select
                            className="form-control"
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Assign To</label>
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
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary">
                        <Save size={20} />
                        Create Ticket
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateTicket;
