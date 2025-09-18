"use client"

import createSupabaseBrowserClient from "@/lib/supabase/createSupabaseBrowserClient";
import { Database } from "@/types/supabase/database.types";

type PartnerStation = Database["public"]["Tables"]["partner_station"]["Row"];

export type FetchPartnerStationsParams = {
  userId: string;
  page?: number;
  limit?: number;
};

export type FetchPartnerStationsResponse = {
  data: PartnerStation[];
  hasMore: boolean;
  totalCount: number;
};

export default async function fetchPartnerStations({
  userId,
  page = 0,
  limit = 10,
}: FetchPartnerStationsParams): Promise<FetchPartnerStationsResponse> {
  const supabase = createSupabaseBrowserClient();

  // First, get the total count for pagination
  const { count: totalCount, error: countError } = await supabase
    .from("partner_station")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (countError) {
    throw new Error(`Failed to fetch partner stations count: ${countError.message}`);
  }

  // Then fetch the actual data with pagination
  const from = page * limit;
  const to = from + limit - 1;

  const { data: partnerStations, error: partnerStationsError } = await supabase
    .from("partner_station")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (partnerStationsError) {
    throw new Error(`Failed to fetch partner stations: ${partnerStationsError.message}`);
  }

  const hasMore = totalCount ? from + limit < totalCount : false;

  return {
    data: partnerStations || [],
    hasMore,
    totalCount: totalCount || 0,
  };
}
