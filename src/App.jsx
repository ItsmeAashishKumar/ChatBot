import React, { useState } from 'react';
import './App.css';

function App() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [history, setHistory] = useState([]); // Store chat history

    const handleAsk = async () => {
        try {
            const encodedHistory = encodeURIComponent(JSON.stringify(history)); // Encode history

            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Chat-History': encodedHistory, // Pass encoded history
                },
                body: JSON.stringify({ message: question }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const data = await response.json();

            // Update history with user message and model response
            const newHistory = [
                ...history,
                { role: 'user', text: question },
                { role: 'model', text: data.response },
            ];
            setHistory(newHistory);
            setAnswer(data.response);
            setQuestion(''); // Clear the input after sending
        } catch (error) {
            console.error("Error during fetch:", error);
            setAnswer("There was an error processing your request.");
        }
    };

    return (
        <div className='main'>
            <div className="chat-container">
                <div className="history">
                    {history.map((entry, index) => (
                        <div key={index} className={entry.role}>
                            <p>{entry.text}</p>
                        </div>
                    ))}
                </div>
                <div className="question">
                    <input
                        className="que"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="What do you want to know?"
                    />
                    <button className="askbtn" onClick={handleAsk}>Ask Me</button>
                </div>
                {/*<div className="answer">
                    <p className="ans">{answer}</p>
                </div>*/}
            </div>
        </div>
    );
}

export default App;
