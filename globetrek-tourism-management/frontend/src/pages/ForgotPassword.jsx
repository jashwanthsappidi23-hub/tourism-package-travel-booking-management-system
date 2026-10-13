import React, { useState } from 'react';
import { api } from '../services/api';
import { Compass, Mail, Lock, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword({
        email: email.trim().toLowerCase(),
        new_password: newPassword
      });
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update password. Please check your email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 sm:p-10 space-y-6 text-center">
        <div onClick={() => onNavigate('home')} className="inline-flex items-center gap-2 cursor-pointer mb-2">
          <div className="w-10 h-10 rounded-xl bg-brand-700 text-white flex items-center justify-center">
            <Compass className="w-6 h-6 text-coral-500" />
          </div>
          <span className="text-2xl font-black text-brand-900">Globe<span className="text-coral-500">Trek</span></span>
        </div>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reset Password</h1>
        <p className="text-xs text-slate-500">Update your account password securely in the database.</p>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200 text-left">
            <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
          </div>
        )}

        {submitted ? (
          <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="font-bold text-sm text-emerald-900">Password Updated Successfully!</p>
            <p>Your new password has been hashed and saved in the database for <strong>{email}</strong>.</p>
            <button 
              onClick={() => onNavigate('login')}
              className="mt-2 w-full py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl text-xs transition cursor-pointer"
            >
              Log In With New Password →
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Registered Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">New Password (min 6 characters) *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Confirm New Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500 outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save & Update Password in Database'}
            </button>
          </form>
        )}

        <div className="pt-2">
          <button onClick={() => onNavigate('login')} className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer">
            ← Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
