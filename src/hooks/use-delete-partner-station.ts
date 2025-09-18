"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import deletePartnerStation, { DeletePartnerStationProps, DeletePartnerStationResult } from "@/queries/deletePartnerStation";

export function useDeletePartnerStation() {
  const queryClient = useQueryClient();

  return useMutation<DeletePartnerStationResult, Error, DeletePartnerStationProps>({
    mutationFn: deletePartnerStation,
    onSuccess: (result) => {
      if (result.success) {
        // Invalidate and refetch partner stations data
        queryClient.invalidateQueries({ queryKey: ["partner_stations", "infinite"] });
      }
    },
    onError: (error) => {
      console.error('Failed to delete partner station:', error);
    },
  });
}
