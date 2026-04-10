// src/auth/AuthContext.tsx
import React, { createContext, useEffect, useState } from "react";
import { getCurrentUser, login as apiLogin, logout as apiLogout, type User } from "../api/auth";


// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // check session on load
    useEffect(() =>
    {
        getCurrentUser().then(user => {
            setUser(user);
            setLoading(false);
        });
    }, []);

    const login = async (username: string, password: string) =>
    {
        const user = await apiLogin(username, password);
        setUser(user);
    };

    const logout = async () => {
        await apiLogout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}