import { LayoutWrapper } from "~/components/shared";
import { Skeleton } from "~/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <>
      <Skeleton className="h-64 w-full rounded-none" />
      <LayoutWrapper className="-mt-32 flex flex-wrap items-end">
        <Skeleton className="h-64 w-64 rounded-md bg-zinc-500" />
        <Skeleton className="ml-8 h-16 w-[300px] rounded-full" />
      </LayoutWrapper>
      <LayoutWrapper className="mt-12">
        <Skeleton className="mb-[1rem] h-[1rem] w-full rounded-full" />
        <Skeleton className="mb-[1rem] h-[1rem] w-full rounded-full" />
        <Skeleton className="mb-[1rem] h-[1rem] w-full rounded-full" />
      </LayoutWrapper>
      <LayoutWrapper className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Skeleton className="h-[150px] w-full" />
        <Skeleton className="h-[150px] w-full" />
      </LayoutWrapper>
    </>
  );
}
