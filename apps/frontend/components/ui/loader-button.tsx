import { FC } from "react";
import { Button } from "./button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type LoaderButtonProps = React.ComponentProps<typeof Button> & {
  isLoading?: boolean;
  iconClassName?: string;
};
export const LoaderButton: FC<LoaderButtonProps> = ({
  isLoading,
  children,
  iconClassName,
  ...props
}) => {
  return (
    <Button type="submit" {...props}>
      {isLoading ? (
        <Loader2 className={cn("animate-spin", iconClassName)} />
      ) : (
        children
      )}
    </Button>
  );
};
