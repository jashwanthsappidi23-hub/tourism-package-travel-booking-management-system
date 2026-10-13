import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Compass, User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export default function Register({ onNavigate }) {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Please agree to terms and conditions');
      return;
    }

    setLoading(true);
    try {
      await register({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        role: 'Customer'
      });
      onNavigate('customer-dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div onClick={() => onNavigate('home')} className="inline-flex items-center gap-2 cursor-pointer mb-2">
            <div className="w-10 h-10 rounded-xl bg-brand-700 text-white flex items-center justify-center">
              <Compass className="w-6 h-6 text-coral-500" />
            </div>
            <span className="text-2xl font-black text-brand-900">Bharat<span className="text-coral-500">Yatra</span></span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Your Account</h1>
          <p className="text-xs text-slate-500">Start discovering India's most extraordinary destinations</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Anjali Gupta"
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-hidden font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-hidden font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Contact *</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 00000"
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-hidden font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength="6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-9 pr-10 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-hidden font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Confirm Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-hidden font-medium"
              />
            </div>
          </div>

          <div className="text-xs text-slate-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="rounded accent-coral-500"
              />
              <span>I agree to the Terms of Service & Privacy Policy</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <button onClick={() => onNavigate('login')} className="font-extrabold text-coral-600 hover:text-coral-700">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
