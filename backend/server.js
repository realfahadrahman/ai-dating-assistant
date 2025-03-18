const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

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
app.post('/api/generate', (req,res) => {
    const { inputText } = req.body;
    // For now, just echo the text back
    res.json({ response: `Echo: ${inputText}`});
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});