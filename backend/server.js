require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Basic route for testing
// app.get('/', (req, res) =>{
//     res.send("Hello from the backend!");
// });

// API endpoint for later use with AI
app.post('/api/generate', async(req,res) => {
    const { inputText } = req.body;
    try{
        const openaiResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-4o",
                messages: [
                  {
                    role: "system",
                    content: "You are a charismatic AI wingman helping men succeed in online dating. Your job is to generate confident, flirty, and emotionally intelligent responses that build attraction, spark chemistry, and move the conversation toward getting a date. Be witty, playful, and charming—like a high-value guy who knows how to tease, flirt, and escalate naturally. Tailor your replies to the vibe of the conversation. Keep it under 3 sentences and never be boring or generic."
                  },
                  {
                    role: "user",
                    content: `Here’s the conversation so far:\n\n\"${inputText}\"\n\nGive me a flirty, confident reply that keeps things fun and moves the conversation towards planning a date.`
                  }
                ],
                max_tokens: 150,
            },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                },
              }
        );

        const aiReply = openaiResponse.data.choices[0].message.content.trim();
        res.json({ response: aiReply });
    }catch(error) {
        console.error("Error calling OpenAI API:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to generate response' });
    }

});

const path = require('path');

// Serve static files from the frontend build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// For any other route, serve the index.html from the frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});