import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCamState } from "../../state";

export default function ViewCard() {
  const camState = useCamState();

  const toogle2D = () => {
    camState.set2D(true);
    camState.set3D(false);
  };

  const toogle3D = () => {
    camState.set2D(false);
    camState.set3D(true);
  };

  return (
    <>
      <div className="mt-10 flex flex-col gap-16 rounded-md border border-border bg-card px-4 py-12 ">
        <h1 className="text-center text-2xl text-foreground">2D/3D :</h1>
        <div className="flex flex-wrap justify-center gap-10 xl:gap-40">
          <div className="space-x-2">
            <Switch id="2D" checked={camState.twoD} onClick={toogle2D} />
            <Label
              htmlFor="2D"
              className="text-center text-2xl text-foreground"
            >
              2D
            </Label>
          </div>
          <div className="space-x-2">
            <Switch id="3D" checked={camState.threeD} onClick={toogle3D} />
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
