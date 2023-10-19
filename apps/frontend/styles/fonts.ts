import { Boogaloo, Inter } from "next/font/google";

export const boogaloo = Boogaloo({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-boogaloo",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
