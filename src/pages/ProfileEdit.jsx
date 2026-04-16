import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Church, Heart, Save, Loader2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const VALUE_OPTIONS = [
  'Faithful', 'Honest', 'Kind', 'Generous', 'Patient', 
  'Prayerful', 'Worshipful', 'Community-driven', 'Adventurous', 
  'Traditional', 'Modern', 'Family-oriented'
];

const ProfileEdit = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: 18,
    gender: 'male',
    church: '',
    location: '',
    values: [],
    preferred_gender: 'female',
    min_age: 18,
    max_age: 50,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/me');
        const prof = res.data.data;
        // Merge fetched data into defaults (handles empty profile for new users)
        if (prof && prof.name) {
          setFormData({
            name: prof.name || '',
            age: prof.age || 18,
            gender: prof.gender || 'male',
            church: prof.church || '',
            location: prof.location || '',
            values: prof.values || [],
            preferred_gender: prof.preferred_gender || 'female',
            min_age: prof.min_age || 18,
            max_age: prof.max_age || 50,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const toggleValue = (val) => {
    setFormData(prev => {
      const values = prev.values.includes(val)
        ? prev.values.filter(v => v !== val)
        : [...prev.values, val];
      return { ...prev, values };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/users/me/profile', formData);
      setUser(prev => ({ ...prev, profile: res.data.data }));
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your changes have been saved successfully.',
        confirmButtonColor: '#f59e0b',
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: err.response?.data?.error || 'Something went wrong',
        confirmButtonColor: '#f59e0b',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32">
      <header>
        <h1 className="text-3xl font-black text-slate-900">Your Profile</h1>
        <p className="text-slate-500 font-medium">Define your identity and matching preferences</p>
      </header>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="card p-8 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <User size={20} className="text-primary-500" /> Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="input-field" 
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Age</label>
              <input 
                type="number" 
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: Number(e.target.value)})}
                className="input-field" 
                min={18} max={100}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Gender</label>
              <select 
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="input-field"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Church Affiliation</label>
              <div className="relative">
                 <Church className="absolute left-4 top-3.5 text-slate-400" size={18} />
                 <input 
                  type="text" 
                  value={formData.church}
                  onChange={(e) => setFormData({...formData, church: e.target.value})}
                  className="input-field pl-12" 
                  placeholder="e.g. Redeemed, Catholic"
                  required
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Location (City, State)</label>
              <div className="relative">
                 <MapPin className="absolute left-4 top-3.5 text-slate-400" size={18} />
                 <input 
                  type="text" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="input-field pl-12" 
                  placeholder="Lagos, Nigeria"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card p-8 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Heart size={20} className="text-primary-500" /> Your Values
          </h2>
          <p className="text-sm text-slate-500">Select the values that best describe you. These help our matching algorithm find common ground.</p>
          
          <div className="flex flex-wrap gap-3">
            {VALUE_OPTIONS.map(val => (
              <button
                key={val}
                type="button"
                onClick={() => toggleValue(val)}
                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                  formData.values.includes(val)
                    ? 'bg-primary-500 border-primary-500 text-white shadow-md'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-primary-300'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        <div className="card p-8 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Heart size={20} className="text-primary-500" /> Matching Preferences
          </h2>
          <p className="text-sm text-slate-500">Tell us what you're looking for in a potential match.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Gender</label>
              <select 
                value={formData.preferred_gender}
                onChange={(e) => setFormData({...formData, preferred_gender: e.target.value})}
                className="input-field"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="any">Any</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Min Age</label>
              <input 
                type="number" 
                value={formData.min_age}
                onChange={(e) => setFormData({...formData, min_age: Number(e.target.value)})}
                className="input-field" 
                min={18} max={100}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Max Age</label>
              <input 
                type="number" 
                value={formData.max_age}
                onChange={(e) => setFormData({...formData, max_age: Number(e.target.value)})}
                className="input-field" 
                min={18} max={100}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center gap-4">
          <button 
            type="button"
            onClick={handleLogout}
            className="btn-secondary flex items-center justify-center gap-2 px-6 py-4"
          >
            <LogOut size={20} />
            Sign Out
          </button>
          
          <button 
            type="submit" 
            disabled={saving}
            className="btn-primary flex items-center gap-2 px-10 py-4 shadow-xl flex-1 md:flex-none justify-center"
          >
            {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
