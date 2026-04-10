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

export async function login(username: string, password: string): Promise<User>
{
    /* function to login user */
    const res:Response = await fetch(`/api/login`, //api endpoint fetch method
        {
            // check if input username and password is valid
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(
                {
                    username,
                    password
                }),
        });

    if (!res.ok)  // if not ok notify invalid user/password
    {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Invalid username or password");
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