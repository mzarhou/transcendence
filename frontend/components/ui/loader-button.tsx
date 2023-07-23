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
        "group disabled:relative disabled:inline-flex disabled:items-center disabled:justify-center",
        className
      )}
      type="submit"
      disabled={isLoading}
      {...props}
    >
      <Loader2
        className={cn(
          "absolute opacity-0 group-disabled:animate-spin group-disabled:opacity-100",
          iconClassName
        )}
      />
      {children}
    </Button>
  );
};
