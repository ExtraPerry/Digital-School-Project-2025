"use client"

import createSupabaseBrowserClient from "@/lib/supabase/createSupabaseBrowserClient";
import { Database } from "@/types/supabase/database.types";

type RentalHistory = Database["public"]["Tables"]["rental_history"]["Row"];

export type FetchRentalHistoryParams = {
  userId: string;
  page?: number;
  limit?: number;
};

export type FetchRentalHistoryResponse = {
  data: RentalHistory[];
  hasMore: boolean;
  totalCount: number;
};

export default async function fetchRentalHistory({
  userId,
  page = 0,
  limit = 10,
}: FetchRentalHistoryParams): Promise<FetchRentalHistoryResponse> {
  const supabase = createSupabaseBrowserClient();

  // First, get the total count for pagination
  const { count: totalCount, error: countError } = await supabase
    .from("rental_history")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (countError) {
    throw new Error(`Failed to fetch rental history count: ${countError.message}`);
  }

  // Then fetch the actual data with pagination
  const from = page * limit;
  const to = from + limit - 1;

  const { data: rentalHistory, error: rentalHistoryError } = await supabase
    .from("rental_history")
    .select(`
      *,
      scooter:scooter_id (
        id,
        reference_number,
        model
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (rentalHistoryError) {
    throw new Error(`Failed to fetch rental history: ${rentalHistoryError.message}`);
  }

  const hasMore = totalCount ? from + limit < totalCount : false;

  return {
    data: rentalHistory || [],
    hasMore,
    totalCount: totalCount || 0,
  };
}
