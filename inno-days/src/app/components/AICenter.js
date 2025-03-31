import React, { useState, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({
  apiKey: "TOKEN",
});

const AICenter = () => {
  const [data, setData] = useState(null);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/data"); // Replace with your BE endpoint
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Handle chat submission
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      // Combine fetched data and user query
      const context = `You are an AI assistant. Based on the following data: ${JSON.stringify(
        data
      )}, provide a concise and accurate response to the following question: ${query}. Ensure your response is clear, factual, and within the scope of the provided data.`;

      // Use Google Gemini API to generate a response
      const geminiResponse = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: context,
      });

      const responseText = geminiResponse.text;

      // Update response and chat history
      setResponse(responseText);
      setChatHistory((prev) => [...prev, { query, response: responseText }]);
    } catch (error) {
      console.error("Error generating response:", error);
      setResponse("An error occurred while generating the response.");
    }

    setQuery("");
  };

  return (
    <div className="font-roboto bg-gradient-to-br from-gray-900 to-gray-700 text-gray-300 p-5 rounded-lg shadow-lg mx-auto ">
      <header className="text-center mb-8">
        <h1 className="text-5xl text-cyan-400 drop-shadow-lg">AI Center</h1>
        <p className="text-lg text-green-400 mt-2 drop-shadow-md">
          Explore the power of AI with real-time data and futuristic design.
        </p>
      </header>
      <main className="flex flex-col gap-8">
        <section className="p-5 bg-white/5 rounded-lg">
          <h2 className="text-2xl mb-4 text-green-400 drop-shadow-md">
            Chat with Google Gemini
          </h2>
          {chatHistory.length > 0 && (
            <div className="bg-white/5 p-4 rounded-lg max-h-[450px] overflow-hidden shadow-md mb-4 flex flex-col">
              <h3 className="text-xl mb-4 text-green-400 text-center flex-shrink-0">
                Chat History
              </h3>
              <div className="flex flex-col gap-4 overflow-y-auto flex-grow">
                {chatHistory.map((chat, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="self-start bg-gray-300 text-black rounded-tl-md rounded-tr-3xl rounded-br-3xl rounded-bl-md p-3 shadow-sm">
                      <span>{chat.query}</span>
                    </div>
                    <div className="self-end bg-cyan-400 text-white rounded-tl-3xl rounded-tr-md rounded-br-md rounded-bl-3xl p-3 shadow-sm">
                      <span>{chat.response}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <form onSubmit={handleChatSubmit} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 p-2 border border-cyan-400 rounded-md bg-gray-900 text-gray-300"
            />
            <button
              type="submit"
              className="p-2 bg-cyan-400 text-black font-bold rounded-md hover:bg-cyan-600 transition"
            >
              Send
            </button>
          </form>
        </section>
      </main>
      <footer className="text-center mt-8 text-sm text-gray-500">
        <p>© 2023 AI Center. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AICenter;
