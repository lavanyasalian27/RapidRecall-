const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
const { GROQ_API_KEY } = require("./config"); // ✅ import from config.js

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});

app.post("/generate", async (req, res) => {
  const { topic } = req.body;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "mistral-saba-24b",
        messages: [
          {
            role: "user",
            content: `Create 5 flashcards for this engineering topic: ${topic}. Format them as Q&A.`
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`
        }
      }
    );

    const text = response.data.choices[0].message.content;
    const flashcards = text.split(/\n{2,}/);
    res.json({ flashcards });

  } catch (error) {
    console.error("❌ Groq API Error:", error.response?.data || error.message);
    res.status(500).send("API error");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Groq-powered server running on http://localhost:${PORT}`);
});
