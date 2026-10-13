import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Calendar, MapPin, Users, Ticket, AlertCircle, 
  Clock, ArrowRight, ShieldAlert, CheckCircle2, X, Mail
} from 'lucide-react';

export default function MyBookings({ onNavigate, onSelectBooking }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('Change of personal travel plans');
  const [cancelling, setCancelling] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [emailSendingId, setEmailSendingId] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const handleResendEmail = async (b) => {
    setEmailSendingId(b.booking_id);
    setStatusMessage('');
    try {
      const res = await api.resendBookingEmail(b.booking_id);
      setStatusMessage(res.message || `Confirmation voucher email dispatched for ${b.booking_reference}!`);
    } catch (err) {
      alert(err.message || 'Failed to dispatch email');
    } finally {
      setEmailSendingId(null);
    }
  };

  async function loadBookings() {
    try {
      const data = await api.getMyBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleCancelBooking = async () => {
    if (!selectedBookingForCancel) return;
    setCancelling(true);
    setStatusMessage('');

    try {
      await api.requestCancellation({
        booking_id: selectedBookingForCancel.booking_id,
        reason: cancelReason
      });
      setStatusMessage('Booking cancelled successfully and refund initiated!');
      setSelectedBookingForCancel(null);
      await loadBookings();
    } catch (err) {
      alert(err.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-brand-900 tracking-tight">My Bookings & Reservations</h1>
            <p className="text-xs text-slate-500 mt-1">Manage your active tour bookings, travel vouchers, and cancellation requests</p>
          </div>
          <button 
            onClick={() => onNavigate('packages')}
            className="px-4 py-2 bg-coral-500 hover:bg-coral-600 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            Explore More Packages
          </button>
        </div>

        {statusMessage && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 text-xs rounded-2xl border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {statusMessage}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm">Loading your reservations...</div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
              <Ticket className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No bookings found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">You have not booked any tour packages yet. Choose from our handpicked Indian holiday itineraries!</p>
            <button
              onClick={() => onNavigate('packages')}
              className="mt-6 px-6 py-3 bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-brand-800 transition"
            >
              Browse Packages Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => {
              const isConfirmed = b.booking_status === 'Confirmed';
              const isCancelled = b.booking_status === 'Cancelled';

              return (
                <div 
                  key={b.booking_id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-black text-brand-900 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
                        {b.booking_reference}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${isConfirmed ? 'bg-emerald-100 text-emerald-800' : isCancelled ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                        {b.booking_status}
                      </span>
                      <span className="text-xs text-slate-400">• Booked on {new Date(b.booking_date).toLocaleDateString()}</span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 leading-snug">
                      {b.package_title}
                    </h3>

                    <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-coral-500" />
                        {b.start_date} to {b.end_date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-brand-600" />
                        {b.traveller_count} Passenger{b.traveller_count > 1 ? 's' : ''}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        Payment: <strong>{b.payment_status || 'Paid'}</strong> ({b.payment_method || 'UPI/Card'})
                      </span>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="flex md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Paid</div>
                      <div className="text-xl font-black text-brand-900">
                        ₹{Number(b.net_amount).toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleResendEmail(b)}
                        disabled={emailSendingId === b.booking_id}
                        title="Dispatch / Resend E-Ticket Email"
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Mail className="w-3.5 h-3.5 text-brand-600" />
                        {emailSendingId === b.booking_id ? 'Sending...' : 'Email'}
                      </button>

                      <button
                        onClick={() => { onSelectBooking(b); onNavigate('booking-confirmation'); }}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                      >
                        Voucher
                      </button>

                      {isConfirmed && (
                        <button
                          onClick={() => setSelectedBookingForCancel(b)}
                          className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition"
                        >
                          Cancel Booking
                        </button>
                      )}

                      {isCancelled && (
                        <button
                          onClick={() => onNavigate('refund-status', { ref: b.booking_reference })}
                          className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-xl transition"
                        >
                          Track Refund
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancellation Confirmation Dialog Modal */}
      {selectedBookingForCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-extrabold text-sm text-red-600 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> Confirm Cancellation
              </span>
              <button onClick={() => setSelectedBookingForCancel(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-600">
              <p>
                Are you sure you want to cancel booking <strong>{selectedBookingForCancel.booking_reference}</strong>?
              </p>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] space-y-1">
                <strong>Policy Summary:</strong>
                <div>• &gt; 15 days before tour: 10% cancellation charge (90% refund)</div>
                <div>• 7 to 15 days: 50% cancellation charge (50% refund)</div>
                <div>• &lt; 7 days: 85% cancellation charge (15% refund)</div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 mb-1 block">Reason for Cancellation</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-2 text-xs border rounded-xl bg-slate-50"
                >
                  <option value="Change of personal travel plans">Change of personal travel plans</option>
                  <option value="Medical emergency in family">Medical emergency in family</option>
                  <option value="Found alternative tour schedule">Found alternative tour schedule</option>
                  <option value="Work / leave cancellation">Work / leave cancellation</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => setSelectedBookingForCancel(null)}
                className="flex-1 py-2.5 text-xs font-bold bg-slate-100 text-slate-700 rounded-xl"
              >
                Keep Booking
              </button>
              <button
                disabled={cancelling}
                onClick={handleCancelBooking}
                className="flex-1 py-2.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs transition"
              >
                {cancelling ? 'Processing...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
