import React from "react";
import { Map as MapIcon, Globe, Shield, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import { Attacker } from "../types";

export default function AttackerMap({ attackers, fullScreen = false }: { attackers: Attacker[], fullScreen?: boolean }) {
  const activeAttackers = attackers.slice(-10).reverse();

  return (
    <div className={`space-y-6 ${fullScreen ? "max-w-4xl mx-auto" : ""}`}>
      {/* Simulated Map View */}
      <div className="relative h-64 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
        <Globe className="w-32 h-32 text-slate-800 animate-pulse" />
        
        {/* Simulated Attack Points */}
        {activeAttackers.map((attacker, i) => (
          <motion.div
            key={attacker.ip}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="absolute"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
            }}
          >
            <div className="relative group">
              <div className={`w-3 h-3 rounded-full animate-ping absolute ${
                attacker.status === "blocked" ? "bg-red-500" : "bg-cyan-500"
              }`} />
              <div className={`w-3 h-3 rounded-full relative ${
                attacker.status === "blocked" ? "bg-red-500" : "bg-cyan-500"
              }`} />
              
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg shadow-2xl text-xs min-w-[150px]">
                  <p className="font-bold text-white mb-1">{attacker.ip}</p>
                  <p className="text-slate-400">Threat Score: <span className="text-red-500 font-bold">{attacker.threatScore}</span></p>
                  <p className="text-slate-400 capitalize">Status: {attacker.status}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        <div className="absolute bottom-4 right-4 flex gap-4 text-[10px] uppercase font-bold tracking-widest text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-500 rounded-full" />
            <span>Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span>Blocked</span>
          </div>
        </div>
      </div>

      {/* Attacker List */}
      <div className="space-y-3">
        {activeAttackers.map((attacker) => (
          <div key={attacker.ip} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${attacker.status === "blocked" ? "bg-red-500/10 text-red-500" : "bg-cyan-500/10 text-cyan-400"}`}>
                {attacker.status === "blocked" ? <Shield className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-sm font-mono font-bold text-white">{attacker.ip}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Last Seen: {new Date(attacker.lastSeen).toLocaleTimeString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-red-500">{attacker.threatScore}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Threat Score</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
