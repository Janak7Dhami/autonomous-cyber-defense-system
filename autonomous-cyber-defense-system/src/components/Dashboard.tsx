import React, { useState, useEffect } from "react";
import { Activity, Shield, AlertTriangle, Server, Database, Map as MapIcon, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import TrafficGraph from "./TrafficGraph";
import Alerts from "./Alerts";
import AttackerMap from "./AttackerMap";
import SystemHealth from "./SystemHealth";
import HoneypotLogs from "./HoneypotLogs";
import { AttackLog, Attacker, SystemStatus } from "../types";

export default function Dashboard({ activeTab }: { activeTab: string }) {
  const [logs, setLogs] = useState<AttackLog[]>([]);
  const [attackers, setAttackers] = useState<Attacker[]>([]);
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [logsRes, attackersRes, statusRes] = await Promise.all([
        fetch("/api/attack-logs"),
        fetch("/api/attackers"),
        fetch("/api/system-status"),
      ]);
      setLogs(await logsRes.json());
      setAttackers(await attackersRes.json());
      setStatus(await statusRes.json());
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                icon={<Activity />} 
                label="Active Threats" 
                value={logs.filter(l => l.severity === "critical" || l.severity === "high").length.toString()} 
                color="text-red-500"
                bg="bg-red-500/10"
              />
              <StatCard 
                icon={<Shield />} 
                label="Blocked IPs" 
                value={attackers.filter(a => a.status === "blocked").length.toString()} 
                color="text-cyan-500"
                bg="bg-cyan-500/10"
              />
              <StatCard 
                icon={<Server />} 
                label="System Health" 
                value={`${status?.cpuUsage}%`} 
                color="text-green-500"
                bg="bg-green-500/10"
              />
              <StatCard 
                icon={<Database />} 
                label="Honeypot Hits" 
                value={logs.filter(l => l.attackType === "Honeypot Trigger").length.toString()} 
                color="text-amber-500"
                bg="bg-amber-500/10"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-500" />
                    Network Traffic Analysis
                  </h2>
                  <TrafficGraph logs={logs} />
                </div>
                
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <MapIcon className="w-5 h-5 text-cyan-500" />
                    Threat Origin Map
                  </h2>
                  <AttackerMap attackers={attackers} />
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Recent Alerts
                  </h2>
                  <Alerts logs={logs} />
                </div>
                
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Server className="w-5 h-5 text-green-500" />
                    Self-Healing Engine
                  </h2>
                  <SystemHealth status={status} />
                </div>
              </div>
            </div>
          </div>
        );
      case "logs":
        return (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-6">Detailed Attack Logs</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-sm">
                    <th className="pb-4 font-medium">Timestamp</th>
                    <th className="pb-4 font-medium">Source IP</th>
                    <th className="pb-4 font-medium">Attack Type</th>
                    <th className="pb-4 font-medium">Severity</th>
                    <th className="pb-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 font-mono text-xs">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td className="py-4 font-mono">{log.sourceIp}</td>
                      <td className="py-4">{log.attackType}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          log.severity === "critical" ? "bg-red-500/20 text-red-500" :
                          log.severity === "high" ? "bg-orange-500/20 text-orange-500" :
                          log.severity === "medium" ? "bg-amber-500/20 text-amber-500" :
                          "bg-blue-500/20 text-blue-500"
                        }`}>
                          {log.severity}
                        </span>
                      </td>
                      <td className="py-4 text-slate-400">{log.actionTaken}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "map":
        return <AttackerMap attackers={attackers} fullScreen />;
      case "health":
        return <SystemHealth status={status} fullScreen />;
      case "honeypot":
        return <HoneypotLogs logs={logs} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>
          <p className="text-slate-400 mt-1">Real-time autonomous defense monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchData}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {renderContent()}
    </div>
  );
}

function StatCard({ icon, label, value, color, bg }: { icon: React.ReactNode, label: string, value: string, color: string, bg: string }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 ${bg} rounded-xl ${color}`}>
          {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
        </div>
        <div>
          <p className="text-sm text-slate-400 font-medium">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
      </div>
    </motion.div>
  );
}
