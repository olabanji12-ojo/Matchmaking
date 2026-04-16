import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminRegister from './pages/AdminRegister';
import PendingDashboard from './pages/PendingDashboard';
import Discovery from './pages/Discovery';
import Requests from './pages/Requests';
import ChatList from './pages/ChatList';
import ChatRoom from './pages/ChatRoom';
import ProfileEdit from './pages/ProfileEdit';
import AdminUsers from './pages/AdminUsers';
import AdminStats from './pages/AdminStats';
import AppLayout from './layouts/AppLayout';

import Onboarding from './pages/Onboarding';

// Route guards
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = window.location.pathname;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans font-bold text-slate-400">
      Loading...
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  // Pending users can access /onboarding, otherwise they go to /pending
  if (user.status === 'pending') {
    if (location === '/onboarding') return <AppLayout>{children}</AppLayout>;
    return <Navigate to="/pending" replace />;
  }

  // Only admins can access admin routes
  if (adminOnly && user.role !== 'admin') return <Navigate to="/app" replace />;

  return <AppLayout>{children}</AppLayout>;
};

// Redirect logged-in users away from auth pages
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) {
    if (user.status === 'pending') {
      // If profile is missing (e.g. name is empty), go to onboarding
      if (!user.profile || !user.profile.name) return <Navigate to="/onboarding" replace />;
      return <Navigate to="/pending" replace />;
    }
    if (user.role === 'admin') return <Navigate to="/admin/users" replace />;
    return <Navigate to="/app" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />

        {/* Guest-only auth pages */}
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

        {/* Admin-only registration page (secret key protected) */}
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* User Onboarding (logged in but profile not set) */}
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />

        {/* Pending user dashboard (logged in but not yet approved) */}
        <Route path="/pending" element={<PendingDashboard />} />
...

        {/* Protected user routes */}
        <Route path="/app" element={<ProtectedRoute><Discovery /></ProtectedRoute>} />
        <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
        <Route path="/chats" element={<ProtectedRoute><ChatList /></ProtectedRoute>} />
        <Route path="/chats/:id" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />

        {/* Admin-only routes */}
        <Route path="/admin/users" element={<ProtectedRoute adminOnly={true}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/stats" element={<ProtectedRoute adminOnly={true}><AdminStats /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
