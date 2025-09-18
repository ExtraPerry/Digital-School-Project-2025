"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import generateRandomRentalHistory, { GenerateRandomRentalHistoryParams } from "@/queries/generateRandomRentalHistory";
import { GenerateRandomRentalHistoryResult } from "@/actions/generateRandomRentalHistory";

export function useGenerateRandomRentalHistory() {
  const queryClient = useQueryClient();

  return useMutation<GenerateRandomRentalHistoryResult, Error, GenerateRandomRentalHistoryParams>({
    mutationFn: generateRandomRentalHistory,
    onSuccess: () => {
      // Invalidate and refetch rental history data
      queryClient.invalidateQueries({ queryKey: ["rental_history"] });
    },
    onError: (error) => {
      console.error('Failed to generate random rental history:', error);
    },
  });
}
