const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.post("/mcp", async (req, res) => {
    const { method, params, id } = req.body;

    let result;

    if (method === "get_weather") {
        result = { temperature: "28°C", city: params.city };
    } else if (method === "search_web") {
        result = { results: [`Result for ${params.query}`] };
    } else {
        result = { error: "Unknown method" };
    }

    res.json({
        jsonrpc: "2.0",
        result,
        id
    });
});

app.listen(3000, () => {
    console.log("MCP Server running on port 3000");
});