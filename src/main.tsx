import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import { AuthProvider } from "@/auth/AuthContext";
import { BrowserRouter } from "react-router-dom";
import React from "react";
//import { registerSW } from 'virtual:pwa-register'; //import pwa register

/*
registerSW({
    immediate: true
});
*/
createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
)
