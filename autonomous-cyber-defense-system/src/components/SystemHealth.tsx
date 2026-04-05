import React from "react";
import { Server, Activity, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { SystemStatus } from "../types";

export default function SystemHealth({ status, fullScreen = false }: { status: SystemStatus | null, fullScreen?: boolean }) {
  if (!status) return null;

  const services = [
    { id: "trafficMonitor", label: "Traffic Monitor", status: status.services.trafficMonitor },
    { id: "anomalyDetector", label: "Anomaly Detector", status: status.services.anomalyDetector },
    { id: "honeypot", label: "Deception Layer", status: status.services.honeypot },
  ];

  return (
    <div className={`space-y-8 ${fullScreen ? "max-w-4xl mx-auto" : ""}`}>
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">CPU Usage</span>
            <span className="text-sm font-bold text-cyan-500">{status.cpuUsage}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${status.cpuUsage}%` }}
              className={`h-full rounded-full ${status.cpuUsage > 80 ? "bg-red-500" : "bg-cyan-500"}`}
            />
          </div>
        </div>
        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Memory Usage</span>
            <span className="text-sm font-bold text-cyan-500">{status.memoryUsage}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${status.memoryUsage}%` }}
              className={`h-full rounded-full ${status.memoryUsage > 80 ? "bg-red-500" : "bg-cyan-500"}`}
            />
          </div>
        </div>
      </div>

      {/* Service Status List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-500" />
          Active Services
        </h3>
        
        <div className="space-y-3">
          {services.map((service) => (
            <div key={service.id} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800/50">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${service.status === "running" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                  {service.status === "running" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{service.label}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Status: {service.status}</p>
                </div>
              </div>
              
              {service.status === "down" && (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-3 h-3 text-cyan-500 animate-spin" />
                  <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Self-Healing...</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Node Status */}
      <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-500" />
            Distributed Node Network
          </h3>
          <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">{status.activeNodes} Nodes Online</span>
        </div>
        
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i} 
              className={`h-1 flex-1 rounded-full ${i < status.activeNodes ? "bg-cyan-500" : "bg-slate-800"}`} 
            />
          ))}
        </div>
        <p className="text-[10px] text-slate-500 mt-4 uppercase tracking-widest text-center">
          Intelligence Sharing: <span className="text-green-500">Active</span>
        </p>
      </div>
    </div>
  );
}
