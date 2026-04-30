import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  console.log("Starting server implementation...");
  const app = express();
  const PORT = 3000;

  // Supabase Setup
  let supabaseUrl = (process.env.SUPABASE_URL || "").trim();
  if (supabaseUrl.endsWith('/')) {
    supabaseUrl = supabaseUrl.slice(0, -1);
  }
  const supabaseKey = (process.env.SUPABASE_ANON_KEY || "").trim();
  
  console.log(`Supabase configuration found: URL=${!!supabaseUrl}, Key=${!!supabaseKey}`);

  let supabase: any = null;
  
  if (supabaseUrl && supabaseKey) {
    try {
      supabase = createClient(supabaseUrl, supabaseKey);
      console.log("Supabase client initialized successfully");
    } catch (err) {
      console.error("Failed to initialize Supabase client:", err);
    }
  }

  app.use(cors());
  app.use(morgan("dev"));
  app.use(bodyParser.json());

  // Health check early
  app.get("/api/health", (req, res) => {
    console.log("Health check request received");
    res.json({ 
      status: "ok", 
      supabaseConfigured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
      supabaseInitialized: !!supabase
    });
  });

  app.post("/api/register", async (req, res) => {
    try {
      if (!supabase) {
        return res.status(503).json({ error: "Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your secrets." });
      }

      const studentData = req.body;
      
      // Basic validation
      if (!studentData.email || !studentData.name) {
        return res.status(400).json({ error: "Name and email are required" });
      }

      const { data, error } = await supabase
        .from("students")
        .insert([
          {
            name: studentData.name,
            email: studentData.email,
            course: studentData.course,
            phone: studentData.phone,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        console.error("Supabase Error:", error);
        return res.status(500).json({ error: error.message });
      }

      res.status(201).json({ message: "Student registered successfully", data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/students", async (req, res) => {
    try {
      if (!supabase) {
        return res.status(503).json({ error: "Supabase is not configured." });
      }

      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase Error:", error);
        return res.status(500).json({ error: error.message });
      }

      res.json(data || []);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Catch-all for API routes to prevent falling through to Vite
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: `API route not found: ${req.method} ${req.url}` });
  });

  // Vite middleware for development
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

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
