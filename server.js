// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch"); // Make sure you installed this → npm install node-fetch

const app = express();
app.use(bodyParser.json());
app.use(cors());

const API_KEY = "AIzaSyCidsox9il5Iu6bbiBOAIWzafbCcbyLJ7Q"; // ⬅️ your Gemini API key

app.post("/generate", async (req, res) => {
  const { task, tone, topic } = req.body;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Task: ${task}\nTone: ${tone}\nTopic: ${topic}\nGenerate a useful writing prompt.`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    console.log("Gemini response:", data);

    if (data.candidates && data.candidates.length > 0) {
      res.json({ prompt: data.candidates[0].content.parts[0].text });
    } else {
      res.status(500).json({ error: "No prompt generated" });
    }
  } catch (err) {
    console.error("Error fetching from Gemini:", err);
    res.status(500).json({ error: "Failed to generate prompt" });
  }
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
