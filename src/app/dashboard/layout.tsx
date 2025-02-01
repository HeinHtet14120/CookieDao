'use client';

import Navbar from "@/components/NavBar";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {

    return (
        <main className="min-h-screen">
            <Navbar />
            {children}
        </main>
    );
};

export default Layout;