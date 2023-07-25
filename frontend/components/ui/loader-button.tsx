import { FC } from "react";
import { Button } from "./button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type LoaderButtonProps = React.ComponentProps<typeof Button> & {
  isLoading?: boolean;
  iconClassName?: string;
  className?: string;
};
export const LoaderButton: FC<LoaderButtonProps> = ({
  isLoading,
  children,
  iconClassName,
  className,
  ...props
}) => {
  return (
    <Button
      className={cn(
        { "relative inline-flex items-center justify-center": isLoading },
        className
      )}
      type="submit"
      disabled={isLoading}
      {...props}
    >
      <Loader2
        className={cn(
          "absolute opacity-0",
          {
            "animate-spin opacity-100": isLoading,
          },
          iconClassName
        )}
      />
      {children}
    </Button>
  );
};
