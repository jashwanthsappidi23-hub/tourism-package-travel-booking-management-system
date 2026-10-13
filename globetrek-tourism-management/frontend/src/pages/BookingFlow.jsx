import React, { useState } from 'react';
import DemoPaymentModal from '../components/booking/DemoPaymentModal';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Users, Calendar, ShieldCheck, ArrowRight, UserPlus, 
  Trash2, AlertCircle, Loader2, Sparkles, MapPin, Clock 
} from 'lucide-react';

export default function BookingFlow({ pkg, departure, onNavigate, onBookingConfirmed }) {
  const { user, isAuthenticated } = useAuth();

  const [travellers, setTravellers] = useState([
    { full_name: user?.full_name || 'Arjun Sharma', age: 30, gender: 'Male', id_proof_type: 'Aadhaar', id_proof_number: '1234-5678-9012', phone: user?.phone || '+91 98765 43210' }
  ]);
  const [specialRequests, setSpecialRequests] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal payment state
  const [createdBooking, setCreatedBooking] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  if (!pkg || !departure) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h2 className="text-xl font-bold">Please select a package and departure first</h2>
          <button onClick={() => onNavigate('packages')} className="mt-4 px-4 py-2 bg-brand-700 text-white rounded-lg text-xs font-bold">
            Browse Tour Packages
          </button>
        </div>
      </div>
    );
  }

  // Price calculations
  const unitPrice = floatOrZero(departure.price_override || pkg.base_price);
  const travellerCount = travellers.length;
  const grossFare = unitPrice * travellerCount;
  const discount = travellerCount >= 2 ? Math.min(2500, Math.round(grossFare * 0.05)) : 0;
  const taxable = grossFare - discount;
  const gstTax = Math.round(taxable * 0.05);
  const netPayable = taxable + gstTax;

  function floatOrZero(val) {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  }

  const handleAddTraveller = () => {
    if (travellers.length >= departure.available_seats) {
      setErrorMsg(`Cannot add more travellers. Only ${departure.available_seats} seats remaining on this departure.`);
      return;
    }
    setTravellers([
      ...travellers,
      { full_name: '', age: 25, gender: 'Male', id_proof_type: 'Aadhaar', id_proof_number: '', phone: '' }
    ]);
  };

  const handleRemoveTraveller = (index) => {
    if (travellers.length <= 1) return;
    setTravellers(travellers.filter((_, idx) => idx !== index));
  };

  const handleTravellerChange = (index, field, value) => {
    const updated = [...travellers];
    updated[index][field] = value;
    setTravellers(updated);
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isAuthenticated) {
      onNavigate('login');
      return;
    }

    // Validate travellers
    for (let i = 0; i < travellers.length; i++) {
      if (!travellers[i].full_name.trim()) {
        setErrorMsg(`Please enter Full Name for Traveller #${i + 1}`);
        return;
      }
      if (!travellers[i].age || travellers[i].age <= 0) {
        setErrorMsg(`Please enter a valid age for Traveller #${i + 1}`);
        return;
      }
    }

    setLoading(true);
    try {
      // 1. Create booking in backend
      const bookingPayload = {
        departure_id: departure.departure_id,
        travellers: travellers.map(t => ({
          ...t,
          age: parseInt(t.age)
        })),
        special_requests: specialRequests
      };

      const res = await api.createBooking(bookingPayload);
      setCreatedBooking(res);
      setPaymentModalOpen(true);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to initialize booking');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      await api.simulatePayment(paymentData);
      onBookingConfirmed(createdBooking);
      onNavigate('booking-confirmation');
    } catch (err) {
      setErrorMsg(err.message || 'Payment simulation failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-6">
          <span onClick={() => onNavigate('packages')} className="hover:text-coral-500 cursor-pointer">Tour Packages</span>
          <span>/</span>
          <span onClick={() => onNavigate('package-details')} className="hover:text-coral-500 cursor-pointer truncate max-w-xs">{pkg.title}</span>
          <span>/</span>
          <span className="text-brand-700">Checkout & Booking</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Form: Travellers Details (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-black text-brand-900 tracking-tight">Traveller Details</h1>
                  <p className="text-xs text-slate-500 mt-1">Please provide legal passenger information matching government ID</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddTraveller}
                  className="px-3.5 py-2 bg-coral-50 text-coral-600 hover:bg-coral-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" /> Add Traveller
                </button>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
                </div>
              )}

              <form onSubmit={handleProceedToPayment} className="space-y-6">
                {travellers.map((traveller, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 relative">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-extrabold text-xs uppercase tracking-wider text-brand-800 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-brand-700 text-white text-[10px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        Traveller #{idx + 1}
                      </span>
                      {travellers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTraveller(idx)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-bold text-slate-600 mb-1 block">Full Legal Name *</label>
                        <input
                          type="text"
                          required
                          value={traveller.full_name}
                          onChange={(e) => handleTravellerChange(idx, 'full_name', e.target.value)}
                          placeholder="e.g. Ramesh Kumar"
                          className="w-full px-3 py-2 text-xs border rounded-xl bg-white focus:ring-2 focus:ring-brand-500 outline-hidden font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 mb-1 block">Age *</label>
                        <input
                          type="number"
                          required
                          min="1"
                          max="120"
                          value={traveller.age}
                          onChange={(e) => handleTravellerChange(idx, 'age', e.target.value)}
                          className="w-full px-3 py-2 text-xs border rounded-xl bg-white focus:ring-2 focus:ring-brand-500 outline-hidden font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 mb-1 block">Gender *</label>
                        <select
                          value={traveller.gender}
                          onChange={(e) => handleTravellerChange(idx, 'gender', e.target.value)}
                          className="w-full px-3 py-2 text-xs border rounded-xl bg-white focus:ring-2 focus:ring-brand-500 outline-hidden font-medium"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 mb-1 block">ID Proof Type</label>
                        <select
                          value={traveller.id_proof_type}
                          onChange={(e) => handleTravellerChange(idx, 'id_proof_type', e.target.value)}
                          className="w-full px-3 py-2 text-xs border rounded-xl bg-white focus:ring-2 focus:ring-brand-500 outline-hidden font-medium"
                        >
                          <option value="Aadhaar">Aadhaar Card</option>
                          <option value="Passport">Passport</option>
                          <option value="Voter ID">Voter ID</option>
                          <option value="Driving License">Driving License</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 mb-1 block">ID Document Number</label>
                        <input
                          type="text"
                          value={traveller.id_proof_number}
                          onChange={(e) => handleTravellerChange(idx, 'id_proof_number', e.target.value)}
                          placeholder="Document ID #"
                          className="w-full px-3 py-2 text-xs border rounded-xl bg-white focus:ring-2 focus:ring-brand-500 outline-hidden font-medium"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Special Requests */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Special Requests (Optional)</label>
                  <textarea
                    rows="2"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g. Vegetarian meals preferred, ground floor hotel room, airport wheelchair assistance..."
                    className="w-full p-3 text-xs border rounded-xl bg-white focus:ring-2 focus:ring-brand-500 outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white font-extrabold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Proceed to Payment Simulation'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Sidebar: Tour Summary & Price Breakdown (1 Col) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tour Snapshot Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-brand-900">Tour Summary</h3>
              
              <div className="flex gap-3">
                <img 
                  src={pkg.featured_image} 
                  alt={pkg.title}
                  className="w-20 h-20 rounded-xl object-cover shrink-0" 
                />
                <div>
                  <span className="text-[10px] font-bold uppercase text-coral-600">{pkg.category}</span>
                  <h4 className="text-xs font-extrabold text-slate-800 line-clamp-2">{pkg.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {pkg.duration_days}D / {pkg.duration_nights}N
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 border border-slate-200/80">
                <div className="flex justify-between text-slate-600">
                  <span>Start Date:</span>
                  <strong className="text-slate-800">{departure.start_date}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>End Date:</span>
                  <strong className="text-slate-800">{departure.end_date}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Remaining Seats:</span>
                  <strong className="text-emerald-700">{departure.available_seats} available</strong>
                </div>
              </div>
            </div>

            {/* Price Fare Breakdown Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-brand-900">Fare Breakdown</h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Base Price (₹{unitPrice.toLocaleString('en-IN')} × {travellerCount})</span>
                  <span className="font-bold text-slate-800">₹{grossFare.toLocaleString('en-IN')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Group / Multi-Traveller Promo
                    </span>
                    <span className="font-bold">- ₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Taxes (5% GST for Tourism)</span>
                  <span className="font-bold text-slate-800">+ ₹{gstTax.toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-sm font-black text-brand-900">Total Net Amount</span>
                  <span className="text-2xl font-black text-brand-900">₹{netPayable.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero hidden charges. Includes AC cab, hotel stay, breakfast & tour guide.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Payment Modal */}
      <DemoPaymentModal 
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        booking={createdBooking}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
