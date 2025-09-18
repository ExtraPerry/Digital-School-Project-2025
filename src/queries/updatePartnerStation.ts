"use server";

import createSupabaseServerAdmin from "@/lib/supabase/createSupabaseServerAdmin";
import { Database } from "@/types/supabase/database.types";

type PartnerStationUpdate = Database["public"]["Tables"]["partner_station"]["Update"];

export type UpdatePartnerStationProps = {
  stationId: string;
  name?: string;
  address?: string;
  max_slots?: number;
  filled_slots?: number;
  is_open?: boolean;
  user_id: string; // For authorization check
};

export type UpdatePartnerStationResult = {
  success: boolean;
  error?: string;
  data?: Database["public"]["Tables"]["partner_station"]["Row"];
};

export default async function updatePartnerStation(
  updateData: UpdatePartnerStationProps
): Promise<UpdatePartnerStationResult> {
  const supabase = await createSupabaseServerAdmin();

  const { stationId, user_id, ...stationData } = updateData;

  if (!stationId) {
    return {
      success: false,
      error: 'Station ID is required',
    };
  }

  if (!user_id) {
    return {
      success: false,
      error: 'User ID is required',
    };
  }

  const stationUpdate: PartnerStationUpdate = {
    name: stationData.name,
    address: stationData.address,
    max_slots: stationData.max_slots,
    filled_slots: stationData.filled_slots,
    is_open: stationData.is_open,
  };

  // First check if the station belongs to the user
  const { data: existingStation, error: checkError } = await supabase
    .from("partner_station")
    .select("user_id")
    .eq("id", stationId)
    .single();

  if (checkError) {
    return {
      success: false,
      error: `Failed to verify station ownership: ${checkError.message}`,
    };
  }

  if (existingStation.user_id !== user_id) {
    return {
      success: false,
      error: 'You are not authorized to update this station',
    };
  }

  const { data: updatedStation, error: updateError } = await supabase
    .from("partner_station")
    .update(stationUpdate)
    .eq("id", stationId)
    .eq("user_id", user_id) // Double check ownership
    .select()
    .single();

  if (updateError) {
    return {
      success: false,
      error: `Failed to update partner station: ${updateError.message}`,
    };
  }

  return {
    success: true,
    data: updatedStation,
  };
}
