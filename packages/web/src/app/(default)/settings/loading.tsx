import { Skeleton } from "~/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <>
      <div>
        <Skeleton className="h-[20px] w-[130px] rounded-full" />
        <Skeleton className="mt-3 h-[30px] w-full rounded-full" />
        <Skeleton className="mt-2 h-[15px] w-[300px] rounded-full" />
      </div>
      <div className="mt-10">
        <Skeleton className="h-[20px] w-[130px] rounded-full" />
        <Skeleton className="mt-3 h-[30px] w-full rounded-full" />
        <Skeleton className="mt-2 h-[15px] w-[300px] rounded-full" />
      </div>
      <div className="mt-10">
        <Skeleton className="h-[20px] w-[130px] rounded-full" />
        <Skeleton className="mt-3 h-[30px] w-full rounded-full" />
        <Skeleton className="mt-2 h-[15px] w-[300px] rounded-full" />
      </div>
    </>
  );
}
