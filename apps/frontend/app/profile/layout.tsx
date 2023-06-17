import { BarChart3, Settings, SlidersHorizontal } from "lucide-react";
import { ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import Auth from "@/components/Auth";

type ProfileLayoutProps = {
  children: ReactNode;
};
export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="flex mt-4 md:space-x-12">
      <Auth>
        <ProfileSideBar />
        {children}
      </Auth>
    </div>
  );
}

function ProfileSideBar() {
  return (
    <div className="w-full max-w-[200px] sticky top-28">
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
export function ProfileSideBarItem({
  text,
  children,
  selected,
}: ProfileSideBarItemProps) {
  return (
    <div
      className={`space-x-4 flex items-center mb-2 py-2 rounded-md hover:bg-gray-100 px-3 cursor-pointer ${
        !selected && "text-gray-300"
      }`}
    >
      <Slot className="icon-container icon-md">{children}</Slot>
      <span className="text-base">{text}</span>
    </div>
  );
}
