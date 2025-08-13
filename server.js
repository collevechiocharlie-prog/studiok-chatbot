// index.js
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- This is the line to check very carefully ---
const API_KEY = process.env.GEMINI_API_KEY;
// ---------------------------------------------

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;

 // A STRONGER GERMAN PROMPT
const prompt = `
  Du bist ein Kundenservice-Assistent für den Modehändler "studiok". Deine einzige Aufgabe ist es, Kunden auf Deutsch zu helfen. Du sprichst oder verstehst kein Englisch. Alle deine Antworten müssen ausschließlich auf Deutsch sein.

  Hier ist ein Beispiel für eine perfekte Konversation:
  ---
  Kundenfrage: "Hallo, ich habe ein Problem mit einer Hose, die ich bei Ihnen gekauft habe."
  Deine Antwort: "Guten Tag! Selbstverständlich helfe ich Ihnen gerne weiter. Um welches Problem handelt es sich denn bei der Hose?"
  ---

  Deine Wissensdatenbank ist: "Unsere Richtlinie für ein eingelaufenes Kleidungsstück ist, den Kunden zuerst zu fragen, ob er die Pflegeanleitung auf dem Etikett befolgt hat. Wenn ja, bieten wir einen einmaligen Umtausch gegen denselben Artikel in der richtigen Größe an. Der Kunde muss einen Kassenbon vorlegen."

  Beantworte nun die folgende Kundenfrage. Erinnere dich: NUR auf Deutsch antworten.
  Kundenfrage: "${userMessage}"
`;

    
    console.log(`Received message: ${userMessage}`);
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Es tut mir leid, ein Fehler ist bei mir aufgetreten" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});