import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import { AuthProvider } from "@/auth/AuthContext";
import { BrowserRouter } from "react-router-dom";
import React from "react";
// @ts-ignore errors
import { registerSW } from 'virtual:pwa-register'; //import pwa register
import {Toaster, toast} from "sonner";

function NewUpdate()
{
    toast.error("Update new update!");
    return <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
            style: {
                background: 'rgba(0,58,58,0.32)',
                border: `1px solid ${'#004652'}`,
                color: '#00ffa4',
            },
        }}
    />
}

// mount pwa features to application using vite bundler (generate pwa sw, workbox files on compile)

registerSW({
    immediate: true,
    onOfflineReady: NewUpdate,
    onNeedRefresh: NewUpdate,
});

// Render Client Application to DOM
createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
)
