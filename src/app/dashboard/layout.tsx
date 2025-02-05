"use client";

import Navbar from "@/components/NavBar";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex flex-col h-screen bg-black/100 border-none backdrop-blur-lg rounded-xl border shadow-xl">
    <div className="sticky top-0 z-50">
      <Navbar />
    </div>
    <div className="flex-1 bg-black/100 overflow-y-auto">
      {children}
    </div>
  </main>
  );
};

export default Layout;
