import { Button } from "@/components/ui/button";
import { ToggleLeft } from "lucide-react";
import { ToggleRight } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function BotCard() {
  const [switch1, setSwitch1] = useState(true);
  const [switch2, setSwitch2] = useState(false);
  const [switch3, setSwitch3] = useState(false);

  const toogleSwitch1 = () => {
    setSwitch1(true);
    setSwitch2(false);
    setSwitch3(false);
  };

  const toogleSwitch2 = () => {
    setSwitch1(false);
    setSwitch2(true);
    setSwitch3(false);
  };

  const toogleSwitch3 = () => {
    setSwitch1(false);
    setSwitch2(false);
    setSwitch3(true);
  };

  return (
    <>
      <div className="mt-10 flex flex-col gap-16 rounded-md border border-border bg-card py-12 ">
        <h1 className="text-center text-2xl text-foreground">BOT LEVEL :</h1>
        <div className="flex flex-wrap justify-center gap-10">
          <div className="space-x-2">
            <Switch id="easy" checked={switch1} onClick={toogleSwitch1} />
            <Label
              htmlFor="easy"
              className="text-center text-2xl text-foreground"
            >
              EASY
            </Label>
          </div>
          <div className="space-x-2">
            <Switch id="medium" checked={switch2} onClick={toogleSwitch2} />
            <Label
              htmlFor="medium"
              className="text-center text-2xl text-foreground"
            >
              MEDIUM
            </Label>
          </div>
          <div className="space-x-2">
            <Switch id="hard" checked={switch3} onClick={toogleSwitch3} />
            <Label
              htmlFor="hard"
              className="text-center text-2xl text-foreground"
            >
              HARD
            </Label>
          </div>
        </div>
      </div>
    </>
  );
}
