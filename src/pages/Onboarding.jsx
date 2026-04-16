import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Heart, Church, MapPin, User, ArrowRight, Sparkles, Loader2, Check } from 'lucide-react';
import Swal from 'sweetalert2';

const VALUE_OPTIONS = [
  'Faithful', 'Honest', 'Kind', 'Generous', 'Patient', 
  'Prayerful', 'Worshipful', 'Community-driven', 'Adventurous', 
  'Traditional', 'Modern', 'Family-oriented'
];

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    age: 25,
    gender: 'male',
    church: '',
    location: '',
    values: [],
    preferred_gender: 'female',
    min_age: 18,
    max_age: 50,
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const toggleValue = (val) => {
    setFormData(prev => {
      const values = prev.values.includes(val)
        ? prev.values.filter(v => v !== val)
        : prev.values.length < 5 ? [...prev.values, val] : prev.values;
      return { ...prev, values };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await api.put('/users/me/profile', formData);
      setUser(prev => ({ ...prev, profile: res.data.data }));
      navigate('/pending');
      Swal.fire({
        icon: 'success',
        title: 'Profile Created!',
        text: 'Your journey is now officially underway.',
        confirmButtonColor: '#f59e0b',
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.response?.data?.error || 'Failed to save profile',
        confirmButtonColor: '#f59e0b',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-500 mx-auto mb-4">
                <User size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Tell us about yourself</h2>
              <p className="text-slate-500">Let's start with the basics of your identity.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Display Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field" 
                  placeholder="What should we call you?"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Age</label>
                  <input 
                    type="number" 
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: Number(e.target.value)})}
                    className="input-field" 
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
              </div>
            </div>

            <button 
              disabled={!formData.name}
              onClick={nextStep} 
              className="btn-primary w-full py-4 flex items-center justify-center gap-2"
            >
              Continue <ArrowRight size={20} />
            </button>
          </motion.div>
        );

      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-500 mx-auto mb-4">
                <Church size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Your Community</h2>
              <p className="text-slate-500">Where do you worship and live?</p>
            </div>

            <div className="space-y-4">
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
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                <div className="relative">
                   <MapPin className="absolute left-4 top-3.5 text-slate-400" size={18} />
                   <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="input-field pl-12" 
                    placeholder="City, State"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={prevStep} className="btn-secondary flex-1">Back</button>
              <button 
                disabled={!formData.church || !formData.location}
                onClick={nextStep} 
                className="btn-primary flex-[2] flex items-center justify-center gap-2"
              >
                Next <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-500 mx-auto mb-4">
                <Heart size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Faith Foundation</h2>
              <p className="text-slate-500">Select up to 5 values that define your faith.</p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {VALUE_OPTIONS.map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => toggleValue(val)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all flex items-center gap-2 ${
                    formData.values.includes(val)
                      ? 'bg-primary-500 border-primary-500 text-white'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-primary-300'
                  }`}
                >
                  {val}
                  {formData.values.includes(val) && <Check size={14} />}
                </button>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={prevStep} className="btn-secondary flex-1">Back</button>
              <button 
                disabled={formData.values.length === 0 || loading}
                onClick={handleSubmit} 
                className="btn-primary flex-[2] flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>Finish Profile <Sparkles size={18} /></>
                )}
              </button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 pb-20">
      <div className="w-full max-w-lg">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12 max-w-[200px] mx-auto">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? 'bg-primary-500' : 'bg-slate-200'
              }`} 
            />
          ))}
        </div>

        <div className="card p-8 sm:p-12 shadow-2xl shadow-slate-200/50">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
