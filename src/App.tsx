import './App.css'
import Landing from "./components/Landing/Landing.tsx"
import Login from "@/components/Auth/LogIn"
import Signup from "@/components/Auth/SignUp"
import {useState} from "react";
import {toast, Toaster} from "sonner";

export default function App(): JSX.Element
{
    let [currentSection, setCurrentSection] = useState<"landing" | "Login" | "SignUp" | "home" | "tracker" | "viewer" >("landing");

    // Called when login succeeds
    const handleLoginSuccess = (userData: never):void =>
    {
        localStorage.setItem('auth', JSON.stringify(userData)); // store data in localStorage
        setCurrentSection('home');
        toast.success('Logged in!')
    };

    // swap current section to signup
    const handleNavigateToSignUp = ():void =>
    {
        setCurrentSection('SignUp');
    };
    // swap current section to login
    const handleNavigateToLogin = ():void =>
    {
        setCurrentSection('Login');
    };

    const RenderCurrentSection = () =>
    {
        switch (currentSection)
        {
            case "Login":
                return (
                    <div>
                        <Login
                            setUser={handleLoginSuccess}
                            onNavigateToSignUp={handleNavigateToSignUp}
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
                )
            case "SignUp":
                return <Signup
                    onNavigateToLogin={handleNavigateToLogin}
                    onRegister={() => console.log("soon")}
                />
            case "landing":
                return <Landing
                    onNavigateToLogin={handleNavigateToLogin}
                    onNavigateToSignUp={handleNavigateToSignUp}
                />
            default:
                return null
        }
    }
    return(
     <main className="min-h-screen text-white overflow-x-hidden smooth-scroll
             bg-cover bg-center bg-no-repeat relative z-20 transform-gp">
         {RenderCurrentSection()}
     </main>
 )
}