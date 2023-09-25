import Link from "next/link";
import { cn } from "~/lib/utils";
import {
  ElementType,
  ReactNode,
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
} from "react";

interface SectionEmptyBaseProps {
  className?: string;
  children: ReactNode;
  as?: ElementType;
}

type SectionEmptyProps<T extends ElementType> = SectionEmptyBaseProps &
  ComponentPropsWithoutRef<T>;

const SectionEmpty = forwardRef(
  <T extends ElementType = "section">(
    {
      className,
      children,
      as: Component = "section",
      ...props
    }: SectionEmptyProps<T>,
    ref: ForwardedRef<ElementType>
  ) => {
    const ElementType = Component === "a" ? Link : Component;

    return (
      <ElementType
        ref={ref}
        className={cn(
          className,
          "nn-border nn-detail block rounded-md border py-8 text-center"
        )}
        {...props}
      >
        {children}
      </ElementType>
    );
  }
);

SectionEmpty.displayName = "SectionEmpty";

export { SectionEmpty };
