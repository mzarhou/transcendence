import { ReactNode } from "react";
import Auth from "@/components/Auth";

type ProfileLayoutProps = {
  children: ReactNode;
};
export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="mb-8 mt-16 space-y-12 rounded-lg bg-background/40 p-4 py-10 md:flex md:justify-center md:space-x-12 md:space-y-0">
      <Auth>{children}</Auth>
    </div>
  );
}
