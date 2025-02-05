"use client";
import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Github,
  Twitter,
  DiscIcon as DiscordIcon,
  ChevronRight,
  User,
  Spade,
  SpadeIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function AdvancedWeb3Footer() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup logic here
    console.log("Signed up with:", email);
    setEmail("");
  };

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto pt-8 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <motion.h2
              className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Junior Mafia
            </motion.h2>
            <p className="text-gray-400 mb-4">
              Empowering the future of decentralized finance. Join us in shaping
              the Web3 revolution.
            </p>
            <div className="flex space-x-4">
              {[Github, Twitter, DiscordIcon].map((Icon, index) => (
                <motion.a
                  key={index}
                  href={
                    Github === Icon
                      ? "https://github.com/HeinHtet14120/CookieDao"
                      : "https://x.com/JrMafia404"
                  }
                  className="text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="h-6 w-6" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* developer profile */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Devs</h3>
            
            <div onClick={() => window.open("https://x.com/biginthe4teen", "_blank")} className="flex items-center gap-2 cursor-pointer">
              <SpadeIcon className="h-4 w-4" />
              <p className="text-gray-400 hover:underline">Big</p>
            </div>

            <div onClick={() => window.open("https://x.com/PhilipBright_", "_blank")} className="flex items-center gap-2 cursor-pointer">
              <SpadeIcon className="h-4 w-4" />
              <p className="text-gray-400 hover:underline">Bright</p>
            </div>
            
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and insights.
            </p>
            <form onSubmit={handleSubmit} className="flex">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button
                type="submit"
                className="ml-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                onClick={() => {
                  toast({
                    title: "Email Subscribed",
                    description: "You will receive updates soon",
                    action: (
                      <ToastAction altText="Goto schedule to undo">
                        Undo
                      </ToastAction>
                    ),
                  });
                }}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex justify-between items-center">
          <p className="text-gray-400">
            &copy; 2025 Junior Mafia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
