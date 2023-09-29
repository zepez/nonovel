import type { Pencil1Icon } from "@radix-ui/react-icons";
import type { FiThumbsUp } from "react-icons/fi";

import { cn } from "~/lib";
import { Button } from "~/components/ui/button";

interface CommentNavButtonProps {
  onClick?: () => void;
  className?: string;
  size?: number;
  Icon: typeof Pencil1Icon | typeof FiThumbsUp;
  disabled?: boolean;
  showTitle?: boolean;
  title: string;
}

export const CommentNavButton = ({
  onClick,
  className,
  Icon,
  size = 16,
  disabled = false,
  showTitle = false,
  title,
}: CommentNavButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="fluid"
      onClick={onClick}
      disabled={disabled}
      className={cn("px-2", className)}
      title={title}
    >
      <Icon width={size} height={size} />
      {showTitle && <span className="nn-detail ml-2 font-normal">{title}</span>}
    </Button>
  );
};
