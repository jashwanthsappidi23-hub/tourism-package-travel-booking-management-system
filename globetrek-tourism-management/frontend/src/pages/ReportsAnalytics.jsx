import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Database, Play, Clock, Table, Code2, Sparkles, 
  CheckCircle, Download, Printer, ArrowRight 
} from 'lucide-react';

export default function ReportsAnalytics({ onNavigate }) {
  const [selectedKey, setSelectedKey] = useState('view_available_departures');
  const [queryResult, setQueryResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const queryOptions = [
    { key: 'view_available_departures', label: 'View: AvailableDeparturesView (Capacity & Seats)', tag: 'SQL View' },
    { key: 'view_booking_details', label: 'View: BookingDetailsView (Customer, Departure & Payment)', tag: 'SQL View' },
    { key: 'view_guide_schedule', label: 'View: GuideScheduleView (Tour Guide Assignments)', tag: 'SQL View' },
    { key: 'view_monthly_revenue', label: 'View: MonthlyRevenueView (Gross, Refund & Net Revenue)', tag: 'SQL View' },
    { key: 'view_cancellation_refund', label: 'View: CancellationRefundView (Cancellation Audit)', tag: 'SQL View' },
    { key: 'q1_packages_catalog', label: 'Q1: Active Packages with Route Sequence (INNER JOIN, GROUP_CONCAT)', tag: '3NF Query' },
    { key: 'q6_guide_conflicts', label: 'Q6: Conflict Detection — Overlapping Guide Assignments (Self-Join)', tag: 'Integrity Rule' },
    { key: 'q7_package_revenue', label: 'Q7: Bookings & Revenue per Package (LEFT JOIN, COUNT, SUM)', tag: 'Aggregation' },
    { key: 'q8_popular_destinations', label: 'Q8: Most Popular Tourist Destinations (M:N Traversal)', tag: 'Aggregation' },
    { key: 'q13_nearing_capacity', label: 'Q13: Departures Nearing Capacity >= 80% (HAVING Clause)', tag: 'HAVING Filter' },
  ];

  useEffect(() => {
    executeSelectedQuery(selectedKey);
  }, [selectedKey]);

  async function executeSelectedQuery(key) {
    setLoading(true);
    try {
      const res = await api.runSQLQuery(key);
      setQueryResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-brand-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Database className="w-4 h-4 text-coral-500" /> Academic DBMS Demonstration
            </div>
            <h1 className="text-3xl font-black text-brand-900 tracking-tight">
              Live SQL Queries & Database Views Showcase
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Executes real SQL queries against the 3NF normalized schema in real-time.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="self-start sm:self-auto px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-xl shadow-xs hover:bg-slate-50 transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Export Report
          </button>
        </div>

        {/* Query Selector Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs mb-6">
          <label className="text-xs font-extrabold text-slate-800 block mb-2">
            Select SQL Query / Database View to Execute:
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <select
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              className="w-full sm:flex-1 p-3 text-xs border border-slate-200 rounded-xl bg-slate-50 font-bold text-slate-800 focus:outline-hidden"
            >
              {queryOptions.map(opt => (
                <option key={opt.key} value={opt.key}>
                  [{opt.tag}] {opt.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => executeSelectedQuery(selectedKey)}
              disabled={loading}
              className="w-full sm:w-auto px-5 py-3 bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              {loading ? 'Executing...' : 'Re-run Query'}
            </button>
          </div>
        </div>

        {/* SQL Source Code & DBMS Concept Card */}
        {queryResult && (
          <div className="space-y-6">
            <div className="bg-brand-900 text-slate-100 rounded-2xl p-6 shadow-md border border-brand-800">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-brand-800 text-xs">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-amber-400" />
                  <span className="font-extrabold text-white text-sm">{queryResult.title}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800">
                    Concept: {queryResult.concept}
                  </span>
                  <span className="text-amber-300 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {queryResult.execution_time_ms} ms
                  </span>
                  <span className="text-slate-300 font-medium">
                    {queryResult.row_count} row{queryResult.row_count !== 1 ? 's' : ''} returned
                  </span>
                </div>
              </div>

              {/* Formatted SQL Code Block */}
              <pre className="font-mono text-xs text-amber-200/90 overflow-x-auto p-3 rounded-xl bg-brand-950/70 border border-brand-800 leading-relaxed">
                {queryResult.sql}
              </pre>
            </div>

            {/* Tabulated Query Output Results */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="font-extrabold text-xs text-slate-800 flex items-center gap-2">
                  <Table className="w-4 h-4 text-coral-500" />
                  Tabulated Relational Results
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  {queryResult.columns.length} Attributes
                </span>
              </div>

              {queryResult.data.length === 0 ? (
                <div className="p-10 text-center text-xs text-slate-500">
                  Query executed successfully with 0 rows returned (no violations or records matching criteria).
                </div>
              ) : (
                <div className="overflow-x-auto max-h-[500px]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100/90 text-slate-700 font-bold sticky top-0 border-b border-slate-200">
                      <tr>
                        {queryResult.columns.map((col, idx) => (
                          <th key={idx} className="p-3.5 font-extrabold text-[11px] uppercase tracking-wider whitespace-nowrap">
                            {col.replace(/_/g, ' ')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {queryResult.data.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-brand-50/40 transition">
                          {queryResult.columns.map((col, cIdx) => {
                            const val = row[col];
                            return (
                              <td key={cIdx} className="p-3.5 text-slate-700 whitespace-nowrap font-medium">
                                {val === null || val === undefined ? (
                                  <span className="text-slate-300 italic">NULL</span>
                                ) : typeof val === 'number' && !Number.isInteger(val) ? (
                                  val.toLocaleString('en-IN')
                                ) : (
                                  String(val)
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
