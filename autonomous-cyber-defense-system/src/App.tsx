import React, { useState, useEffect } from "react";
import { Shield, AlertTriangle, Activity, Database, Server, Map as MapIcon, LogOut, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Dashboard from "./components/Dashboard";
import { auth, onAuthStateChanged, User, signInWithPopup, googleProvider } from "./firebase";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Login failed:", err);
      setError("Authentication failed. Please check your connection or try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Shield className="w-12 h-12 text-cyan-500" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-cyan-500/10 rounded-full">
              <Shield className="w-12 h-12 text-cyan-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-2">Cyber Defense System</h1>
          <p className="text-slate-400 text-center mb-8">Autonomous Self-Healing Security Engine</p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Lock className="w-5 h-5" />
            Access Secure Terminal
          </button>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Authorized Personnel Only. All activities are monitored and logged.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <Shield className="w-8 h-8 text-cyan-500" />
          <span className="font-bold text-lg tracking-tight text-white">CYBER-DEFENSE</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          <SidebarItem 
            icon={<Activity />} 
            label="Dashboard" 
            active={activeTab === "dashboard"} 
            onClick={() => setActiveTab("dashboard")} 
          />
          <SidebarItem 
            icon={<AlertTriangle />} 
            label="Attack Logs" 
            active={activeTab === "logs"} 
            onClick={() => setActiveTab("logs")} 
          />
          <SidebarItem 
            icon={<MapIcon />} 
            label="Attacker Map" 
            active={activeTab === "map"} 
            onClick={() => setActiveTab("map")} 
          />
          <SidebarItem 
            icon={<Server />} 
            label="System Health" 
            active={activeTab === "health"} 
            onClick={() => setActiveTab("health")} 
          />
          <SidebarItem 
            icon={<Database />} 
            label="Honeypot Data" 
            active={activeTab === "honeypot"} 
            onClick={() => setActiveTab("honeypot")} 
          />
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => auth.signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-mono text-green-500 uppercase tracking-widest">System Online</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400 font-mono">{user.email}</span>
            <div className="w-8 h-8 bg-cyan-500/20 rounded-full border border-cyan-500/50 flex items-center justify-center">
              <span className="text-xs font-bold text-cyan-500">{user.email?.[0].toUpperCase()}</span>
            </div>
          </div>
        </header>

        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Dashboard activeTab={activeTab} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active 
          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" 
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
      }`}
    >
      {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
      <span className="font-medium">{label}</span>
    </button>
  );
}
