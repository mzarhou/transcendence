import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function ViewCard() {
  const [switch1, setSwitch1] = useState(true);
  const [switch2, setSwitch2] = useState(false);

  const toogleSwitch1 = () => {
    setSwitch1(!switch1);
    setSwitch2(switch1 === true ? true : false);
  };

  const toogleSwitch2 = () => {
    setSwitch1(switch2 === true ? true : false);
    setSwitch2(!switch2);
  };

  return (
    <>
      <div className="mt-10 flex flex-col gap-16 rounded-md border border-border bg-card px-4 py-12 ">
        <h1 className="text-center text-2xl text-foreground">2D/3D :</h1>
        <div className="flex flex-wrap justify-center gap-10 xl:gap-40">
          <div className="space-x-2">
            <Switch id="2D" checked={switch1} onClick={toogleSwitch1} />
            <Label
              htmlFor="2D"
              className="text-center text-2xl text-foreground"
            >
              2D
            </Label>
          </div>
          <div className="space-x-2">
            <Switch id="3D" checked={switch2} onClick={toogleSwitch2} />
            <Label
              htmlFor="3D"
              className="text-center text-2xl text-foreground"
            >
              3D
            </Label>
          </div>
        </div>
      </div>
    </>
  );
}
