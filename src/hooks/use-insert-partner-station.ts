"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import insertPartnerStation, { InsertPartnerStationProps, InsertPartnerStationResult } from "@/queries/insertPartnerStation";

export function useInsertPartnerStation() {
  const queryClient = useQueryClient();

  return useMutation<InsertPartnerStationResult, Error, InsertPartnerStationProps>({
    mutationFn: insertPartnerStation,
    onSuccess: (result) => {
      if (result.success && result.data) {
        // Invalidate and refetch partner stations data
        queryClient.invalidateQueries({ queryKey: ["partner_stations", "infinite"] });
      }
    },
    onError: (error) => {
      console.error('Failed to insert partner station:', error);
    },
  });
}
