import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Key, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';

const AdminRegister = () => {
  const [form, setForm] = useState({ email: '', password: '', secret: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/admin/register', form);
      Swal.fire({
        icon: 'success',
        title: 'Admin account created!',
        text: 'You can now log in with your admin credentials.',
        confirmButtonColor: '#f59e0b',
      }).then(() => navigate('/login'));
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: err.response?.data?.error || 'Something went wrong.',
        confirmButtonColor: '#f59e0b',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-primary-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Admin Registration</h1>
          <p className="text-slate-400 mt-2 text-sm">
            This page is for platform administrators only.
          </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-500" size={18} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 pl-12 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-all"
                  placeholder="admin@church.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-500" size={18} />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 pl-12 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-all"
                  placeholder="Min 8 characters"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Admin Secret Key</label>
              <div className="relative">
                <Key className="absolute left-4 top-3.5 text-slate-500" size={18} />
                <input
                  type="password"
                  value={form.secret}
                  onChange={(e) => setForm({ ...form, secret: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 pl-12 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-all"
                  placeholder="Enter your org's secret key"
                  required
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Contact your system administrator for this key.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4 mt-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>Create Admin Account <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700 text-center text-sm text-slate-500">
            Regular user?{' '}
            <Link to="/register" className="text-primary-400 font-bold hover:underline">
              Join the community
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminRegister;
