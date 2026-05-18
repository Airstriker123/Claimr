/*
file contains various api calls related to user login (auth)
- login
- register
- logout
- getCurrentUser
- isAuthedLocally
 */


export interface User
{
    id: number;
    username: string;
}

export async function login(username: string, password: string): Promise<null>
{
    const res: Response = await fetch(`/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
    });

// 1. RATE LIMIT FIRST
    if (res.status === 429) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Too many requests. Try again later.");
    }

// 2. AUTH FAILURE
    if (res.status === 401) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Invalid username or password!");
    }

// 3. OTHER ERRORS
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Login request denied!");
    }

    return await res.json();
}

export async function register(username: string, password: string):Promise<User>
{
    /*method to register new user in database  */
    const res:Response = await fetch(`/api/register`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(
                {
                    username,
                    password
                }),
        });


    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw {
            status: res.status,
            error: err.error
        };
    }
    return await res.json();
}


export async function getCurrentUser(): Promise<User | null>
{
    const res:Response = await fetch("/api/@me", {
        credentials: "include"
    });

    if (!res.ok) return null;

    const data: any = await res.json();
    return data.user; // matches backend fix
}


export async function logout(): Promise<void>
{
    await fetch("/api/logout", {
        method: "POST",
        credentials: "include"
    });
}