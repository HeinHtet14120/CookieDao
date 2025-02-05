"use client";

import Navbar from "@/components/NavBar";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex flex-col h-screen">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div className="flex-1 bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-y-auto">
        {children}
      </div>
    </main>
  );
};

export default Layout;
