import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search - VIVID",
  description: "Search for games, features, and documentation",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q || "";
  return (
    <main className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Search Results</h1>
        {query ? (
          <p className="text-vivid-textMuted">
            Searching for &quot;{query}&quot;...
          </p>
        ) : (
          <form action="/search" className="flex gap-3">
            <input
              name="q"
              type="search"
              placeholder="Search..."
              className="flex-1 bg-vivid-surface border border-vivid-border rounded-xl px-4 py-3 text-white placeholder:text-vivid-textMuted focus:outline-none focus:border-vivid-primary"
              aria-label="Search query"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-vivid-primary text-black font-semibold rounded-xl"
            >
              Search
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
