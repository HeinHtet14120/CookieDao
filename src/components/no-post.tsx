"use client";

import { SearchX } from "lucide-react";

export function NoPosts() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <SearchX className="h-16 w-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-200 mb-2">No Posts Found</h3>
      <p className="text-gray-400 max-w-sm">
            We couldn&apos;t find any posts matching your search criteria. Try adjusting your search terms or date range.
      </p>
    </div>
  );
}