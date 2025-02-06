"use client";

import React from "react";
import ChatBot from "@/components/Chatbox";
import { BackgroundBeams } from "@/components/ui/background-beams";
import ColourfulText from "@/components/ui/colourful-text";
import { WobbleCard } from "@/components/ui/wobble-card";
import chart from "@/assets/images/chartdata.png"
import transistion from "@/assets/images/transhis.png"
import { FloatingDock } from "@/components/ui/floating-dock";
import { IconBrandGithub, IconBrandX } from "@tabler/icons-react";
import Image from "next/image";
import { GlowingCard } from "@/components/glowingcard";
import Footer from "@/components/Footer";
export default function Home() {
  const links = [
    {
      title: "X",
      icon: (
        <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://x.com/JrMafia404",
    },
    {
      title: "GitHub",
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://github.com/HeinHtet14120/CookieDao",
    },
  ];
  return (
    <>
      <main className="min-h-screen p-4 bg-gray-100 relative">
        <div className="relative z-10 max-w-6xl mx-auto pt-52">
          {/* Hero Section */}
          <div className="text-center mb-20">
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
          <FloatingDock
            items={links}
            desktopClassName="w-fit justify-center border-none mb-32"
          />

          {/* ChatBot */}
          <div className="relative z-10">
            <ChatBot />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
            <WobbleCard
              containerClassName="col-span-1 lg:col-span-2 h-full bg-gradient-to-br from-blue-900 to-purple-900"
              className=""
            >
              <div className="max-w-xs">
              <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          AI Trading Dashboard
        </h2>
        <p className="mt-4 text-left text-base/6 text-neutral-200">
          Track AI trading tokens with real-time market insights. Monitor price movements,
          market cap, liquidity, 24h volume, and holder metrics. Get AI-powered suggestions
          for optimal trading decisions across various DeFi protocols.
        </p>
              </div>
              <Image
                src={chart}
                width={400}
                height={400}
                alt="portfolio chart"
                className="absolute -right-[5%] -bottom-0 object-contain rounded-2xl"
              />
            </WobbleCard>

            <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-gradient-to-br from-purple-900 to-pink-900">
              <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                Smart Token Analytics
              </h2>
              <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                Deep dive into any token with our AI-powered analytics. Track
                whale movements, liquidity changes, and market sentiment in
                real-time.
              </p>
            </WobbleCard>

            <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-gradient-to-br from-indigo-900 to-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
              <div className="max-w-sm">
                <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                  Intelligent Portfolio Management
                </h2>
                <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                  Get personalized investment insights, automated portfolio
                  rebalancing suggestions, and real-time alerts for market
                  opportunities. Our AI helps you make smarter trading
                  decisions.
                </p>
              </div>
              <Image
                src={transistion}
                width={500}
                height={500}
                alt="analytics chart"
                className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
              />
            </WobbleCard>
          </div>
          <div className="max-w-7xl mx-auto w-full my-20">
            <GlowingCard />
          </div>
        </div>
        <BackgroundBeams />
      </main>
      <Footer />
    </>
  );
}
