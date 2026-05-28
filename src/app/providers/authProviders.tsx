'use client';

import { api } from "@/lib/axios";
import { getMe } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import React, { useEffect, useState } from "react";

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const setAccessToken = useAuthStore((s) => s.setAccessToken);
    const setUser = useAuthStore((s) => s.setUser);
    const setHydrated = useAuthStore((s) => s.setHydrated);
    const clearAuth = useAuthStore((s) => s.clearAuth);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const bootstrap = async () => {
            try {
                const refreshRes = await api.post('/Auth/refresh-token');
                const token = refreshRes.data.data.accessToken;

                setAccessToken(token);
                
                const me = await getMe();

                setUser(me.data);
            } catch {
                clearAuth();
            } finally {
                setHydrated();
                setLoading(false);
            }
        }

        bootstrap()
    }, []);

    // if (loading) {
    //     return null;
    // };

    return children;
}