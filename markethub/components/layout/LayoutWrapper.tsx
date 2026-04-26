"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import React from "react";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register");

  if (isAuthPage) {
    return <main id="main-content" style={{ paddingTop: 0 }}>{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main id="main-content">
        {children}
      </main>
      <Footer />
    </>
  );
}
