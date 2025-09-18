"use client"

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import fetchRentalHistory from "@/queries/fetchRentalHistory";
import createSupabaseBrowserClient from "@/lib/supabase/createSupabaseBrowserClient";

type UseRentalHistoryInfiniteParams = {
  userId: string;
  limit?: number;
  enabled?: boolean;
};

export function useRentalHistoryInfinite({
  userId,
  limit = 10,
  enabled = true,
}: UseRentalHistoryInfiniteParams) {
  const queryClient = useQueryClient();
  const supabase = createSupabaseBrowserClient();

  const queryResult = useInfiniteQuery({
    queryKey: ["rental_history", "infinite", userId, limit],
    queryFn: ({ pageParam = 0 }) =>
      fetchRentalHistory({
        userId,
        page: pageParam,
        limit,
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length : undefined;
    },
    initialPageParam: 0,
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Invalidate queries when auth state changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({ 
        queryKey: ["rental_history", "infinite"] 
      });
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, queryClient]);

  // Flatten the paginated data for easier consumption
  const flatData = queryResult.data?.pages.flatMap(page => page.data) || [];
  
  // Get total count from the first page
  const totalCount = queryResult.data?.pages[0]?.totalCount || 0;

  return {
    ...queryResult,
    data: flatData,
    totalCount,
    hasNextPage: queryResult.hasNextPage,
    fetchNextPage: queryResult.fetchNextPage,
    isFetchingNextPage: queryResult.isFetchingNextPage,
  };
}
