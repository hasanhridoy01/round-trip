import LaunchResult from "./components/LaunchResult";

interface PageProps {
  searchParams: {
    type?: string;
    trip_date?: string;
    return_trip_date?: string;
    trip_from?: string;
    trip_to?: string;
  };
}

// This tells Next.js to render this page on-demand at request time
export const dynamic = "force-dynamic";

export default function Page({ searchParams }: PageProps) {
  const hasSearchParams =
    searchParams.trip_from && searchParams.trip_to && searchParams.trip_date;

  return (
    <div className="md:p-6 p-0 max-w-7xl md:pt-44 pt-96 md:pb-24 pb-24 mx-auto">
      {hasSearchParams ? (
        <LaunchResult />
      ) : (
        <p className="text-center text-gray-500 text-lg">
          Please search to view available results.
        </p>
      )}
    </div>
  );
}