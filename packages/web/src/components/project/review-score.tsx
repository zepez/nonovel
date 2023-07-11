"use client";

import * as React from "react";
import { Rating, RatingProps, ThinRoundedStar } from "@smastrom/react-rating";
import { cn } from "~/lib/utils";

const defaultStyles = {
  itemShapes: ThinRoundedStar,
  activeFillColor: "rgb(252 211 77)",
  inactiveFillColor: "#FFFFFF",
};

export const ReviewScore = React.forwardRef<HTMLDivElement, RatingProps>(
  ({ className, value, style, itemStyles, ...props }, ref) => {
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
        <p className="mt-3 text-xs font-bold sm:mt-4">({value}/5)</p>
      </div>
    );
  }
);

ReviewScore.displayName = "ReviewScore";
