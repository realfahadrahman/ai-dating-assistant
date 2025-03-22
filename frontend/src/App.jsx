import './App.css'
// In src/App.js
// frontend/src/App.js
import React, { useState } from 'react';

function App() {
  const [inputText, setInputText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // If a file is uploaded, process it using the /api/upload endpoint
    if (file) {
      const formData = new FormData();
      formData.append('screenshot', file);
      try {
        const response = await fetch('http://localhost:8080/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        setAiResponse(data.response);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    } else {
      // Otherwise, use the text input endpoint
      try {
        const response = await fetch('http://localhost:8080/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inputText }),
        });
        const data = await response.json();
        setAiResponse(data.response);
      } catch (error) {
        console.error("Error fetching AI response:", error);
      }
    }
  };

  return (
    <div>
      <h1>AI Dating Assistant</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter conversation text..."
        />
        <div>
          <label htmlFor="screenshot">Or upload a screenshot: </label>
          <input
            type="file"
            id="screenshot"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <button type="submit">Get Response</button>
      </form>
      {aiResponse && (
        <div>
          <h2>AI Response:</h2>
          <p>{aiResponse}</p>
        </div>
      )}
    </div>
  );
}

export default App;
