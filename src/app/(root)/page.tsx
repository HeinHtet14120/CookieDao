"use client";

import React from "react";
import ChatBot from "@/components/Chatbox";
import { BackgroundBeams } from "@/components/ui/background-beams";
import ColourfulText from "@/components/ui/colourful-text";

export default function Home() {
  return (
    <main className="min-h-screen p-4 bg-gray-100 relative">
      <div className="relative z-10 max-w-6xl mx-auto pt-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-2xl md:text-5xl lg:text-7xl font-bold text-center text-white relative z-2 font-sans">
            Welcome to <ColourfulText text="Crypto Intelligence" />
            <br />
            Your <ColourfulText text="DEX Analytics" /> Hub
          </h1>
          <p className="text-lg text-gray-200 mt-8 max-w-2xl mx-auto">
            Your all-in-one platform for DEX analytics, social sentiment
            analysis, and AI-powered market insights{" "}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* ... existing feature cards ... */}
        </div>

        {/* ChatBot */}
        <div className="relative z-10">
          <ChatBot />
        </div>
      </div>

      <div className="fixed inset-0 z-0">
        <BackgroundBeams />
      </div>
    </main>
  );
}
