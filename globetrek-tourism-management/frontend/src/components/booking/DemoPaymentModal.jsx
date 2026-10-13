import React, { useState } from 'react';
import { 
  CreditCard, QrCode, Building, Zap, ShieldCheck, 
  CheckCircle, AlertCircle, Loader2, X 
} from 'lucide-react';

export default function DemoPaymentModal({ isOpen, onClose, booking, onPaymentSuccess }) {
  const [activeTab, setActiveTab] = useState('upi'); // 'upi', 'card', 'netbanking', 'demo'
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [upiVpa, setUpiVpa] = useState('traveller@okaxis');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  if (!isOpen || !booking) return null;

  const handleSimulate = async (method, outcome = 'SUCCESS') => {
    setProcessing(true);
    setErrorMsg('');

    try {
      // Small artificial delay to simulate realistic payment gateway handshake
      await new Promise(res => setTimeout(res, 1200));

      const payload = {
        booking_id: booking.booking_id,
        payment_method: method,
        simulated_outcome: outcome
      };

      await onPaymentSuccess(payload);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Payment simulation failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-brand-900 text-white p-6 relative">
          <button 
            onClick={onClose}
            disabled={processing}
            className="absolute top-5 right-5 p-1 text-slate-400 hover:text-white rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-coral-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> Secure Demo Payment Gateway
          </div>
          <h2 className="text-2xl font-black">Complete Your Booking</h2>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-300">
            <span>Booking Ref: <strong className="text-white">{booking.booking_reference}</strong></span>
            <span className="text-base font-extrabold text-amber-400">Total: ₹{Number(booking.net_amount).toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Demo Warning Banner */}
        <div className="bg-amber-50 px-6 py-2.5 border-b border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-600 shrink-0" />
          <span><strong>College Project Demo Mode:</strong> No real bank details are collected or charged.</span>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
            </div>
          )}

          {/* Payment Method Selector Tabs */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            <button
              onClick={() => setActiveTab('upi')}
              className={`p-2.5 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1.5 ${activeTab === 'upi' ? 'bg-coral-50 border-coral-500 text-coral-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <QrCode className="w-5 h-5" /> UPI / QR
            </button>
            <button
              onClick={() => setActiveTab('card')}
              className={`p-2.5 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1.5 ${activeTab === 'card' ? 'bg-coral-50 border-coral-500 text-coral-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <CreditCard className="w-5 h-5" /> Cards
            </button>
            <button
              onClick={() => setActiveTab('netbanking')}
              className={`p-2.5 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1.5 ${activeTab === 'netbanking' ? 'bg-coral-50 border-coral-500 text-coral-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <Building className="w-5 h-5" /> NetBanking
            </button>
            <button
              onClick={() => setActiveTab('demo')}
              className={`p-2.5 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1.5 ${activeTab === 'demo' ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <Zap className="w-5 h-5 text-indigo-500" /> 1-Click Pay
            </button>
          </div>

          {/* Tab 1: UPI */}
          {activeTab === 'upi' && (
            <div className="space-y-4">
              <div className="flex items-center justify-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <div className="text-center">
                  <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl shadow-xs border flex items-center justify-center">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=bharatyatra@demo&pn=BharatYatra&am=${booking.net_amount}`}
                      alt="UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">Scan with GPay, PhonePe, Paytm or BHIM</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Or enter UPI ID / VPA</label>
                <input 
                  type="text" 
                  value={upiVpa} 
                  onChange={(e) => setUpiVpa(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-coral-500 outline-hidden font-medium"
                  placeholder="username@bank"
                />
              </div>

              <button
                disabled={processing}
                onClick={() => handleSimulate('UPI', 'SUCCESS')}
                className="w-full py-3.5 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white font-extrabold rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Simulate UPI Payment Success'}
              </button>
            </div>
          )}

          {/* Tab 2: Cards */}
          {activeTab === 'card' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Card Number</label>
                <input 
                  type="text" 
                  value={cardNumber}
                  readOnly
                  className="w-full px-3 py-2 text-sm border rounded-xl bg-slate-50 font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Valid Thru</label>
                  <input type="text" value="12/29" readOnly className="w-full px-3 py-2 text-sm border rounded-xl bg-slate-50 font-mono" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">CVV</label>
                  <input type="password" value="888" readOnly className="w-full px-3 py-2 text-sm border rounded-xl bg-slate-50 font-mono" />
                </div>
              </div>
              <button
                disabled={processing}
                onClick={() => handleSimulate('Card', 'SUCCESS')}
                className="w-full mt-4 py-3.5 bg-gradient-to-r from-coral-500 to-coral-600 text-white font-extrabold rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Pay ₹' + Number(booking.net_amount).toLocaleString('en-IN') + ' with Card'}
              </button>
            </div>
          )}

          {/* Tab 3: NetBanking */}
          {activeTab === 'netbanking' && (
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-600 mb-1 block">Select Banking Partner</label>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank'].map(bank => (
                  <button
                    key={bank}
                    onClick={() => setSelectedBank(bank)}
                    className={`p-3 rounded-xl border text-left transition ${selectedBank === bank ? 'border-coral-500 bg-coral-50 text-coral-700' : 'border-slate-200 hover:bg-slate-50'}`}
                  >
                    {bank}
                  </button>
                ))}
              </div>
              <button
                disabled={processing}
                onClick={() => handleSimulate('NetBanking', 'SUCCESS')}
                className="w-full py-3.5 bg-gradient-to-r from-coral-500 to-coral-600 text-white font-extrabold rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : `Authenticate & Pay via ${selectedBank}`}
              </button>
            </div>
          )}

          {/* Tab 4: 1-Click Instant Demo */}
          {activeTab === 'demo' && (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Zap className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Rapid demo evaluation button for college review. Instantly writes payment transaction record to the relational database.
              </p>
              <div className="flex gap-2">
                <button
                  disabled={processing}
                  onClick={() => handleSimulate('DemoPay', 'SUCCESS')}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simulate Success (Record Paid)'}
                </button>
                <button
                  disabled={processing}
                  onClick={() => handleSimulate('DemoPay', 'FAILED')}
                  className="py-3 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer disabled:opacity-50"
                >
                  Simulate Failure
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
