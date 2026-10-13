import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  User, Ticket, Calendar, MapPin, Phone, Mail,
  CreditCard, Compass, ArrowRight, ShieldCheck, CheckCircle2,
  Edit3, Save, X, Loader2
} from 'lucide-react';

export default function CustomerDashboard({ onNavigate, onSelectBooking }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  useEffect(() => {
    async function fetchBookings() {
      try {
        const data = await api.getMyBookings();
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccessMsg('');
    try {
      await api.updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim(),
        city: city.trim() || undefined,
        state: state.trim() || undefined,
        emergency_contact: emergencyContact.trim() || undefined
      });
      setProfileSuccessMsg('Profile changes saved and persisted to database!');
      setIsEditingProfile(false);
      setTimeout(() => setProfileSuccessMsg(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const confirmedCount = bookings.filter(b => b.booking_status === 'Confirmed').length;
  const cancelledCount = bookings.filter(b => b.booking_status === 'Cancelled').length;
  const totalSpent = bookings.reduce((sum, b) => b.booking_status !== 'Cancelled' ? sum + b.net_amount : sum, 0);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-brand-900 to-brand-700 text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-coral-500 text-white font-black text-2xl flex items-center justify-center shadow-md">
              {fullName ? fullName[0] : (user?.email ? user.email[0].toUpperCase() : 'U')}
            </div>
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Customer Portal</span>
              <h1 className="text-3xl font-black mt-0.5">Welcome back, {fullName || user?.full_name || 'Travel Enthusiast'}!</h1>
              <p className="text-xs text-slate-300 mt-1">{user?.email} • Verified Traveller Profile</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition border border-white/20 flex items-center gap-2 cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-amber-300" /> {isEditingProfile ? 'Close Profile Editor' : 'Edit My Profile'}
            </button>
            <button
              onClick={() => onNavigate('packages')}
              className="px-5 py-3 bg-coral-500 hover:bg-coral-600 text-white text-xs font-bold rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4" /> Explore New Tours
            </button>
          </div>
        </div>

        {profileSuccessMsg && (
          <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-2xl border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-bold">{profileSuccessMsg}</span>
          </div>
        )}

        {/* Profile Card & Editor */}
        {isEditingProfile ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-black text-brand-900 tracking-tight">Update Personal Information</h2>
                <p className="text-xs text-slate-500">Changes are committed to the 3NF Customers database table.</p>
              </div>
              <button 
                onClick={() => setIsEditingProfile(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Contact Phone Number *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">City / Hometown</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai, Bengaluru"
                  className="w-full px-3 py-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">State / Province</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Maharashtra, Karnataka"
                  className="w-full px-3 py-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-hidden font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Emergency Contact Number</label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="e.g. +91 9876543210 (Kin / Guardian)"
                  className="w-full px-3 py-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-hidden font-medium"
                />
              </div>

              <div className="sm:col-span-2 pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-6 py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {profileSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Profile to Database
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {/* Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Bookings</span>
            <div className="text-3xl font-black text-brand-900 mt-1">{confirmedCount}</div>
            <span className="text-[11px] text-emerald-600 font-semibold">Ready for departure</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cancelled / Refunded</span>
            <div className="text-3xl font-black text-slate-700 mt-1">{cancelledCount}</div>
            <span className="text-[11px] text-slate-500 font-semibold">Processed per policy</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Travel Spend</span>
            <div className="text-3xl font-black text-brand-900 mt-1">₹{Number(totalSpent).toLocaleString('en-IN')}</div>
            <span className="text-[11px] text-coral-600 font-semibold">Safe demo transactions</span>
          </div>
        </div>

        {/* Stored Profile Summary Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-extrabold text-brand-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Stored Database Profile Information
            </h2>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ✓ Database Synchronized
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-0.5">Database User ID</span>
              <span className="font-mono font-bold text-slate-800">#{user?.user_id || 'N/A'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-0.5">Customer Profile ID</span>
              <span className="font-mono font-bold text-slate-800">#{user?.customer_id || 'N/A'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-0.5">Registered Email</span>
              <span className="font-bold text-slate-800 truncate block">{user?.email}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-0.5">Phone Number</span>
              <span className="font-bold text-slate-800">{phone || user?.phone || 'Not set'}</span>
            </div>
          </div>
        </div>

        {/* Recent Bookings List */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-brand-900 tracking-tight">Recent Travel Bookings</h2>
              <p className="text-xs text-slate-500 mt-0.5">Your recent trip vouchers and itineraries</p>
            </div>
            <button
              onClick={() => onNavigate('my-bookings')}
              className="text-xs font-bold text-coral-600 hover:text-coral-700 flex items-center gap-1 cursor-pointer"
            >
              View Full Booking History <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {bookings.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No recent bookings recorded.</p>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 5).map((b) => (
                <div 
                  key={b.booking_id}
                  className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-brand-900">{b.booking_reference}</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 uppercase">
                        {b.booking_status}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">{b.package_title}</h3>
                    <div className="text-xs text-slate-500 mt-0.5">{b.start_date} to {b.end_date} • {b.traveller_count} Travellers</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-sm text-brand-900">₹{Number(b.net_amount).toLocaleString('en-IN')}</span>
                    <button
                      onClick={() => { onSelectBooking(b); onNavigate('booking-confirmation'); }}
                      className="px-3.5 py-1.5 bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      View Ticket
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
