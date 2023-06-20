import { SVGProps } from "react";

declare module "lucide-react" {
  // Create interface extending SVGProps
  export interface LucideProps extends Partial<SVGProps<SVGSVGElement>> {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
    // className?: string;
  }
}
