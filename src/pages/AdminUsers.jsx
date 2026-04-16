import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Check, X, Trash2, Loader2, User, Search } from 'lucide-react';
import Swal from 'sweetalert2';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchUsers = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); // Initial load

    // Auto-refresh every 15 seconds silently
    const interval = setInterval(() => {
      fetchUsers(true);
    }, 3000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleAction = async (id, action) => {
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${action} this user?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: action === 'approve' ? '#10b981' : '#f43f5e',
      confirmButtonText: `Yes, ${action}!`,
    });

    if (result.isConfirmed) {
      try {
        if (action === 'approve') await api.put(`/admin/users/${id}/approve`);
        else if (action === 'reject') await api.put(`/admin/users/${id}/reject`);
        else if (action === 'delete') await api.delete(`/admin/users/${id}`);
        
        fetchUsers();
        Swal.fire('Updated!', `User has been ${action}d.`, 'success');
      } catch (err) {
        Swal.fire('Error', 'Failed to perform action', 'error');
      }
    }
  };

  const filteredUsers = users.filter(u => u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-900" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black text-slate-900">User Management</h1>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live
            </span>
          </div>
          <p className="text-slate-500 font-medium text-sm">
            Review and moderate community members
            {lastUpdated && (
              <span className="ml-2 text-slate-300">
                · Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            )}
          </p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by email..." 
            className="input-field pl-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="space-y-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((u) => (
            <div key={u.id} className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                  u.status === 'approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-500' : 
                  u.status === 'pending' ? 'bg-amber-50 border-amber-100 text-amber-500' : 
                  'bg-rose-50 border-rose-100 text-rose-500'
                }`}>
                  <User size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{u.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                      u.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 
                      u.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                      'bg-rose-100 text-rose-600'
                    }`}>
                      {u.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      ID: {u.id.substring(u.id.length - 6)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {u.status !== 'approved' && (
                  <button 
                    onClick={() => handleAction(u.id, 'approve')}
                    className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95"
                    title="Approve User"
                  >
                    <Check size={20} strokeWidth={3} />
                  </button>
                )}
                {u.status !== 'rejected' && (
                  <button 
                    onClick={() => handleAction(u.id, 'reject')}
                    className="p-3 bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all active:scale-95"
                    title="Reject User"
                  >
                    <X size={20} strokeWidth={3} />
                  </button>
                )}
                <button 
                  onClick={() => handleAction(u.id, 'delete')}
                  className="p-3 bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white rounded-xl transition-all active:scale-95"
                  title="Delete User"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 card border-dashed bg-transparent">
            <p className="text-slate-400 font-bold">No users found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
