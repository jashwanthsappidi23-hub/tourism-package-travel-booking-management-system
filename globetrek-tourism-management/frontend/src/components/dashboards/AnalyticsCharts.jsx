import React from 'react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

export default function AnalyticsCharts({ chartsData }) {
  if (!chartsData) return null;

  const { monthly_trends, destination_demand, booking_status_distribution, category_distribution } = chartsData;

  const STATUS_COLORS = {
    'Confirmed': '#10B981',
    'Pending': '#F59E0B',
    'Cancelled': '#EF4444',
    'Completed': '#3B82F6'
  };

  const CATEGORY_COLORS = ['#133E87', '#FF6B35', '#F7B801', '#10B981', '#6366F1', '#EC4899', '#8B5CF6'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
      {/* Chart 1: Monthly Revenue Trend (Area Chart) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Monthly Revenue Inflow (INR)</h3>
            <p className="text-xs text-slate-400">Dynamic aggregation from Payments & Bookings tables</p>
          </div>
          <span className="text-xs font-bold text-coral-600 bg-coral-50 px-2 py-0.5 rounded">3NF Query 14</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthly_trends || []}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#133E87" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#133E87" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `₹${val/1000}k`} />
              <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#133E87" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Destination Demand (Bar Chart) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Destination Demand by Travellers</h3>
            <p className="text-xs text-slate-400">Aggregated via PackageDestinations junction relation</p>
          </div>
          <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">3NF Query 8</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={destination_demand || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="destination" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip formatter={(value) => [value, 'Travellers Visited']} />
              <Bar dataKey="travellers_count" fill="#FF6B35" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Booking Status Distribution (Donut Chart) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Booking Status Distribution</h3>
            <p className="text-xs text-slate-400">Confirmed vs Cancelled lifecycle ratio</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Integrity Check</span>
        </div>
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={booking_status_distribution || []}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {(booking_status_distribution || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, name]} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: Package Category Demand */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Tour Packages by Category</h3>
            <p className="text-xs text-slate-400">Distribution of tour offerings</p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Catalogue Mix</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={category_distribution || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" stroke="#94a3b8" fontSize={11} />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={80} />
              <Tooltip formatter={(value) => [value, 'Packages']} />
              <Bar dataKey="value" fill="#133E87" radius={[0, 4, 4, 0]}>
                {(category_distribution || []).map((entry, index) => (
                  <Cell key={`cat-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
