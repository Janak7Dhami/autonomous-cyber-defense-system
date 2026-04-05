import React from "react";
import { AlertTriangle, Shield, Info, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AttackLog } from "../types";

export default function Alerts({ logs }: { logs: AttackLog[] }) {
  const recentLogs = logs.slice(-6).reverse();

  if (recentLogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
        <Shield className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-sm">No active threats detected</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {recentLogs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-4 rounded-xl border flex gap-4 items-start transition-all ${
              log.severity === "critical" ? "bg-red-500/10 border-red-500/20" :
              log.severity === "high" ? "bg-orange-500/10 border-orange-500/20" :
              log.severity === "medium" ? "bg-amber-500/10 border-amber-500/20" :
              "bg-blue-500/10 border-blue-500/20"
            }`}
          >
            <div className={`p-2 rounded-lg ${
              log.severity === "critical" ? "text-red-500 bg-red-500/10" :
              log.severity === "high" ? "text-orange-500 bg-orange-500/10" :
              log.severity === "medium" ? "text-amber-500 bg-amber-500/10" :
              "text-blue-500 bg-blue-500/10"
            }`}>
              {log.severity === "critical" ? <XCircle className="w-5 h-5" /> :
               log.severity === "high" ? <AlertTriangle className="w-5 h-5" /> :
               log.severity === "medium" ? <AlertTriangle className="w-5 h-5" /> :
               <Info className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-white">{log.attackType}</span>
                <span className="text-[10px] font-mono text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="text-xs text-slate-400 truncate">Source: {log.sourceIp}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Action:</span>
                <span className="text-[10px] font-bold text-cyan-500 uppercase">{log.actionTaken}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
