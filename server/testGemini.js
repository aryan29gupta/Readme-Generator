const axios = require("axios");

const GEMINI_API_KEY = "AIzaSyBZXr0DDv1AEMxUxYCMAhXP6qrBJo2osYg";

async function testGemini() {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: "Write a short README for a weather app" }]
          }
        ]
      }
    );
    console.log(response.data.candidates[0].content.parts[0].text);
  } catch (err) {
    console.error("Gemini Error:", err.response?.data || err.message);
  }
}

testGemini();
