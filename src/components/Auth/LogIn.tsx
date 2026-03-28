import React, { useState } from "react";
import {login} from "@/api/auth";

interface LoginFormProps
{
    setUser: (user: User) => void;
    onNavigateToSignUp: () => void;
}

export default function LoginForm({ setUser, onNavigateToSignUp }: LoginFormProps)
{
    /*
    component for the login form
    - uses tailwind for styling
    - uses useState for state management
    - uses useEffect for side effects
    - handles look of the login form
    - stores the login form component
     */
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // login handle backend (api call)
    const handleLogin: (e: React.FormEvent) => Promise<void> = async (e: React.FormEvent) : Promise<void> =>
    {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try
        {
            const user = await login(username, password); //try get login api response (api call)
            setUser(user);
        }
        catch (err: never)
        {
            // fail = user not found in database
            setError("invalid username/password");
        }
        finally
        {
            setLoading(false);
        }
    };

    // login form component look typescript xml
    return (
        <>
            {/*page background and style */}
            <div className="bg-linear-to-br from-black/67 to-cyan-400/24 lg:h-screen flex items-center justify-center p-4">
                <div className="border-cyan-400 border-[3px] max-w-6xl bg-white/8 shadow-xl p-6 rounded-md">
                    <div className="grid md:grid-cols-2 items-center gap-y-8">
                        {/* login form */}
                        <form className="max-w-md mx-auto w-full" onSubmit={handleLogin}>
                            <div className="mb-8">
                                {/* logo */}
                                <img
                                    src="/logo.png"
                                    alt="Claimr logo"
                                    className="w-40"
                                />
                            </div>

                            {/* username input */}
                            <label className="text-cyan-400 text-sm font-medium mb-2 block">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="Enter username"
                                className="border-cyan-400 border-[1px] w-full text-sm text-slate-900 bg-slate-100 pl-4 pr-10 py-3 rounded-md mb-4"
                            />

                            {/* password input */}
                            <label className="text-cyan-400 text-sm font-medium mb-2 block">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter password"
                                className="border-cyan-400 border-[1px] w-full text-sm text-slate-900 bg-slate-100 pl-4 pr-10 py-3 rounded-md"
                            />

                            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

                            {/* login button to submit to api*/}
                            <button
                                type="submit"
                                disabled={loading}
                                className="border-cyan-400 border-[3px] w-full shadow-xl mt-6 py-2 text-[15px] font-medium rounded-md text-white bg-cyan-400 hover:bg-cyan-700"
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>

                            {/* login button to navigate to sign up */}
                            <p className="text-cyan-400 text-sm mt-4 text-center">
                                Don’t have an account?{" "}
                                <button
                                    type="button"
                                    onClick={onNavigateToSignUp}
                                    className="underline hover:text-cyan-300"
                                >
                                    Sign up
                                </button>
                            </p>
                        </form>

                        {/* login image  to side*/}
                        <div className="w-full h-full">
                            <div className="aspect-square bg-gray-50 relative before:absolute before:inset-0 before:bg-black/40 rounded-md overflow-hidden w-full h-full border-cyan-400 border-[2px]">
                                <img
                                    src="/login.jpg"
                                    className="w-full h-full object-cover"
                                    alt="login img"
                                />

                                {/* login image text */}
                                <div className="drop-shadow-[black_1px_1px_1px] absolute inset-0 m-auto max-w-sm p-6 flex items-center justify-center">
                                    <div>
                                        <h1 className="text-white text-4xl font-semibold">
                                            <b>Sign in</b>
                                        </h1>
                                        <p className="text-white

text-[15px] font-medium mt-6 leading-relaxed">
                                            <b>Sign in to your account to proceed</b>
                                            <br />
                                            <br />
                                            Claimr is a tax return tracker built for
                                            transparency and trust. It helps Australians organise income, deductions, and receipts
                                            in one simple interface, with clear summaries that make tax time easier. Because the entire
                                            codebase is public, users can verify exactly how their data is handled and rely on a tool
                                            that’s secure, transparent, and community‑driven.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}