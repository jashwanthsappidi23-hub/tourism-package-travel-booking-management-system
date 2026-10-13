import React from 'react';
import { Compass, ShieldCheck, Database, Award, Heart, CheckCircle2 } from 'lucide-react';

export default function AboutUs({ onNavigate }) {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-coral-500" /> Worldwide Holiday Experiences
          </div>
          <h1 className="text-4xl font-black text-brand-900 tracking-tight">About BharatYatra</h1>
          <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            A comprehensive, normalized full-stack tourism package and travel booking management system built for College DBMS PBL Project 63.
          </p>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-extrabold text-brand-900">Project Mission & Objectives</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Traditional travel agencies struggle with spreadsheet planning, leading to departure capacity overbooking, scheduling conflicts for licensed tour guides, inconsistent cancellation fees, and untracked refund disbursements.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>BharatYatra</strong> resolves these critical challenges through a rigorously engineered relational database normalized up to <strong>Third Normal Form (3NF)</strong>. By enforcing foreign key constraints, CHECK boundaries, ACID transactions, and sequential day-wise itinerary rules, the platform guarantees mathematical data integrity across all 18 tables.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200">
              <span className="font-extrabold text-xs text-brand-900 block mb-1">18 Normalized Tables</span>
              <p className="text-[11px] text-slate-600">Zero repeating groups or partial/transitive dependencies.</p>
            </div>
            <div className="p-4 rounded-2xl bg-coral-50 border border-coral-200">
              <span className="font-extrabold text-xs text-coral-900 block mb-1">Dual-Engine Compatibility</span>
              <p className="text-[11px] text-slate-600">Native SQLite engine out-of-the-box and full MySQL/MariaDB DDL.</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="font-extrabold text-xs text-emerald-900 block mb-1">ACID Transaction Locking</span>
              <p className="text-[11px] text-slate-600">Prevents multiple users from reserving exceeding seats concurrently.</p>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
              <span className="font-extrabold text-xs text-indigo-900 block mb-1">3 Role-Based Portals</span>
              <p className="text-[11px] text-slate-600">Separate dashboards for Customers, Tour Guides, and Administrators.</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button 
            onClick={() => onNavigate('packages')}
            className="px-6 py-3 bg-brand-700 hover:bg-brand-800 text-white font-extrabold text-xs rounded-xl shadow-md transition"
          >
            Explore Tour Packages Catalogue
          </button>
        </div>
      </div>
    </div>
  );
}
