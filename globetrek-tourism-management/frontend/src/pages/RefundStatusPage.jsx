import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  RotateCcw, CheckCircle2, Clock, AlertCircle, 
  Search, ShieldCheck, ArrowRight, DollarSign 
} from 'lucide-react';

export default function RefundStatusPage({ initialRef = '', onNavigate }) {
  const [bookingRef, setBookingRef] = useState(initialRef || 'BY-2026-RAJ-404');
  const [refundData, setRefundData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (bookingRef) {
      handleCheckRefund(bookingRef);
    }
  }, []);

  const handleCheckRefund = async (ref) => {
    if (!ref.trim()) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const data = await api.getRefundStatus(ref.trim());
      setRefundData(data);
    } catch (err) {
      setErrorMsg(err.message || 'No refund record found for this booking reference');
      setRefundData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
            <RotateCcw className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-brand-900 tracking-tight">Track Cancellation Refund</h1>
          <p className="text-xs text-slate-500 mt-1">Live disbursement status and cancellation fee reconciliation</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-8">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleCheckRefund(bookingRef); }}
            className="flex gap-2"
          >
            <input 
              type="text" 
              value={bookingRef} 
              onChange={(e) => setBookingRef(e.target.value)}
              placeholder="Enter Booking Reference (e.g. BY-2026-RAJ-404)"
              className="flex-1 px-4 py-2.5 text-xs border rounded-xl font-mono uppercase tracking-wider focus:outline-hidden font-bold"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Search className="w-4 h-4" /> {loading ? 'Checking...' : 'Track'}
            </button>
          </form>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-200 flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
          </div>
        )}

        {/* Refund Details Card */}
        {refundData && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Booking Ref</span>
                <div className="font-mono text-lg font-black text-brand-900">{refundData.booking_reference}</div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                {refundData.refund_status}
              </span>
            </div>

            {/* Financial Reconciliation Table */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Original Booking Amount Paid:</span>
                <span className="font-bold text-slate-800">₹{Number(refundData.total_paid).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Cancellation Fee Deducted:</span>
                <span className="font-bold">- ₹{Number(refundData.cancellation_fee).toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-emerald-700">
                <span className="font-extrabold">Net Disbursed Refund:</span>
                <span className="text-xl font-black">₹{Number(refundData.refund_amount).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Disbursement Audit Timeline</h3>
              
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-500">
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
                  <div className="text-xs font-bold text-slate-800">Cancellation Request Approved</div>
                  <div className="text-[11px] text-slate-500">Calculated under standard 3NF policy rules</div>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
                  <div className="text-xs font-bold text-slate-800">Refund Payout Disbursed</div>
                  <div className="text-[11px] text-slate-500">Transferred back via {refundData.refund_method}</div>
                  <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">Note: {refundData.notes}</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-center">
              <button
                onClick={() => onNavigate('my-bookings')}
                className="text-xs font-bold text-brand-700 hover:text-brand-900"
              >
                ← Back to My Bookings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
