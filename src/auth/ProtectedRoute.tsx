import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

export default function ProtectedRoute({ children }: any)
{
    // method to identify  react path component as protected (requires authentication)
    const { user, loading } = useAuth();

    // checkers
    if (loading)
    {
        return <p>Loading...</p>; // or spinner
    }

    // if no user login
    if (!user)
    {
        return <Navigate to="/login" />;
    }

    return children;
}