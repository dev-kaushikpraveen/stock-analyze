'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Server,
  Activity,
  Users,
  Database,
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Terminal,
} from 'lucide-react';

export const AdminDashboardTab: React.FC = () => {
  const [vendorStatus, setVendorStatus] = useState([
    { name: 'NSE/BSE Official API Feed', status: 'HEALTHY', latency: '4ms', rateLimit: '94% Available' },
    { name: 'Yahoo Finance Historical Engine', status: 'HEALTHY', latency: '28ms', rateLimit: '82% Available' },
    { name: 'Polygon Global Equities Feed', status: 'HEALTHY', latency: '12ms', rateLimit: '99% Available' },
    { name: 'Alpha Vantage Global Forex/Crypto', status: 'DEGRADED', latency: '142ms', rateLimit: '41% Available' },
  ]);

  const auditLogs = [
    { time: '14:26:12', ip: '103.21.244.18', action: 'API_QUERY_BACKTEST', user: 'trader_praveen', status: 200 },
    { time: '14:25:40', ip: '157.34.120.91', action: 'COPILOT_NLP_TRANSLATE', user: 'quant_desk_01', status: 200 },
    { time: '14:24:19', ip: '49.36.88.102', action: 'PORTFOLIO_WHAT_IF_RUN', user: 'inst_investor_44', status: 200 },
    { time: '14:22:05', ip: '198.51.100.22', action: 'AUTH_TOKEN_REFRESH', user: 'admin_root', status: 200 },
    { time: '14:20:11', ip: '185.220.101.5', action: 'SUSPICIOUS_RATE_LIMIT_HIT', user: 'anonymous', status: 429 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-3 border-b border-[#1e2638] gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Server className="w-5 h-5 text-brand-purple" />
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              NEXORA Enterprise Admin & Cybersecurity Console
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Mission-Critical Infrastructure Monitoring, Rate Limits, and Security Audit Logs
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
            All Primary Gateways Operational
          </span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0b0f19] border border-[#1e2638] rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Active Users</span>
            <Users className="w-4 h-4 text-brand-purple" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">14,892</div>
          <span className="text-[10px] font-mono text-emerald-400">+18% this month</span>
        </div>

        <div className="bg-[#0b0f19] border border-[#1e2638] rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Quant Engine Latency</span>
            <Cpu className="w-4 h-4 text-brand-cyan" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">4.2 ms</div>
          <span className="text-[10px] font-mono text-emerald-400">P99 &lt; 15ms SLA</span>
        </div>

        <div className="bg-[#0b0f19] border border-[#1e2638] rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>AI Token Throughput</span>
            <Activity className="w-4 h-4 text-brand-amber" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">842K /hr</div>
          <span className="text-[10px] font-mono text-slate-400">Tokens Ingested</span>
        </div>

        <div className="bg-[#0b0f19] border border-[#1e2638] rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>TimescaleDB Storage</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">1.84 TB</div>
          <span className="text-[10px] font-mono text-slate-400">Hypertables Compressed</span>
        </div>
      </div>

      {/* 2-Columns: Data Provider Status + Live Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Data Vendors */}
        <div className="lg:col-span-6 bg-[#0b0f19] border border-[#1e2638] rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1e2638]">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center">
              <Server className="w-4 h-4 mr-1.5 text-brand-purple" /> Data Vendor Health & Quotas
            </h2>
            <button className="text-[10px] font-mono text-brand-cyan hover:underline flex items-center">
              <RefreshCw className="w-3 h-3 mr-1" /> Ping Gateways
            </button>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {vendorStatus.map((v) => (
              <div
                key={v.name}
                className="p-3 rounded-xl bg-[#141a29]/80 border border-white/5 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-white block">{v.name}</span>
                  <span className="text-[10px] text-slate-400">Quotas: {v.rateLimit}</span>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      v.status === 'HEALTHY'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {v.status}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">{v.latency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Security Audit Logs */}
        <div className="lg:col-span-6 bg-[#0b0f19] border border-[#1e2638] rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1e2638]">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center">
              <Terminal className="w-4 h-4 mr-1.5 text-brand-cyan" /> Security Audit Trail (OWASP Top 10)
            </h2>
            <span className="text-[10px] font-mono text-slate-400">Live Syslog Stream</span>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            {auditLogs.map((log, i) => (
              <div
                key={i}
                className="p-2.5 rounded-lg bg-[#141a29]/60 border border-white/5 flex items-center justify-between text-[11px]"
              >
                <div>
                  <span className="text-slate-400 mr-2">{log.time}</span>
                  <span className="text-white font-bold">{log.action}</span>
                  <span className="text-[10px] text-slate-400 ml-2">({log.user})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400 text-[10px]">{log.ip}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                      log.status === 200 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
