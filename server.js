const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Optional: API Key सुरक्षा
const API_KEY = process.env.API_KEY || "mysecretkey";

app.use((req, res, next) => {
  const key = req.headers["x-api-key"];
  if (!key || key !== API_KEY) {
    return res.status(403).json({ error: "Forbidden: Invalid API Key" });
  }
  next();
});

// Health check (important for deployment)
app.get("/", (req, res) => {
  res.send("✅ MCP Server is running");
});

// MCP endpoint
app.post("/mcp", async (req, res) => {
  try {
    const { method, params, id } = req.body;

    let result;

    switch (method) {
      case "get_weather":
        result = {
          city: params?.city || "Unknown",
          temperature: "28°C",
          condition: "Sunny"
        };
        break;

      case "search_web":
        result = {
          query: params?.query,
          results: [
            `Top result for ${params?.query}`,
            `Another result for ${params?.query}`
          ]
        };
        break;

      case "sum_numbers":
        const numbers = params?.numbers || [];
        const sum = numbers.reduce((a, b) => a + b, 0);
        result = { numbers, sum };
        break;

      default:
        return res.status(400).json({
          jsonrpc: "2.0",
          error: { message: "Unknown method" },
          id
        });
    }

    // Standard MCP JSON-RPC response
    res.json({
      jsonrpc: "2.0",
      result,
      id
    });

  } catch (error) {
    console.error("Error:", error.message);

    res.status(500).json({
      jsonrpc: "2.0",
      error: { message: "Internal Server Error" },
      id: null
    });
  }
});

// Port (important for Docker/Render)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 MCP Server running on port ${PORT}`);
});
