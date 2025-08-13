// server.js
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- Configuration ---
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

// --- This is the new part that enables chat history! ---
// We start the chat with our initial instructions.
const chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [{ text: `
        Du bist ein Kundenservice-Assistent für den Modehändler "studiok". Deine einzige Aufgabe ist es, Kunden auf Deutsch zu helfen. Du sprichst oder verstehst kein Englisch. Alle deine Antworten müssen ausschließlich auf Deutsch sein.

        Deine Wissensdatenbank ist: "Unsere Richtlinie für ein eingelaufenes Kleidungsstück ist, den Kunden zuerst zu fragen, ob er die Pflegeanleitung auf dem Etikett befolgt hat. Wenn ja, bieten wir einen einmaligen Umtausch gegen denselben Artikel in der richtigen Größe an. Der Kunde muss einen Kassenbon vorlegen."
      `}],
    },
    {
      role: "model",
      parts: [{ text: "Verstanden. Ich bin ein hilfsbereiter Assistent für studiok und antworte nur auf Deutsch. Wie kann ich helfen?" }],
    },
  ],
  generationConfig: {
    maxOutputTokens: 200, // Limits the length of the AI's response
  },
});
// ---------------------------------------------------------

const app = express();
app.use(cors());
app.use(express.json());

// This endpoint is now much simpler
app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    console.log(`Received message: ${userMessage}`);

    // The 'chat' object automatically remembers the history
    const result = await chat.sendMessage(userMessage);
    const response = result.response;
    const text = response.text();

    // Send the AI's response back to the webpage
    res.json({ reply: text });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Entschuldigung, ein interner Fehler ist aufgetreten." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});