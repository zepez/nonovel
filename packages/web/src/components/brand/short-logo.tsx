import { cn } from "~/lib/utils";

export const ShortLogo = ({ className }: { className: string }) => {
  return (
    <>
      <ShortLogoDark className={cn(className, "block dark:hidden")} />
      <ShortLogoLight className={cn(className, "hidden dark:block")} />
    </>
  );
};

export const ShortLogoDark = ({ className }: { className: string }) => {
  return (
    <svg
      version="1.2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 225 225"
      width="50"
      height="50"
      className={className}
    >
      <path
        id="Layer"
        fill="#382418"
        className="s0"
        d="m218.3 100.4c-3.5-26.6-10.5-25.6-10.5-25.6l-86.1 28.9 39.4-85c0 0 1.8-6.2-23.1-13.2-25.8-7.3-27.7-0.5-27.7-0.5l-9.3 92.5-58.9-69.4c0 0-5.4-4.4-22.3 16.4-16.3 20.1-11.3 24.2-11.3 24.2l82.1 46.1-84.1 37.3c0 0-5.8 4 9.5 26 14.8 21.2 20.1 17.5 20.1 17.5l66.9-66 22.4 91.2c0 0 2.6 5.9 26.3-4.5 24.5-10.8 21.7-17.3 21.7-17.3l-52.2-75.6 94.2 3.5c0 0 6.4-0.9 2.9-26.5z"
      />
    </svg>
  );
};

export const ShortLogoLight = ({ className }: { className: string }) => {
  return (
    <svg
      version="1.2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 225 225"
      width="50"
      height="50"
      className={className}
    >
      <path
        id="Layer"
        fill="#de970b"
        className="s0"
        d="m218.3 100.4c-3.5-26.6-10.5-25.6-10.5-25.6l-86.1 28.9 39.4-85c0 0 1.8-6.2-23.1-13.2-25.8-7.3-27.7-0.5-27.7-0.5l-9.3 92.5-58.9-69.4c0 0-5.4-4.4-22.3 16.4-16.3 20.1-11.3 24.2-11.3 24.2l82.1 46.1-84.1 37.3c0 0-5.8 4 9.5 26 14.8 21.2 20.1 17.5 20.1 17.5l66.9-66 22.4 91.2c0 0 2.6 5.9 26.3-4.5 24.5-10.8 21.7-17.3 21.7-17.3l-52.2-75.6 94.2 3.5c0 0 6.4-0.9 2.9-26.5z"
      />
    </svg>
  );
};
