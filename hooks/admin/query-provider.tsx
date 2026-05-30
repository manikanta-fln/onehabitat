"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { ReactNode } from "react";
import { adminToast, getAdminErrorMessage } from "@/lib/admin/toast";

export function createAdminQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        adminToast.error(getAdminErrorMessage(error));
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        adminToast.error(getAdminErrorMessage(error));
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}

export function AdminQueryProvider({
  children,
  client,
}: {
  children: ReactNode;
  client: QueryClient;
}) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

export { useQuery, useMutation, useQueryClient, type UseQueryOptions };
