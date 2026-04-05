import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const SECRET_KEY = process.env.JWT_SECRET || "cyber-defense-secret";

app.use(cors());
app.use(express.json());

// --- Mock Data & Simulation Logic ---

let systemHealth = {
  cpuUsage: 45,
  memoryUsage: 60,
  activeNodes: 3,
  services: {
    trafficMonitor: "running",
    anomalyDetector: "running",
    honeypot: "running",
  },
};

let attackLogs: any[] = [];
let attackers: any[] = [];
let blockedIps: Set<string> = new Set();

// Simulation: Generate periodic "traffic" and "attacks"
setInterval(() => {
  // Randomly simulate an attack
  if (Math.random() > 0.8) {
    const attackTypes = ["DDoS", "SQL Injection", "Brute Force", "Port Scan"];
    const severities = ["low", "medium", "high", "critical"];
    const newAttack = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      sourceIp: `192.168.1.${Math.floor(Math.random() * 255)}`,
      targetPort: [80, 443, 22, 3306][Math.floor(Math.random() * 4)],
      attackType: attackTypes[Math.floor(Math.random() * attackTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      payload: "Simulated malicious payload",
      actionTaken: Math.random() > 0.5 ? "blocked" : "monitored",
    };
    attackLogs.push(newAttack);
    if (attackLogs.length > 50) attackLogs.shift();

    // Update attacker profile
    let attacker = attackers.find((a) => a.ip === newAttack.sourceIp);
    if (!attacker) {
      attacker = {
        ip: newAttack.sourceIp,
        threatScore: 0,
        lastSeen: new Date().toISOString(),
        attackCount: 0,
        patterns: [],
        status: "active",
      };
      attackers.push(attacker);
    }
    attacker.attackCount++;
    attacker.threatScore += newAttack.severity === "critical" ? 40 : 10;
    attacker.lastSeen = new Date().toISOString();
    if (attacker.threatScore > 100) {
      attacker.status = "blocked";
      blockedIps.add(attacker.ip);
    }
  }

  // Simulate service failure and self-healing
  if (Math.random() > 0.95) {
    const services = Object.keys(systemHealth.services) as Array<keyof typeof systemHealth.services>;
    const randomService = services[Math.floor(Math.random() * services.length)];
    systemHealth.services[randomService] = "down";
    console.log(`[Self-Healing] Service ${randomService} went down. Restarting...`);
    setTimeout(() => {
      systemHealth.services[randomService] = "running";
      console.log(`[Self-Healing] Service ${randomService} recovered.`);
    }, 3000);
  }

  // Update health metrics
  systemHealth.cpuUsage = Math.floor(Math.random() * 30) + 30;
  systemHealth.memoryUsage = Math.floor(Math.random() * 20) + 50;
}, 5000);

// --- API Endpoints ---

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  // Mock login
  if (username === "admin" && password === "password") {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    return res.json({ token });
  }
  res.status(401).json({ error: "Invalid credentials" });
});

app.get("/api/system-status", (req, res) => {
  res.json(systemHealth);
});

app.get("/api/attack-logs", (req, res) => {
  res.json(attackLogs);
});

app.get("/api/attackers", (req, res) => {
  res.json(attackers);
});

app.post("/api/block-ip", (req, res) => {
  const { ip } = req.body;
  blockedIps.add(ip);
  const attacker = attackers.find((a) => a.ip === ip);
  if (attacker) attacker.status = "blocked";
  res.json({ status: "ok", message: `IP ${ip} blocked` });
});

// Honeypot endpoints
app.post("/api/honeypot/login", (req, res) => {
  const { username, password } = req.body;
  const ip = req.ip || "unknown";
  console.log(`[Honeypot] Unauthorized login attempt from ${ip}: ${username}/${password}`);
  // Log as a critical attack
  const newAttack = {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    sourceIp: ip,
    targetPort: 8080,
    attackType: "Honeypot Trigger (Login)",
    severity: "critical",
    payload: `Login attempt: ${username}/${password}`,
    response: "HTTP 401 Unauthorized - Invalid credentials",
    actionTaken: "logged & profiled",
  };
  attackLogs.push(newAttack);
  res.status(401).json({ error: "Access denied" });
});

app.get("/api/honeypot/db-probe", (req, res) => {
  const query = req.query.q || "SELECT * FROM users";
  const ip = req.ip || "unknown";
  console.log(`[Honeypot] Database probe from ${ip}: ${query}`);
  
  const responses = [
    "Error: Table 'users' does not exist",
    "Error: Access denied for user 'root'@'%'",
    "Warning: SQL syntax error near 'FROM users'",
    "Success: 0 rows returned"
  ];
  const selectedResponse = responses[Math.floor(Math.random() * responses.length)];

  const newAttack = {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    sourceIp: ip,
    targetPort: 3306,
    attackType: "Honeypot Trigger (DB Probe)",
    severity: "critical",
    payload: `SQL Query: ${query}`,
    response: selectedResponse,
    actionTaken: "logged & profiled",
  };
  attackLogs.push(newAttack);
  res.json({ status: "error", message: selectedResponse });
});

// --- Vite Integration ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
