// ✅ FRONTEND: Chatbot.jsx (Final Updated with Voice and Maximize)
import React, { useState, useRef, useEffect, useContext, useCallback } from "react";
import ReactMarkdown from 'react-markdown';
import { ArrowUp, Bot, User, Mic, MicOff, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import axios from "axios";
import UserContext from "../context/UserContext";

// The Chatbot component now accepts `isMaximized` and `toggleMaximize` as props
const Chatbot = ({ isMaximized, toggleMaximize }) => {
  const userInfo = useContext(UserContext);
  const uid = userInfo?.uid;

  // Debug: Log when userInfo changes
  useEffect(() => {
    console.log("👤 UserContext updated:", { userInfo, uid });
  }, [userInfo, uid]);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I'm your Financial Assistant. Ask me anything about finance, investments, or money management!",
    },
  ]);
  const [chatHistory, setChatHistory] = useState([]); // stores last 5 Q&A pairs
  const [input, setInput] = useState("");
  const [liveTranscript, setLiveTranscript] = useState(""); // New state for live voice input
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // New state for mute functionality
  const [voiceStatus, setVoiceStatus] = useState("");

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null); // Ref to hold the SpeechSynthesisUtterance object
  const inputRef = useRef(null); // Ref for the textarea to manage focus

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- Voice Features Integration ---

  // Function to speak text using browser's speech synthesis
  const speak = (text) => {
    if (isMuted) return; // Don't speak if muted
    if (!("speechSynthesis" in window)) {
      console.warn("Speech Synthesis API not supported.");
      return;
    }
    // Clean up markdown for better speech
    const cleanText = text.replace(/(\*|_|`)/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-IN";
    utteranceRef.current = utterance; // Store utterance object to stop it later
    window.speechSynthesis.speak(utterance);
  };

  // Setup speech recognition once on component mount
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      setVoiceStatus("Voice input not supported in your browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setVoiceStatus("Listening... Speak now");
      setLiveTranscript("");
      setInput("");
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      setLiveTranscript(finalTranscript + interimTranscript);

      if (finalTranscript) {
        setInput(prevInput => prevInput + finalTranscript.trim());
        setLiveTranscript("");
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setVoiceStatus(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setVoiceStatus("");
      if (liveTranscript && !input) {
        setInput(liveTranscript.trim());
      }
      setLiveTranscript("");
    };

    recognitionRef.current = recognition;

    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  // Function to toggle voice input
  const toggleListening = () => {
    if (isLoading || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      if (liveTranscript) {
        setInput(liveTranscript.trim());
        setLiveTranscript("");
      }
    } else {
      setInput("");
      setLiveTranscript("");
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          recognitionRef.current.start();
          setIsListening(true);
        })
        .catch((err) => {
          console.error("Microphone access denied:", err);
          setVoiceStatus("Microphone access denied. Please allow access.");
        });
    }
  };

  // Function to toggle mute
  const toggleMute = () => {
    setIsMuted((prevMuted) => {
      if (!prevMuted && utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
      return !prevMuted;
    });
  };
  
  // --- End Voice Features Integration ---

  const sendMessage = useCallback(async () => {
    const messageToSend = liveTranscript ? liveTranscript.trim() : input.trim();
    
    // Debug logging
    console.log("📤 Sending message:", { messageToSend, uid, isLoading });
    
    if (messageToSend === "" || isLoading) {
      console.warn("⚠️ Cannot send: empty message or already loading");
      return;
    }
    
    if (!uid) {
      console.error("❌ No UID available. User info:", { userInfo });
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "**Error**: User ID not found. Please log in again.",
        },
      ]);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    }

    const userMessage = { sender: "user", text: messageToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLiveTranscript("");
    setIsLoading(true);

    const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    try {
      console.log("🔄 Posting to:", `${BASE_URL}/api/chatbot/getQuery`);
      const response = await axios.post(
        `${BASE_URL}/api/chatbot/getQuery`,
        {
          message: messageToSend,
          uid,
          previousQA: chatHistory.slice(-5), // send last 5 Q&A pairs
        },
        { withCredentials: true }
      );

      const botText = response.data.reply;
      const botMessage = { sender: "bot", text: botText };
      setMessages((prev) => [...prev, botMessage]);

      speak(botText); // Speak the bot's reply

      setChatHistory((prev) => {
        const newHistory = [...prev, { question: messageToSend, answer: botText }];
        return newHistory.slice(-5); // maintain only last 5 entries
      });
    } catch (error) {
      console.error("❌ Chatbot Error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `**Connection Error**\n${error.response?.data?.reply || "Sorry, I'm having trouble connecting to the server. Please try again later."}`,
        },
      ]);
      speak("Sorry, I'm having trouble connecting to the server.");
    } finally {
      setIsLoading(false);
    }
  }, [input, liveTranscript, isLoading, isListening, uid, chatHistory, userInfo]);


  return (
    <div className={`flex flex-col h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-lg overflow-hidden`}>
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <Bot className="text-blue-600 mr-2" size={20} />
          <h2 className="text-lg font-semibold text-gray-800">Financial Assistant</h2>
        </div>
        <div className="flex items-center">
          <button
            onClick={toggleMute}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors mr-2"
            aria-label={isMuted ? "Unmute audio response" : "Mute audio response"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button
            onClick={toggleMaximize}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={isMaximized ? "Minimize" : "Maximize"}
          >
            {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[77vh] md:max-h-full">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
              <div
                className={`flex-shrink-0 mt-1 mx-2 ${
                  msg.sender === "user" ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {msg.sender === "user" ? (
  <i className="ri-user-2-fill text-blue-600 text-lg"></i>
) : (
  <i className="ri-robot-3-fill text-gray-600 text-lg"></i>
)}
              </div>
              <div
                className={`px-4 py-3 rounded-2xl ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none"
                }`}
              >
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center px-4 py-3 bg-white text-gray-800 shadow-sm border border-gray-100 rounded-2xl rounded-tl-none">
              <div className="flex space-x-1 mr-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        )}
        {voiceStatus && (
          <div className="flex justify-center -mb-2">
            <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {voiceStatus}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-200">
        <div className="flex items-center rounded-xl bg-gray-100 focus-within:ring-2 focus-within:ring-zinc-300 focus-within:bg-white transition-all">
          <textarea
            ref={inputRef}
            value={isListening && liveTranscript ? liveTranscript : input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            rows={2}
            placeholder={
              isListening
                ? "Listening..."
                : "Ask about finance, investments..."
            }
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-transparent outline-none text-gray-800 placeholder-gray-500 resize-none max-h-40 overflow-y-auto"
          />
          <button
            onClick={toggleListening}
            type="button"
            disabled={isLoading}
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
            className={`mx-1 p-2 rounded-full transition-all ${
              isListening
                ? "text-red-600 bg-red-100 ring-2 ring-red-300"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <button
            onClick={sendMessage}
            disabled={isLoading || !(input.trim() || liveTranscript.trim())}
            className={`mx-2 p-2 rounded-full transition-all ${
              isLoading || !(input.trim() || liveTranscript.trim())
                ? "text-gray-400"
                : "text-white bg-zinc-600 hover:bg-zinc-700 transform hover:scale-105"
            }`}
            aria-label="Send message"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;