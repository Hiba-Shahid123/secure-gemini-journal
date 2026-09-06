require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.get("/", (req, res) => {
  res.json({
    message: "Secure Gemini Journal server is running!"
  });
});

app.post("/api/gemini", async (req, res) => {
  try {
    const { text, mood } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        error: "Journal text is required."
      });
    }

    const selectedMood = mood || "Not specified";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `You are a supportive personal journal assistant.

The user has shared a journal entry and their current mood.

Provide:
1. A short reflection on what the user expressed.
2. One helpful observation that takes their mood into account.
3. One gentle suggestion for moving forward.

Be supportive, warm, and concise.
Do not diagnose medical or mental health conditions.

Current mood:
${selectedMood}

Journal entry:
${text}`
    });

    res.json({
      reply: response.text
    });

  } catch (error) {
    console.error("Gemini error:", error);

    res.status(500).json({
      error: error.message || "Gemini request failed."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});