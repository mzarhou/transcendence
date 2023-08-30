import Image from 'next/image'
import { Button } from "@/components/ui/button";
import profile_dark from "public/images/profile-dark.png";
import settings_dark from "public/images/settings-dark.png";
import profile from "public/images/profile.png";
import settings from "public/images/settings.png";
import { useTheme } from "next-themes";

export default function ProfileSettings() {
  const { theme } = useTheme();

  if (!theme) {
    return <></>;
  }

  return (
    <>
      <div className="xl:mr-5 mt-10 flex flex-col">
        <Button className="group flex h-[80px] w-[80px] flex-col bg-transparent hover:border-2 hover:border-border hover:bg-transparent">
          <Image
            src={theme === "dark" ? profile_dark : profile}
            alt="profile-dark button"
            title="profile-dark"
            width="40"
            height="40"
          />
          <span className="text-md group invisible text-foreground group-hover:visible">
            Profile
          </span>
        </Button>
        <Button className="group mt-2 flex h-[80px] w-[80px] flex-col bg-transparent hover:border-2 hover:border-border hover:bg-transparent">
          <Image
            src={theme === "dark" ? settings_dark : settings}
            alt="settings-dark button"
            title="settings-dark"
            width="40"
            height="40"
            className="mt-4"
          />
          <span className="text-md group invisible mb-5 text-foreground group-hover:visible">
            Game
            <br />
            Settings
          </span>
        </Button>
      </div>
    </>
  )
}