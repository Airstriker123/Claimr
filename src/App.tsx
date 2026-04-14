import './styles/App.css'
import Landing from "./components/Landing/Landing.tsx"
import Login from "@/components/AuthForms/LogIn"
import Signup from "@/components/AuthForms/SignUp"
import {useState, useEffect} from "react";
import {Toaster} from "sonner";
import { ThemeProvider } from 'next-themes';
import { Dashboard } from '@/components/App/DashBoard';
import {pingServer} from "@/api/status";
import { useNavigate , Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/auth/ProtectedRoute";

function RedirectHandler() {
    const navigate = useNavigate();

    useEffect(() => {
        const redirect = sessionStorage.getItem("redirect");

        if (redirect) {
            sessionStorage.removeItem("redirect");
            navigate(redirect, { replace: true });
        }
    }, [navigate]);

    return null;
}

export default function App(): JSX.Element
{
    const [serverStatus, setServerStatus] = useState("checking");
    const navigate = useNavigate();
    const redirect = sessionStorage.getItem("redirect");

    if (redirect)
    {
        sessionStorage.removeItem("redirect");
        navigate(redirect);
    }

    useEffect(() =>
    {
         pingServer().then((isUp) =>
         {
            setServerStatus(isUp ? "Server: online" : "Server: offline");
            console.log(serverStatus);
        });
    },[serverStatus]);


    return(
                <main className="min-h-screen text-white overflow-x-hidden smooth-scroll
                    bg-cover bg-center bg-no-repeat relative z-20 transform-gp">
                    <RedirectHandler />
                    <Routes>
                            {/* public routes */}
                            <Route path="/" element={
                                <Landing
                                    onNavigateToLogin={() => navigate("/login")}
                                    onNavigateToSignUp={() => navigate("/signup")}
                                />
                            } />
                            <Route path="/login" element={
                                <div>
                                    <Login
                                        onNavigateToSignUp={() => navigate("/signup")}
                                    />
                                    {/* Toast Notifications */}
                                    <Toaster
                                        theme="dark"
                                        position="bottom-right"
                                        toastOptions={{
                                            style: {
                                                background: '#1f2937',
                                                border: '1px solid #374151',
                                                color: '#f9fafb',
                                            },
                                        }}
                                    />
                                </div>
                            } />
                            <Route path="/signup" element={
                                <>
                                    <Signup
                                        onNavigateToLogin={() => navigate("/login")}
                                    />
                                    {/* Toast Notifications */}
                                    <Toaster
                                        theme="dark"
                                        position="bottom-right"
                                        toastOptions={{
                                            style: {
                                                background: '#151414',
                                                border: `1px solid ${'#560000'}`,
                                                color: '#ff0000',
                                            },
                                        }}
                                    />
                                </>
                            } />

                            {/* protected route */}
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                                            <Dashboard

                                            />
                                        </ThemeProvider>
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                </main>
    )
}