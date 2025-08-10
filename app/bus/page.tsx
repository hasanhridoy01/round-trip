import BusResult from "./components/BusResult";

interface PageProps {
  searchParams: {
    type?: string;
    trip_date?: string;
    return_trip_date?: string;
    trip_from?: string;
    trip_to?: string;
  };
}

export const dynamic = 'force-dynamic'

// Solution 2: Alternative - disable static generation
// export const revalidate = 0;

export default function Page({ searchParams }: PageProps) {
  const hasSearchParams =
    searchParams.trip_from && searchParams.trip_to && searchParams.trip_date;

  return (
    <div className="p-6 max-w-7xl md:pt-44 md:pb-24 mx-auto">
      {hasSearchParams ? (
        <BusResult />
      ) : (
        <p className="text-center text-gray-500 text-lg">
          Please search to view available results.
        </p>
      )}
    </div>
  );
}