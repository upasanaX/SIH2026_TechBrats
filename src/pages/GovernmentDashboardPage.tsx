import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FPO_METRICS, 
  RISK_DISTRIBUTION, 
  CHANNEL_PERFORMANCE, 
  PANCHAYAT_COMPARISON_TABLE
} from '../data/fpoData';
import { RiskBadge } from '../components/common/RiskBadge';
import { 
  Building2, 
  Users, 
  ShieldAlert, 
  CheckCircle2, 
  TrendingUp, 
  Download, 
  Filter, 
  Search, 
  Calendar,
  FileText,
  Clock,
  ArrowUpDown,
  Sparkles
  ,UserRoundCheck
  ,UserX
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';

export const GovernmentDashboardPage: React.FC = () => {
  const { showToast, accounts, updateAccountStatus, removeAccount } = useApp();
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [tableSearch, setTableSearch] = useState<string>('');
  const [sortField, setSortField] = useState<string>('registeredFarmers');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  const filteredTableData = PANCHAYAT_COMPARISON_TABLE.filter(item => {
    if (selectedDistrict !== 'all' && item.district !== selectedDistrict) return false;
    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q) ||
        item.dominantCrop.toLowerCase().includes(q)
      );
    }
    return true;
  }).sort((a: any, b: any) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }
    return sortAsc ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleDownloadReport = () => {
    showToast('Generating official KrishiKavach Panchayat Agro-Met Summary Report (PDF)...');
    setTimeout(() => {
      setIsReportModalOpen(true);
    }, 600);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner & Report Action */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              FPO & Government Multi-Panchayat Oversight Dashboard
            </h1>
            <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-sm border border-blue-300">
              District Portal
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time agro-meteorological monitoring, disaster early warning dissemination metrics, and marketplace trade ledger
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Generate Official Met Report</span>
          </button>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold">Registered Farmers</span>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">{FPO_METRICS.totalRegisteredFarmers.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-700 font-medium">100% Aadhaar/Kisan ID linked</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold">Active Panchayats</span>
            <Building2 className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">{FPO_METRICS.activePanchayats}</div>
          <div className="text-[10px] text-slate-500">Across 4 Pilot Districts</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold">Active Warnings</span>
            <ShieldAlert className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-red-700">{FPO_METRICS.activeAlertCount}</div>
          <div className="text-[10px] text-red-600 font-medium">1 Critical • 2 High</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold">Advisory Read Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{FPO_METRICS.advisoryDeliveryRate}%</div>
          <div className="text-[10px] text-emerald-700 font-medium">SMS + IVR + App</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold">Direct Trade Volume</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-700">₹{(FPO_METRICS.marketplaceVolumeINR / 100000).toFixed(1)}L</div>
          <div className="text-[10px] text-slate-500">42.5 tonnes produce</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold">Farmer Direct Gain</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-emerald-800">₹{(FPO_METRICS.farmersDirectSavingsINR / 100000).toFixed(1)}L</div>
          <div className="text-[10px] text-emerald-700 font-medium">Middlemen eliminated</div>
        </div>

      </div>

      {/* CHARTS: RISK DISTRIBUTION DONUT + MULTICHANNEL PERFORMANCE BARS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Risk Distribution Donut Chart (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Geographic Hazard Severity Distribution</h2>
              <p className="text-xs text-slate-500">Monitored Panchayats categorized by current risk</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={RISK_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {RISK_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {RISK_DISTRIBUTION.map((r, i) => (
              <div key={i} className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                <div className="truncate">
                  <div className="font-bold text-slate-800 truncate">{r.severity} ({r.count})</div>
                  <div className="text-[10px] text-slate-500 truncate">{r.panchayat}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Delivery Performance (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Channel Dissemination Reach (App vs SMS vs IVR)</h2>
              <p className="text-xs text-slate-500">Delivered vs queued broadcast volume across registered rural handsets</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHANNEL_PERFORMANCE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="channel" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="delivered" fill="#15803d" name="Delivered Successfully" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="#d97706" name="Queued in Dispatch" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-slate-500 text-[10px]">App Delivery Rate</div>
              <div className="text-base font-black text-emerald-700">97.0%</div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-slate-500 text-[10px]">SMS Handset Delivery</div>
              <div className="text-base font-black text-emerald-700">96.6%</div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-slate-500 text-[10px]">Voice IVR Connect</div>
              <div className="text-base font-black text-blue-700">92.5%</div>
            </div>
          </div>
        </div>

      </div>

      {/* SORTABLE PANCHAYAT COMPARISON TABLE */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Panchayat-Wise Comparative Matrix
            </h2>
            <p className="text-xs text-slate-500">
              Sort by registered farmers, risk level, rainfall accumulation, and marketplace volume
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700"
            >
              <option value="all">All Districts</option>
              <option value="South 24 Parganas">South 24 Parganas</option>
              <option value="Hooghly">Hooghly</option>
              <option value="North 24 Parganas">North 24 Parganas</option>
              <option value="Purba Bardhaman">Purba Bardhaman</option>
              <option value="Purba Medinipur">Purba Medinipur</option>
            </select>

            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter table..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-50 text-slate-500 font-bold border-y border-slate-200 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Panchayat & District</th>
                <th 
                  onClick={() => handleSort('registeredFarmers')} 
                  className="py-3 px-4 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Farmers</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Risk Severity</th>
                <th className="py-3 px-4">Dominant Crop</th>
                <th 
                  onClick={() => handleSort('rainfall24h')} 
                  className="py-3 px-4 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Rainfall (24h)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">SMS Broadcast</th>
                <th className="py-3 px-4">IVR Completed</th>
                <th 
                  onClick={() => handleSort('marketListedKg')} 
                  className="py-3 px-4 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Market Listed</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTableData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{row.name}</div>
                    <div className="text-[11px] text-slate-500">{row.district}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {row.registeredFarmers.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <RiskBadge severity={row.riskLevel as any} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {row.dominantCrop}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                    {row.rainfall24h}
                  </td>
                  <td className="py-3.5 px-4 text-emerald-700 font-bold">
                    {row.smsSent} Sent
                  </td>
                  <td className="py-3.5 px-4 text-blue-700 font-bold">
                    {row.ivrCompleted} Calls
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {row.marketListedKg.toLocaleString()} kg
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2"><UserRoundCheck className="w-5 h-5 text-emerald-700" /><h2 className="text-sm font-bold text-slate-900">Farmer & Consumer Accounts</h2></div>
            <p className="text-xs text-slate-500 mt-1">Review and control marketplace access from this shared FPO and government register.</p>
          </div>
          <span className="text-xs font-bold text-slate-500">{accounts.length} accounts</span>
        </div>
        <div className="space-y-2">
          {accounts.filter(account => account.role === 'farmer' || account.role === 'consumer').map(account => (
            <div key={account.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3 min-w-0"><div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-black">{account.name.charAt(0)}</div><div className="min-w-0"><div className="text-xs font-bold text-slate-900 truncate">{account.name}</div><div className="text-[11px] text-slate-500 capitalize">{account.role} • {account.contact} • {account.location}</div></div></div>
              <div className="flex items-center gap-2 shrink-0"><span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${account.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{account.status}</span><button onClick={() => updateAccountStatus(account.id, account.status === 'active' ? 'disabled' : 'active')} className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-[11px] font-bold text-slate-700 hover:bg-slate-100">{account.status === 'active' ? 'Disable' : 'Enable'}</button><button onClick={() => removeAccount(account.id)} aria-label={`Remove ${account.name}`} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"><UserX className="w-4 h-4" /></button></div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-700" />
                <h3 className="font-black text-slate-900 text-base">KrishiKavach Official Agro-Met Report</h3>
              </div>
              <button 
                onClick={() => setIsReportModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono">
                <div><strong>Document Ref:</strong> KK-GOV-REPORT-2026-0905</div>
                <div><strong>Timestamp:</strong> 05 Sep 2026, 20:45 IST</div>
                <div><strong>Jurisdiction:</strong> 6 Monitored Pilot Panchayats (West Bengal)</div>
              </div>

              <p>
                <strong>Executive Summary:</strong> 10,110 registered farmers monitored under active XGBoost downscaled weather cells. 4 active severe bulletins dispatched with 96.6% SMS delivery rate and 92.5% IVR call completion. Direct farm-to-consumer marketplace volume reached ₹8.46L with ₹2.38L in middleman commission savings.
              </p>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-1">
                <strong>Recommended Disaster Mitigation:</strong>
                <p>Maintain emergency excavator dredging on Bhangar-I canal gates ahead of midnight high precipitation surge.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                  setIsReportModalOpen(false);
                }}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
