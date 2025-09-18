"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import updateUser, { UpdateUserProps, UpdateUserResult } from "@/queries/updateUser";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<UpdateUserResult, Error, UpdateUserProps>({
    mutationFn: updateUser,
    onSuccess: () => {
      // Invalidate and refetch the authenticated user data
      queryClient.invalidateQueries({ queryKey: ["users", "id -> authenticated"] });
    },
    onError: (error) => {
      console.error('Failed to update user:', error);
    },
  });
}
