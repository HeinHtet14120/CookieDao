"use client";

import Navbar from "@/components/NavBar";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="">
      <Navbar />
      <div className=" h-screen w-full overflow-y-auto">
        {children}
      </div>
    </main>
  );
};

export default Layout;
