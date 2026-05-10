'use client';

import {
    QueryClient,
    QueryClientProvider as RQQueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
  
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60,
                        gcTime: 1000 * 60 * 5,
                        refetchOnWindowFocus: false,
                        retry: 1,
                    },
                },
            })
    );
    return (
        <RQQueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </RQQueryClientProvider>
    )
}