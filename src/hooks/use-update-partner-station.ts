"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import updatePartnerStation, { UpdatePartnerStationProps, UpdatePartnerStationResult } from "@/queries/updatePartnerStation";

export function useUpdatePartnerStation() {
  const queryClient = useQueryClient();

  return useMutation<UpdatePartnerStationResult, Error, UpdatePartnerStationProps>({
    mutationFn: updatePartnerStation,
    onSuccess: (result) => {
      if (result.success) {
        // Invalidate and refetch partner stations data
        queryClient.invalidateQueries({ queryKey: ["partner_stations", "infinite"] });
      }
    },
    onError: (error) => {
      console.error('Failed to update partner station:', error);
    },
  });
}
