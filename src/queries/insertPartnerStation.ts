"use server";

import createSupabaseServerAdmin from "@/lib/supabase/createSupabaseServerAdmin";
import { Database } from "@/types/supabase/database.types";

type PartnerStationInsert = Database["public"]["Tables"]["partner_station"]["Insert"];

export type InsertPartnerStationProps = {
  name: string;
  address: string;
  max_slots: number;
  filled_slots: number;
  is_open?: boolean;
  user_id: string;
};

export type InsertPartnerStationResult = {
  success: boolean;
  error?: string;
  data?: Database["public"]["Tables"]["partner_station"]["Row"];
};

export default async function insertPartnerStation(
  insertData: InsertPartnerStationProps
): Promise<InsertPartnerStationResult> {
  const supabase = await createSupabaseServerAdmin();

  if (!insertData.user_id) {
    return {
      success: false,
      error: 'User ID is required',
    };
  }

  const partnerStationData: PartnerStationInsert = {
    name: insertData.name,
    address: insertData.address,
    max_slots: insertData.max_slots,
    filled_slots: insertData.filled_slots,
    is_open: insertData.is_open ?? true,
    user_id: insertData.user_id,
  };

  const { data: partnerStation, error: insertError } = await supabase
    .from("partner_station")
    .insert(partnerStationData)
    .select()
    .single();

  if (insertError) {
    return {
      success: false,
      error: `Failed to create partner station: ${insertError.message}`,
    };
  }

  return {
    success: true,
    data: partnerStation,
  };
}
