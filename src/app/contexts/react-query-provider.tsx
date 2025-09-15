"use client"

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type ReactQueryClientProviderProps = {
  children?: ReactNode;
};

export function ReactQueryClientProvider({
  children,
}: ReactQueryClientProviderProps) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
