import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import FloatingShape from "../components/floatingShape";

const ChatBot = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

  async function generateAnswer(e) {
    e.preventDefault();
    if (!question.trim()) return;

    setGeneratingAnswer(true);
    const currentQuestion = question;
    setQuestion("");

    setChatHistory((prev) => [
      ...prev,
      { type: "question", content: currentQuestion },
    ]);

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBy5RmuHRz6_kzfcw0zIF4fyPZF1ialdDY",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: currentQuestion }] }],
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch response");

      const data = await response.json();
      const aiResponse =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response received";

      setChatHistory((prev) => [
        ...prev,
        { type: "answer", content: aiResponse },
      ]);
    } catch (error) {
      console.error(error);
      setChatHistory((prev) => [
        ...prev,
        {
          type: "answer",
          content: "Sorry - Something went wrong. Please try again!",
        },
      ]);
    }
    setGeneratingAnswer(false);
  }

  return (
    <div>
      <div className="fixed inset-0 bg-gradient-to-r from-gray-800 via-green-900 to-emerald-900">
        <div className="h-full max-w-4xl mx-auto flex flex-col p-3 relative">
         
          <button
            className="absolute top-4 left-4 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors shadow-lg"
            onClick={() => navigate("/")}
          >
            ← Back
          </button>

          <header className="text-center py-4">
            <h1 className="text-4xl font-bold text-green-300 hover:text-emerald-500 transition-colors">
              GadgetMart ChatBot
            </h1>
          </header>

          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto mb-4 rounded-lg bg-green-800/80 shadow-lg p-4 hide-scrollbar"
          >
            {chatHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="bg-green-300 rounded-xl p-8 max-w-2xl">
                  <h2 className="text-2xl font-bold text-green-800 mb-4">
                    Welcome to GadgetMart ChatBot! 👋
                  </h2>
                  <p className="text-green-800 mb-4">Ask me anything:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="bg-green-700 p-4 rounded-lg shadow-sm text-white">
                      💡 General knowledge
                    </div>
                    <div className="bg-green-600 p-4 rounded-lg shadow-sm text-white">
                      🔧 Technical questions
                    </div>
                    <div className="bg-green-500 p-4 rounded-lg shadow-sm text-white">
                      📝 Writing assistance
                    </div>
                    <div className="bg-green-400 p-4 rounded-lg shadow-sm text-white">
                      🤔 Problem solving
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    chat.type === "question" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block max-w-[80%] p-3 rounded-lg overflow-auto hide-scrollbar ${
                      chat.type === "question"
                        ? "bg-emerald-500 text-white rounded-br-none"
                        : "bg-green-200 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <ReactMarkdown>{chat.content}</ReactMarkdown>
                  </div>
                </div>
              ))
            )}
            {generatingAnswer && (
              <div className="text-left">
                <div className="inline-block bg-green-100 p-3 rounded-lg animate-pulse">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={generateAnswer}
            className="bg-green-800 rounded-lg shadow-lg p-4"
          >
            <div className="flex gap-2">
              <textarea
                required
                className="flex-1 border border-green-500 rounded p-3 focus:border-green-400 focus:ring-1 focus:ring-green-400 resize-none bg-white"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything..."
                rows="2"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    generateAnswer(e);
                  }
                }}
              ></textarea>
              <button
                type="submit"
                className={`px-6 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors ${
                  generatingAnswer ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={generatingAnswer}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
