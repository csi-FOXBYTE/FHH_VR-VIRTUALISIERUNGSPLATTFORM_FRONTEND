"use client";

import Footer from "@/components/navbar/Footer";
import Navbar from "@/components/navbar/Navbar";
import { CssBaseline } from "@mui/material";

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CssBaseline />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
