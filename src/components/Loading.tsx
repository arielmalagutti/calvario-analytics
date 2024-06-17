import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

type LoadingProps = {
  iconClasses?: React.ComponentProps<"p">["className"];
};

type LoadingIconProps = {
  className?: React.ComponentProps<"p">["className"];
};

export function Loading({ iconClasses, ...rest }: LoadingProps) {
  return (
    <div
      {...rest}
      className={cn("w-full h-full flex items-center justify-center")}
    >
      <LoadingIcon className={iconClasses} />
    </div>
  );
}

function LoadingIcon({ className, ...rest }: LoadingIconProps) {
  return (
    <LoaderCircle
      {...rest}
      className={cn("w-14 h-14 text-gray-600 animate-spin", className)}
    />
  );
}
