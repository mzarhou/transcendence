import { BarChart3, Settings, SlidersHorizontal } from "lucide-react";
import { ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import Auth from "@/components/Auth";
import { cn } from "@/lib/utils";

type ProfileLayoutProps = {
  children: ReactNode;
};
export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="mt-4 space-y-12 md:flex md:space-x-12 md:space-y-0">
      <Auth>
        <ProfileSideBar />
        {children}
      </Auth>
    </div>
  );
}

function ProfileSideBar() {
  return (
    <div className="w-full max-w-[200px]">
      <ul>
        <li>
          <ProfileSideBarItem text="general" selected>
            <SlidersHorizontal />
          </ProfileSideBarItem>
          <ProfileSideBarItem text="Match History">
            <BarChart3 />
          </ProfileSideBarItem>
          <ProfileSideBarItem text="Chat Settings">
            <Settings />
          </ProfileSideBarItem>
        </li>
      </ul>
    </div>
  );
}

type ProfileSideBarItemProps = {
  text: string;
  children: ReactNode;
  selected?: boolean;
};
function ProfileSideBarItem({
  text,
  children,
  selected,
}: ProfileSideBarItemProps) {
  return (
    <div
      className={cn(
        "mb-2 flex cursor-pointer items-center space-x-4 rounded-md px-3 py-2 hover:bg-gray-100 hover:text-black",
        {
          "text-gray-300": !selected,
        }
      )}
    >
      <Slot className="icon-container icon-md">{children}</Slot>
      <span className="text-base">{text}</span>
    </div>
  );
}
