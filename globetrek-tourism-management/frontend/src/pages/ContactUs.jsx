import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactUs({ onNavigate }) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-brand-900 tracking-tight">Contact BharatYatra Concierge</h1>
          <p className="text-xs text-slate-500 mt-1">Our 24x7 India travel support team is standing by to help with your bookings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <Phone className="w-5 h-5 text-coral-500 mb-2" />
              <h3 className="font-bold text-xs text-slate-800">Phone Helpline</h3>
              <p className="text-xs text-slate-500 mt-0.5">Toll-free 24/7 across India</p>
              <div className="text-sm font-extrabold text-brand-900 mt-1">1800-102-YATRA</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <Mail className="w-5 h-5 text-coral-500 mb-2" />
              <h3 className="font-bold text-xs text-slate-800">Email Enquiries</h3>
              <p className="text-xs text-slate-500 mt-0.5">Average response under 1 hour</p>
              <div className="text-xs font-bold text-brand-900 mt-1">support@bharatyatra.com</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <MapPin className="w-5 h-5 text-coral-500 mb-2" />
              <h3 className="font-bold text-xs text-slate-800">Headquarters</h3>
              <p className="text-xs text-slate-500 mt-0.5">Brigade Gateway, Rajajinagar, Bengaluru, Karnataka, India - 560055</p>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
              <h2 className="text-lg font-black text-brand-900 mb-4">Send Us a Message</h2>

              {submitted ? (
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center text-xs text-emerald-800 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-bold text-sm">Thank you, {name}!</p>
                  <p>Your enquiry has been received. Our destination specialist will get in touch shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Your Name *</label>
                    <input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rahul Sharma" className="w-full p-2.5 border rounded-xl" />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
                    <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" className="w-full p-2.5 border rounded-xl" />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Message / Travel Enquiry *</label>
                    <textarea required rows="4" value={message} onChange={e => setMessage(e.target.value)} placeholder="Tell us about your planned holiday, destinations or query..." className="w-full p-2.5 border rounded-xl" />
                  </div>
                  <button type="submit" className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer">
                    <Send className="w-4 h-4" /> Submit Enquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
