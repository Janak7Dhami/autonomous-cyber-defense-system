import React from "react";
import { Database, Terminal, Shield, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { AttackLog } from "../types";

export default function HoneypotLogs({ logs }: { logs: AttackLog[] }) {
  const honeypotLogs = logs.filter(l => l.attackType.includes("Honeypot")).reverse();

  if (honeypotLogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-slate-950/30 rounded-2xl border border-slate-800/50">
        <Database className="w-16 h-16 mb-4 opacity-10" />
        <p className="text-lg font-medium">No deception layer activity detected</p>
        <p className="text-sm opacity-60">The honeypot is currently active and monitoring for probes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-1">Total Probes</p>
          <p className="text-3xl font-bold text-white">{honeypotLogs.length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-1">Unique IPs</p>
          <p className="text-3xl font-bold text-cyan-500">{new Set(honeypotLogs.map(l => l.sourceIp)).size}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <p className="text-xl font-bold text-green-500">ACTIVE</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-500" />
            Deception Terminal Output
          </h3>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Live Monitoring</span>
        </div>
        
        <div className="divide-y divide-slate-800">
          {honeypotLogs.map((log, i) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-6 hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{log.attackType}</p>
                        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                          {log.sourceIp} • {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-red-500/20 text-red-500 text-[10px] font-bold rounded uppercase">
                      {log.severity}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/50">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Shield className="w-3 h-3" />
                        Captured Payload
                      </p>
                      <code className="text-xs text-cyan-400 font-mono break-all">
                        {log.payload}
                      </code>
                    </div>
                    <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/50">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Database className="w-3 h-3" />
                        Fake Response Sent
                      </p>
                      <code className="text-xs text-amber-400 font-mono italic">
                        {log.response || "No response logged"}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
