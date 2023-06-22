"use client";

import { NavBar } from "@/components/navbar";
import { UserProvider } from "@/context/user-context";

export default function Home() {
  return (
    <UserProvider>
      <div className="px-5 md:px-8 ">
        <NavBar />
      </div>
      <div className="mb-24 mt-12 px-5 md:px-8">
        <main className="mx-auto max-w-container"></main>
      </div>
    </UserProvider>
  );
}
