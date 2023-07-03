import { LayoutWrapper } from "~/components/shared";
import { Skeleton } from "~/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <>
      <Skeleton className="h-64 w-full rounded-none" />
      <LayoutWrapper className="-mt-32 flex flex-wrap items-end justify-center md:flex-nowrap md:justify-start">
        <Skeleton className="h-64 w-64 rounded-md bg-zinc-500" />
        <Skeleton className="mt-8 h-16 w-[300px] rounded-md md:ml-8" />
      </LayoutWrapper>
      <LayoutWrapper className="mt-12">
        <div className="mx-0 md:mx-8">
          <Skeleton className="mb-[1rem] h-[1rem] w-full rounded-full" />
          <Skeleton className="mb-[1rem] h-[1rem] w-full rounded-full" />
          <Skeleton className="mb-[1rem] h-[1rem] w-full rounded-full" />
        </div>
      </LayoutWrapper>
      <LayoutWrapper className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Skeleton className="h-[150px] w-full" />
        <Skeleton className="h-[150px] w-full" />
      </LayoutWrapper>
    </>
  );
}
