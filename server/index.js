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
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        error: "Journal text is required."
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `You are a supportive personal journal assistant.

Read the following journal entry and provide:
1. A short reflection on what the user expressed.
2. One helpful observation.
3. One gentle suggestion for moving forward.

Do not diagnose medical or mental health conditions.

Journal entry:
${text}`
    });

    res.json({
      reply: response.text
    });

  } catch (error) {
    console.error("Gemini error:", error);

    res.status(500).json({
      error: "Gemini request failed."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});