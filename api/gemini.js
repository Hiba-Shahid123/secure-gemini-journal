const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

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

    return res.status(200).json({
      reply: response.text
    });

  } catch (error) {
    console.error("Gemini error:", error);

    return res.status(500).json({
      error: error.message || "Gemini request failed."
    });
  }
};