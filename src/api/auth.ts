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
        const err:any = await res.json().catch(() => ({}));
        throw new Error(err.error || "Invalid username or password");
    }
    // if ok, store user data in local storage
    const data:any = await res.json();
    // add  token to local storage (only way I could be bothered with account creation i don't care if it not secure not important for this project
    localStorage.setItem("auth", JSON.stringify(
        {
            id: data.id,
            username: data.username
        }));
    return data;
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

    if (!res.ok) // if not ok notify registration failed (username taken)
    {
        const err:any = await res.json().catch(() => ({}));
        throw new Error(err.error || "Registration failed");
    }
    // otherwise do same logic as login process
    const data:any = await res.json();
    localStorage.setItem("auth", JSON.stringify(
        {
            id: data.id,
            username: data.username
        }));
    return data;
}