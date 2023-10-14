import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/context/user-context";
import { ThemeProvider } from "@/components/theme-provider";
import { EventsSocketProvider } from "@/context/events-socket-context";

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
        <body>
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
