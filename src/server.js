import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    const historyHeader = req.headers['chat-history'];
    const history = historyHeader ? JSON.parse(decodeURIComponent(historyHeader)) : []; // Decode history

    try {
        // Format history properly for the API
        const formattedHistory = history.map(entry => ({
            role: entry.role,
            parts: [{ text: entry.text }]
        }));

        const chat = model.startChat({ history: formattedHistory });

        let result = await chat.sendMessage(message);

        // Update chat history with user message and model response
        const newHistory = [
            ...formattedHistory,
            { role: 'user', parts: [{ text: message }] },
            { role: 'model', parts: [{ text: result.response.text() }] }
        ];

        res.json({ response: result.response.text() });
    } catch (error) {
        console.error("Error processing chat message:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(5000, () => {
    console.log("Server is listening on port 5000");
});
