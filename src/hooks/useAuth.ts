import { useContext } from "react";
import { AuthContext } from "@/auth/AuthContext";

//simple react hook for auth to simplify auth process
export default function useAuth()
{
    return useContext(AuthContext);
}