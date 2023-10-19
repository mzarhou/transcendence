import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCamState } from "../../state";
import { useEffect } from "react";

export default function ViewCard() {
  const camState = useCamState();
  useEffect(() => {
    let bool = localStorage.getItem("cam");
    if (bool == "true") camState.set3D2D(true);
    else camState.set3D2D(false);
  },[]);

  const toogle3D2D = () => {
    console.log(camState.t3D2D);
    camState.set3D2D(!camState.t3D2D);
  };
  return (
    <>
      <div className="mt-10 flex flex-col gap-16 rounded-md border border-border bg-card px-4 py-12 ">
        <h1 className="text-center text-2xl text-foreground">2D/3D :</h1>
        <div className="flex flex-wrap justify-center gap-10 xl:gap-40">
          <div className="space-x-2">
            <Label
              htmlFor="3D"
              className="text-center text-2xl text-foreground"
            >
              3D
            </Label>
            <Switch id="2D" checked={camState.t3D2D} onClick={toogle3D2D} />
            <Label
              htmlFor="2D"
              className="text-center text-2xl text-foreground"
            >
              2D
            </Label>
          </div>
        </div>
      </div>
    </>
  );
}
