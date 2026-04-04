import React, { useState } from "react";
import { login } from "@/api/auth";
import { Eye, EyeOff, ShieldCheck, ReceiptText } from "lucide-react";

interface LoginFormProps
{
    setUser: (user: User) => void;
    onNavigateToSignUp: () => void;
}

export default function LoginForm({ setUser, onNavigateToSignUp }: LoginFormProps)
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent): Promise<void> =>
    {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try
        {
            const user = await login(username, password);
            setUser(user);
        }
        catch
        {
            setError("Invalid username or password.");
        }
        finally
        {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden
          bg-linear-to-br from-black/67 to-cyan-400/24 lg:h-screen flex items-center justify-center p-4
          px-4 py-8 sm:px-6 lg:px-8">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="absolute bottom-10 -right-15 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
            </div>

            <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
                <div className="grid w-full overflow-hidden rounded-3xl border border-white/10
                bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:grid-cols-2">

                    {/* Left content */}
                    <div className="hidden lg:flex flex-col justify-between border-r border-white/10 bg-white/3 p-10 xl:p-12">
                        <div>
                            <img
                                src="/Auth/claimr_logo.svg"
                                alt="Claimr logo"
                                className="h-12 w-auto"
                            />

                            <div className="mt-14 max-w-xl">
                                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300/80">
                                    Australian tax tracker
                                </p>

                                <h1 className="text-4xl font-bold tracking-tight text-white xl:text-5xl">
                                    Tax time, without the chaos.
                                </h1>

                                <p className="mt-5 text-base leading-8 text-slate-300">
                                    Organise receipts, track deductions, and understand your tax position
                                    in one clean dashboard built for clarity and trust.
                                </p>
                            </div>

                            <div className="mt-10 grid gap-4">
                                <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-xl bg-cyan-400/10 p-2 text-cyan-300">
                                            <ReceiptText size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">Everything in one place</h3>
                                            <p className="mt-1 text-sm leading-6 text-slate-400">
                                                Income, receipts, and deductions organised in a clear workflow.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-xl bg-emerald-400/10 p-2 text-emerald-300">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">Built for trust</h3>
                                            <p className="mt-1 text-sm leading-6 text-slate-400">
                                                Clear summaries and a polished interface that helps users feel confident.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right form */}
                    <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
                        <div className="w-full max-w-md">
                            <div className="mb-8 lg:hidden">
                                <img
                                    src="/Auth/claimr_logo.svg"
                                    alt="Claimr logo"
                                    className="h-11 w-auto"
                                />
                            </div>

                            <div className="mb-8">
                                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300/80">
                                    Welcome back
                                </p>
                                <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
                                    Sign in to Claimr
                                </h2>
                                <p className="mt-3 text-sm leading-6 text-slate-400">
                                    Access your tax dashboard, receipt tracking, and claim summaries.
                                </p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-200">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        placeholder="Enter your username"
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:bg-white/10 focus:ring-4 focus:ring-cyan-400/10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-200">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            placeholder="Enter your password"
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 pr-12 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:bg-white/10 focus:ring-4 focus:ring-cyan-400/10"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition hover:text-cyan-300"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-xl bg-cyan-400 px-4 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.25)] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {loading ? "Signing in..." : "Sign In"}
                                </button>

                                <div className="text-center text-sm text-slate-400">
                                    New to Claimr?{" "}
                                    <button
                                        type="button"
                                        onClick={onNavigateToSignUp}
                                        className="font-semibold text-cyan-300 transition hover:text-cyan-200 hover:underline"
                                    >
                                        Create account
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}