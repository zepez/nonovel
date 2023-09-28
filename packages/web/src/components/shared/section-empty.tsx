import Link from "next/link";
import {
  ElementType,
  ReactNode,
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
} from "react";
import { cn } from "~/lib";

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
          "nn-detail block rounded-md px-6 py-8 text-center"
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
