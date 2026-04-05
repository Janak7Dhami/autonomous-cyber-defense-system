export interface AttackLog {
  id: string;
  timestamp: string;
  sourceIp: string;
  targetPort: number;
  attackType: string;
  severity: "low" | "medium" | "high" | "critical";
  payload: string;
  response?: string;
  actionTaken: string;
}

export interface Attacker {
  ip: string;
  threatScore: number;
  lastSeen: string;
  attackCount: number;
  patterns: string[];
  status: "active" | "blocked" | "monitored";
}

export interface SystemStatus {
  cpuUsage: number;
  memoryUsage: number;
  activeNodes: number;
  services: {
    trafficMonitor: string;
    anomalyDetector: string;
    honeypot: string;
  };
}
