import './App.css'
// In src/App.js
import React, { useState } from 'react';

function App() {
  const [inputText, setInputText] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
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
  };

  return (
    <div>
      <h1>AI Dating Assistant</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your conversation text..."
        />
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
