import React, { useState } from 'react';
import { 
  CheckCircle2, Printer, ArrowRight, Calendar, 
  MapPin, Users, Download, ShieldCheck, Ticket, 
  Mail, MailCheck, Send, RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

export default function BookingConfirmation({ booking, onNavigate }) {
  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h2 className="text-xl font-bold">No active booking to confirm</h2>
          <button onClick={() => onNavigate('home')} className="mt-4 px-4 py-2 bg-brand-700 text-white rounded-lg text-xs font-bold">
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  const [customEmail, setCustomEmail] = useState(booking.customer_email || '');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [emailStatus, setEmailStatus] = useState({ sent: true, message: '' });

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = async (overrideEmail) => {
    const target = (typeof overrideEmail === 'string' ? overrideEmail : customEmail).trim();
    setIsResending(true);
    setEmailStatus({ sent: false, message: '' });

    try {
      const res = await api.resendBookingEmail(booking.booking_id, target || undefined);
      setEmailStatus({
        sent: true,
        message: res.message || `E-Ticket successfully dispatched to ${target || booking.customer_email || 'your email'}!`
      });
      setShowEmailInput(false);
    } catch (err) {
      setEmailStatus({
        sent: false,
        message: err.message || 'Failed to dispatch confirmation email. Please try again.'
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-8">
        {/* Success Card */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl p-8 sm:p-10 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Booking Confirmed & Seats Reserved
          </span>

          <h1 className="text-3xl font-black text-brand-900 tracking-tight mt-3">
            Your Journey Is Confirmed!
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            A confirmation voucher and itinerary have been registered in your account and recorded in the database.
          </p>

          {/* Email Confirmation Dispatch Banner */}
          <div className="my-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-blue-50/90 border border-emerald-200/90 text-left shadow-2xs">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <MailCheck className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    Confirmation Email Dispatched
                  </h4>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 tracking-wide">
                    ✓ Automated E-Ticket
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Your official E-Ticket, travel voucher, passenger manifest, payment receipt, and 24x7 tour emergency contacts have been generated and sent to:
                </p>

                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs">
                    {customEmail || booking.customer_email || 'guest@globetrek.com'}
                  </span>
                  <button
                    onClick={() => setShowEmailInput(!showEmailInput)}
                    className="text-xs font-bold text-coral-600 hover:text-coral-700 underline cursor-pointer"
                  >
                    {showEmailInput ? 'Hide alternate email' : 'Send to another email?'}
                  </button>
                </div>

                {showEmailInput && (
                  <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="Enter recipient email address..."
                      className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                    <button
                      onClick={() => handleSendEmail(customEmail)}
                      disabled={isResending}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {isResending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      {isResending ? 'Sending...' : 'Send Now'}
                    </button>
                  </div>
                )}

                {emailStatus.message && (
                  <div className={`mt-3 text-xs font-bold flex items-center gap-1.5 ${emailStatus.sent ? 'text-emerald-700' : 'text-red-600'}`}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{emailStatus.message}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Reference Pill */}
          <div className="my-4 p-4 rounded-2xl bg-brand-50 border border-brand-200 inline-block">
            <div className="text-[11px] text-brand-600 font-bold uppercase tracking-wider">Booking Reference Number</div>
            <div className="text-2xl font-black text-brand-900 tracking-wider font-mono mt-0.5">
              {booking.booking_reference}
            </div>
          </div>

          {/* Printable Ticket Voucher Card */}
          <div className="text-left bg-slate-50/80 p-6 rounded-2xl border border-slate-200 space-y-4 my-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-coral-500" />
                <span className="font-extrabold text-sm text-slate-800">E-Ticket & Travel Voucher</span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Payment: Successful
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Tour Package:</span>
                <span className="font-bold text-slate-800">{booking.package_title}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Travel Dates:</span>
                <span className="font-bold text-slate-800">{booking.start_date} to {booking.end_date}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Primary Booker:</span>
                <span className="font-bold text-slate-800">{booking.customer_name} ({booking.customer_phone})</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Total Amount Paid:</span>
                <span className="font-extrabold text-brand-900 text-sm">₹{Number(booking.net_amount).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Passenger Manifest */}
            {booking.travellers && booking.travellers.length > 0 && (
              <div className="pt-3 border-t border-slate-200">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Booked Travellers</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {booking.travellers.map((t, idx) => (
                    <div key={idx} className="p-2.5 bg-white rounded-lg border border-slate-200 flex justify-between">
                      <span className="font-bold text-slate-800">{t.full_name}</span>
                      <span className="text-slate-500 font-medium">{t.age} yrs • {t.gender}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => handleSendEmail(customEmail || booking.customer_email)}
              disabled={isResending}
              className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
            >
              {isResending ? <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" /> : <Mail className="w-4 h-4 text-brand-600" />}
              {isResending ? 'Resending...' : 'Resend Email'}
            </button>
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" /> Print / Save Voucher
            </button>
            <button
              onClick={() => onNavigate('my-bookings')}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white text-xs font-extrabold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              View In My Bookings <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="w-full sm:w-auto px-5 py-3 text-brand-700 hover:bg-brand-50 text-xs font-bold rounded-xl transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
