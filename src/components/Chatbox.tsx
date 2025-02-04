"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Bot, Loader2, X, MessageCircle } from "lucide-react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      id: Date.now().toString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://api.deepseek.com/v1/chat/completions",
        {
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful AI assistant. Please provide clear, step-by-step explanations when answering questions.",
            },
            ...messages.map(({ role, content }) => ({ role, content })),
            { role: userMessage.role, content: userMessage.content },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${`sk-b8a489633af34740bbcf770c0c8ad4b8`}`,
          },
        },
      );

      const assistantMessage: Message = {
        role: "assistant",
        content: response.data.choices[0].message.content,
        id: (Date.now() + 1).toString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling DeepSeek API:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        id: (Date.now() + 1).toString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-4 right-4 p-4 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-300",
          "hover:scale-110 active:scale-95",
          isOpen && "hidden",
        )}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-4 right-4 w-full max-w-[400px] transition-all duration-300 transform",
          "rounded-lg shadow-2xl",
          isOpen
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none",
        )}
      >
        <div className="max-w-4xl w-full mx-auto rounded-lg shadow-input bg-black">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6  text-neutral-200" />
              <div>
                <h2 className="font-bold text-xl  text-neutral-200">
                  AI Assistant
                </h2>
                <p className=" text-sm max-w-sm mt-1 text-neutral-300">
                  Ask me anything
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2  hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-neutral-500" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto space-y-4 p-4 h-[400px]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`relative group/btn max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white"
                      : " bg-zinc-900  text-neutral-200 shadow-input shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <BottomGradient />
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className=" bg-zinc-900 rounded-lg px-4 py-2 flex items-center gap-2 shadow-input shadow-[0px_0px_1px_1px_var(--neutral-800)]">
                  <Loader2 className="w-4 h-4 animate-spin text-neutral-300" />
                  <span className=" text-neutral-300">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="p-4 border-t border-gray-200 border-gray-800">
            <PlaceholdersAndVanishInput
              placeholders={[
                "Ask me anything...",
                "How can I help you today?",
                "What's on your mind?",
                "Let's have a conversation...",
              ]}
              onChange={(e) => setInput(e.target.value)}
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};
