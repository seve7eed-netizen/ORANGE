import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Set high body limit for handling embedded base64 images
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// API route to automatically save static projects back to the filesystem source code
app.post("/api/save-static-projects", async (req, res) => {
  try {
    const { projects } = req.body;
    if (!Array.isArray(projects)) {
      return res.status(400).json({ error: "Invalid projects data" });
    }

    const scriptFilePath = path.join(process.cwd(), "script.js");
    if (fs.existsSync(scriptFilePath)) {
      const originalContent = fs.readFileSync(scriptFilePath, "utf8");
      const splitToken = "// Load from localStorage or use default projects";
      const parts = originalContent.split(splitToken);
      
      if (parts.length >= 2) {
        const bottomPart = parts.slice(1).join(splitToken);
        const jsonProjects = JSON.stringify(projects, null, 2);
        
        const newFileContent = `// ORANGE Portfolio Exhibition Archive - Core Data & Logic

// Initial fallback projects data
const defaultProjects = ${jsonProjects};

${splitToken}${bottomPart}`;

        fs.writeFileSync(scriptFilePath, newFileContent, "utf8");
        console.log(`Successfully auto-wrote ${projects.length} projects directly into script.js`);
        return res.json({ success: true, count: projects.length });
      } else {
        console.warn("Could not find the split token in script.js to replace defaultProjects.");
      }
    } else {
      console.warn("script.js does not exist yet.");
    }

    return res.json({ success: true, count: projects.length, warning: "Local file not modified" });
  } catch (err: any) {
    console.error("Failed to save static projects file:", err);
    return res.status(500).json({ error: err.message || "Failed to write file" });
  }
});

// Vite middleware setup for development, fallback to static dist for production
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
