"use server";

import createSupabaseServerAdmin from "@/lib/supabase/createSupabaseServerAdmin";

export type DeletePartnerStationProps = {
  stationId: string;
  user_id: string; // For authorization check
};

export type DeletePartnerStationResult = {
  success: boolean;
  error?: string;
};

export default async function deletePartnerStation(
  deleteData: DeletePartnerStationProps
): Promise<DeletePartnerStationResult> {
  const supabase = await createSupabaseServerAdmin();

  const { stationId, user_id } = deleteData;

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
      error: 'You are not authorized to delete this station',
    };
  }

  const { error: deleteError } = await supabase
    .from("partner_station")
    .delete()
    .eq("id", stationId)
    .eq("user_id", user_id); // Double check ownership

  if (deleteError) {
    return {
      success: false,
      error: `Failed to delete partner station: ${deleteError.message}`,
    };
  }

  return {
    success: true,
  };
}
