import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meme Voting App - Create & Vote",
  description: "Create memes with editor, discover trending crypto memes, vote with USDC on BASE",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
