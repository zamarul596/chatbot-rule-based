import './App.css';
import React, { useState, useEffect, useRef } from "react";
import { getReply } from "./responses";


function App() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Sawadee! I am your AI buddy (type 'bye' to exit)" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Show loading indicator
    setIsLoading(true);

    // Simulate bot thinking with a delay (500ms)
    setTimeout(() => {
      const reply = getReply(input);
      const botMessage = { sender: "bot", text: reply };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="chat-container">
      <h2>AIREACH 2025</h2>
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === "user" ? "message user" : "message bot"}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="message bot loading">
            <span className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
        )}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          placeholder="Type a message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default App;
