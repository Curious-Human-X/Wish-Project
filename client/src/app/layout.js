import { Inter } from "next/font/google"; // Switch to standard Inter font for better compatibility
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  // CHANGE THIS: The title that appears on the browser tab
  title: "Happy Birthday Khushi! 🎉",
  description: "A special surprise just for you.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}