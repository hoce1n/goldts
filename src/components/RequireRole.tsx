import { useAuth } from "@/hooks/Auth/useAuth";
import { Role } from "@/types/auth.types"

type Props = {
    role: Role;
    children: React.ReactNode;
};

export const RequireRole = ({role, children }: Props) => {
    const { hasRole } = useAuth();

    if (!hasRole(role)) return null

    return <>{children}</>;
}