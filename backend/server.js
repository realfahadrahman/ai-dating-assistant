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
app.get('/', (req, res) =>{
    res.send("Hello from the backend!");
});

// API endpoint for later use with AI
app.post('/api/generate', async(req,res) => {
    const { inputText } = req.body;
    try{
        const openaiResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-4o-mini",
                messages: [
                  {
                    role: "system",
                    content: "You are a witty AI dating assistant that provides creative, flirty, and context-aware responses for dating conversations."
                  },
                  {
                    role: "user",
                    content: `Generate a witty reply for this dating conversation: "${inputText}"`
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});