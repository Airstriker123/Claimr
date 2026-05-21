// src/auth/AuthContext.tsx
import React, { createContext, useEffect, useState } from "react";
import { getCurrentUser, login as apiLogin, logout as apiLogout, type User } from "../api/auth";


// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // mask api authenticstion in a auth class (utility)
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
        // login trigger
        const user = await apiLogin(username, password);
        setUser(user);
    };


    const logout = async () =>
    {
        // logout trigger
        await apiLogout();
        setUser(null);
    };

    // component to be mounted in app
    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
        {children}
        </AuthContext.Provider>
    );
}