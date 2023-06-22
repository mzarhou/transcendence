"use client";

import { useUser } from "@/context/user-context";

export default function Home() {
  const { user } = useUser();

  return (
    <main className="mt-4 p-10">
      <div className="mt-10 overflow-x-auto">
        <pre className="max-w-lg  whitespace-pre">{JSON.stringify(user)}</pre>
      </div>
    </main>
  );
}
