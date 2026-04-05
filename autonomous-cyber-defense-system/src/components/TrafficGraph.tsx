import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { AttackLog } from "../types";

export default function TrafficGraph({ logs }: { logs: AttackLog[] }) {
  // Group logs by time (last 10 minutes)
  const data = Array.from({ length: 10 }).map((_, i) => {
    const time = new Date(Date.now() - (9 - i) * 60000);
    const count = logs.filter(l => {
      const logTime = new Date(l.timestamp);
      return logTime.getMinutes() === time.getMinutes() && logTime.getHours() === time.getHours();
    }).length;
    
    return {
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      requests: Math.floor(Math.random() * 100) + 200, // Simulated normal traffic
      threats: count * 10, // Scaled for visibility
    };
  });

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#64748b" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
            itemStyle={{ fontSize: '12px' }}
          />
          <Area 
            type="monotone" 
            dataKey="requests" 
            stroke="#06b6d4" 
            fillOpacity={1} 
            fill="url(#colorRequests)" 
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="threats" 
            stroke="#ef4444" 
            fillOpacity={1} 
            fill="url(#colorThreats)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
