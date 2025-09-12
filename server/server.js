const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// GitHub OAuth
app.post("/auth/github", async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "Code is missing" });

  try {
    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    });

    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      params.toString(),
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenResponse.data.access_token;
    res.json({ accessToken });
  } catch (err) {
    console.error(err.response?.data || err.message || err);
    res.status(500).json({ error: "GitHub OAuth failed" });
  }
});

// Test route
app.get("/", (req, res) => res.send("Backend is running 🚀"));

// Fetch repo data
app.post("/fetch-repo", async (req, res) => {
  try {
    const { repoUrl } = req.body;
    const parts = repoUrl.split("/");
    const owner = parts[parts.length - 2];
    const repo = parts[parts.length - 1];

    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`);
    res.json(response.data);
  } catch (err) {
    res.status(400).json({ error: "Invalid repo URL" });
  }
});

// Generate README
app.post("/generate-readme", async (req, res) => {
  try {
    const { repoData } = req.body;
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Generate a professional README.md for the project:
                Project: ${repoData?.name}
                Description: ${repoData?.description}
                Stars: ${repoData?.stargazers_count}
                Language: ${repoData?.language}
                Please include: Description, Features, Installation Guide, Tech Stack, License.`
              }
            ]
          }
        ]
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    res.send({ markdown: text });
  } catch (err) {
    console.error("Gemini Error:", err.response?.data || err.message || err);
    res.status(500).json({ error: "Failed to generate README" });
  }
});

// Start server (only once)
app.listen(5000, () => console.log("Server running on port 5000"));
