import { NavBar } from "@/components/navbar";
import { UserProvider } from "@/context/user-context";
import { getUser } from "@/server-utils/get-user.server";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) redirect("/login");
  return (
    <UserProvider>
      <div className="flex min-h-screen flex-col">
        <div className="px-5 md:px-8 ">
          <NavBar />
        </div>
        <div className="mb-24 mt-12 h-0 flex-grow px-5 md:px-8">
          <main className="max-w-container mx-auto h-full">{children}</main>
        </div>
      </div>
    </UserProvider>
  );
}
