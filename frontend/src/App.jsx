import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TicketList from './pages/TicketList';
import CreateTicket from './pages/CreateTicket';
import EditTicket from './pages/EditTicket';
import UserManagement from './pages/UserManagement';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

import { useDispatch } from 'react-redux';
import { loadUser } from './store/slices/authSlice';

function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<TicketList />} />
          <Route path="/edit/:id" element={<EditTicket />} />
        </Route>

        <Route element={<ProtectedRoute roles={['Admin']} />}>
          <Route path="/create" element={<CreateTicket />} />
          <Route path="/users" element={<UserManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
