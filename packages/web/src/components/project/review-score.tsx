"use client";

import * as React from "react";
import { Rating, RatingProps, ThinRoundedStar } from "@smastrom/react-rating";
import { cn } from "~/lib/utils";

interface ReviewScoreProps extends RatingProps {
  hideHint?: boolean;
  count?: number;
}

const defaultStyles = {
  itemShapes: ThinRoundedStar,
  activeFillColor: "rgb(252 211 77)",
  inactiveFillColor: "#FFFFFF",
};

export const ReviewScore = React.forwardRef<HTMLDivElement, ReviewScoreProps>(
  ({ className, value, style, itemStyles, count, hideHint, ...props }, ref) => {
    return (
      <div className="flex items-center">
        <Rating
          className={cn(className)}
          style={{ maxWidth: 110, ...style }}
          itemStyles={{ ...defaultStyles, ...itemStyles }}
          value={value}
          {...props}
          ref={ref}
        />
        {!hideHint && <p className="ml-1 text-xs font-bold">({value}/5)</p>}
        {count && <p className="ml-1 text-xs font-bold">({count})</p>}
      </div>
    );
  }
);

ReviewScore.displayName = "ReviewScore";
