import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Heart, MessageCircle, User } from 'lucide-react';

const BottomNav = () => {
  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm glass rounded-2xl h-16 px-6 flex items-center justify-around shadow-2xl shadow-primary-500/10 border border-white/40">
      <NavLink 
        to="/app" 
        className={({ isActive }) => 
          `flex flex-col items-center justify-center gap-1 transition-all ${isActive ? 'text-primary-500 scale-110' : 'text-slate-400'}`
        }
      >
        <Home size={22} fill={window.location.pathname === '/app' ? 'currentColor' : 'none'} />
      </NavLink>
      <NavLink 
        to="/requests" 
        className={({ isActive }) => 
          `flex flex-col items-center justify-center gap-1 transition-all ${isActive ? 'text-primary-500 scale-110' : 'text-slate-400'}`
        }
      >
        <Heart size={22} fill={window.location.pathname === '/requests' ? 'currentColor' : 'none'} />
      </NavLink>
      <NavLink 
        to="/chats" 
        className={({ isActive }) => 
          `flex flex-col items-center justify-center gap-1 transition-all ${isActive ? 'text-primary-500 scale-110' : 'text-slate-400'}`
        }
      >
        <MessageCircle size={22} fill={window.location.pathname === '/chats' ? 'currentColor' : 'none'} />
      </NavLink>
      <NavLink 
        to="/profile" 
        className={({ isActive }) => 
          `flex flex-col items-center justify-center gap-1 transition-all ${isActive ? 'text-primary-500 scale-110' : 'text-slate-400'}`
        }
      >
        <User size={22} fill={window.location.pathname === '/profile' ? 'currentColor' : 'none'} />
      </NavLink>
    </div>
  );
};

export default BottomNav;
