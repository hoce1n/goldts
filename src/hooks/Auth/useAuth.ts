import { useAuthStore } from "@/stores/auth.store"
import { Role } from "@/types/auth.types";

export const useAuth = () => {
    const user = useAuthStore((s) => s.user);

    const isAuthenticated = !!user;

    const isAdmin = user?.role === Role.Admin;
    const isManager = user?.role === Role.Manager || Role.Admin;

    const hasRole = (role: Role) => user?.role === role;

    return { 
        user, 
        isAuthenticated, 
        isAdmin, 
        isManager, 
        hasRole 
    };
}