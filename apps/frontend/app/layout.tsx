import "../styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/context/user-context";
import { ThemeProvider } from "@/components/theme-provider";
import { EventsSocketProvider } from "@/context";
import { boogaloo, inter } from "@/styles/fonts";

export const metadata = {
  title: "Transcendence",
  description: "",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={`${boogaloo.variable} ${inter.variable} bg-primayr/10 bg-primayr/10 !mx-auto max-w-[1600px] !overflow-auto !px-0 font-sans`}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <UserProvider>
              <EventsSocketProvider>{children}</EventsSocketProvider>
            </UserProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
