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
        {
          "relative overflow-hidden": isLoading,
        },
        className
      )}
      type="submit"
      disabled={isLoading}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2
            className={cn(
              {
                "animate-spin": isLoading,
              },
              iconClassName
            )}
          />
        </div>
      )}
      {children}
    </Button>
  );
};
