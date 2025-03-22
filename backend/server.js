require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const multer = require('multer');
const Tesseract = require('tesseract.js');

const app = express();
const PORT = process.env.PORT || 8080;

const path = require('path');


// Middleware
app.use(cors());
app.use(bodyParser.json());

// Basic route for testing
// app.get('/', (req, res) =>{
//     res.send("Hello from the backend!");
// });

// Configure Multer for file uploads (store files in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
                    content: `Here’s the conversation so far:\n\n\"${inputText}\"\n\nGive me a flirty, confident reply that keeps things fun and moves the conversation towards planning a date. Don't use an excess of emojis.`
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

// Endpoint: File upload and OCR processing
app.post('/api/upload', upload.single('screenshot'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  try {
    // Perform OCR on the uploaded image
    const result = await Tesseract.recognize(req.file.buffer, 'eng', { logger: m => console.log(m) });
    const extractedText = result.data.text.trim();

    // Use the extracted text to generate an AI response
    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a witty AI dating assistant." },
          { role: "user", content: `Generate a witty reply for this conversation: "${extractedText}"` }
        ],
        max_tokens: 50,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    
    const aiReply = openaiResponse.data.choices[0].message.content.trim();
    res.json({ response: aiReply, extractedText });
  } catch (error) {
    console.error("Error processing image or calling OpenAI API:", error.message);
    res.status(500).json({ error: 'Failed to process image and generate response' });
  }
});


// Serve static files from the frontend build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// For any other route, serve the index.html from the frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});