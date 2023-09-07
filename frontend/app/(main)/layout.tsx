"use client";

import { NavBar } from "@/components/navbar";
import Auth from "../Auth";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Auth>
      <div className="flex min-h-screen flex-col">
        <div className="px-5 md:px-8 ">
          <NavBar />
        </div>
        <div className="mb-24 mt-4 h-0 flex-grow px-5 md:mb-16 md:mt-0 md:px-8">
          <main className="max-w-container mx-auto h-full">{children}</main>
        </div>
      </div>
    </Auth>
  );
}
