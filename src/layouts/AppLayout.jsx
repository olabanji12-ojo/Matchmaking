import React from 'react';
import BottomNav from '../components/BottomNav';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Heart, MessageCircle, User, LogOut, Shield, BarChart2, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userNavItems = [
    { to: '/app', icon: Home, label: 'Discover' },
    { to: '/requests', icon: Heart, label: 'Connections' },
    { to: '/chats', icon: MessageCircle, label: 'Messages' },
    { to: '/profile', icon: User, label: 'My Profile' },
  ];

  const adminNavItems = [
    { to: '/admin/users', icon: Users, label: 'Manage Users' },
    { to: '/admin/stats', icon: BarChart2, label: 'Analytics' },
  ];

  const isAdmin = user?.role === 'admin';
  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-slate-200 flex-col p-8 z-40">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${isAdmin ? 'bg-slate-900' : 'bg-primary-500 shadow-primary-500/20'}`}>
            {isAdmin ? <Shield size={22} /> : <Heart fill="currentColor" size={22} />}
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">ChurchMatch</span>
        </div>

        {/* Role badge */}
        <div className="mb-10">
          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${
            isAdmin ? 'bg-slate-900 text-white' : 'bg-primary-100 text-primary-700'
          }`}>
            {isAdmin ? '⚙ Admin Portal' : '✦ Member'}
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold transition-all ${
                  isActive
                    ? isAdmin
                      ? 'bg-slate-900 text-white shadow-lg scale-[1.02]'
                      : 'bg-primary-500 text-white shadow-lg shadow-primary-500/20 scale-[1.02]'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <item.icon size={22} />
              {item.label}
            </NavLink>
          ))}

          {/* Admin also gets a link to regular portal for testing */}
          {isAdmin && (
            <NavLink
              to="/app"
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold transition-all ${
                  isActive ? 'bg-primary-500 text-white' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Home size={22} />
              User View
            </NavLink>
          )}
        </nav>

        {/* User info + Logout */}
        <div className="pt-8 border-t border-slate-100 space-y-3">
          <div className="px-4 py-3 bg-slate-50 rounded-xl">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Logged in as</p>
            <p className="text-sm font-bold text-slate-700 truncate mt-0.5">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-4 w-full rounded-xl font-bold text-rose-500 hover:bg-rose-50 transition-colors"
          >
            <LogOut size={22} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="md:pl-72 min-h-screen transition-all duration-300">
        <div className="max-w-4xl mx-auto px-6 py-8 md:py-12">
          {children}
        </div>
      </main>

      {/* Bottom Nav - Mobile only (for regular users) */}
      {!isAdmin && <BottomNav />}

      {/* Admin Mobile Bottom Bar */}
      {isAdmin && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 h-16 flex items-center justify-around px-6">
          <NavLink to="/admin/users" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary-400' : 'text-slate-400'}`}>
            <Users size={22} />
          </NavLink>
          <NavLink to="/admin/stats" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary-400' : 'text-slate-400'}`}>
            <BarChart2 size={22} />
          </NavLink>
          <NavLink to="/app" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary-400' : 'text-slate-400'}`}>
            <Home size={22} />
          </NavLink>
          <button onClick={handleLogout} className="text-rose-400">
            <LogOut size={22} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
