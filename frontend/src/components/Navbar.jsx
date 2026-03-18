import React from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { Ticket, Users, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    if (!isAuthenticated) return null;

    return (
        <nav className="navbar">
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
                <Link to="/" className="navbar-logo">
                    <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        T
                    </div>
                    <span>SupportHub</span>
                </Link>

                <div className="navbar-links" style={{ display: 'flex', gap: '0.5rem' }}>
                    <NavLink to="/" className="nav-link">
                        <Ticket size={18} />
                        Tickets
                    </NavLink>
                    {user?.role === 'Admin' && (
                        <NavLink to="/users" className="nav-link">
                            <Users size={18} />
                            Users
                        </NavLink>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.5)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                            {user?.name?.charAt(0)}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{user?.name}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user?.role}</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleLogout}
                        className="btn btn-secondary" 
                        style={{ padding: '0.5rem 1rem', border: 'none', background: 'transparent', color: '#ef4444' }}
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
