import './styles/App.css'
import Landing from "./components/Landing/Landing.tsx"
import Login from "@/components/Auth/LogIn"
import Signup from "@/components/Auth/SignUp"
import {useState, useEffect} from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import {toast, Toaster} from "sonner";
import {Button} from "@/ui/button";
import { storage, calculateStats, exportToCSV } from '@/components/App/utils';
import { FileText, LayoutDashboard, List } from 'lucide-react';
import type {TaxEntry} from '@/components/App/types';
import { ThemeToggle } from '@/components/App/ThemeToggle';
import { ThemeProvider } from 'next-themes';
import { Dashboard } from '@/components/App/DashBoard';
import { EntryList } from '@/components/App/EntryList';
import { AddEditEntryDialog } from '@/components/App/AddEditEntryDialog';

export default function App(): JSX.Element
{
    const [currentSection, setCurrentSection] = useState< "Dashboard" |"Landing" | "Login" | "SignUp" | "Home">("Landing");
    const [entries, setEntries] = useState<TaxEntry[]>([]);
    const stats = calculateStats(entries);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<TaxEntry | undefined>();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'entries'>('dashboard');

    // Called when login succeeds
    const handleLoginSuccess = (userData: never):void =>
    {
        localStorage.setItem('auth', JSON.stringify(userData)); // store data in localStorage
        setCurrentSection('Home');
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
    // swap current section to landing
    const handleNavigateToLanding = ():void =>
    {
        setCurrentSection('Landing');
    };

    useEffect(() =>
    {
        const savedEntries = storage.getEntries();
        setEntries(savedEntries);
        // Check if user has visited before
    }, []);


    const handleAddEntry = () => {
        setEditingEntry(undefined);
        setDialogOpen(true);
    };

    const handleEditEntry = (entry: TaxEntry) => {
        setEditingEntry(entry);
        setDialogOpen(true);
    };

    const handleSaveEntry = (entryData: Omit<TaxEntry, 'id' | 'createdAt'>) => {
        if (editingEntry) {
            storage.updateEntry(editingEntry.id, entryData);
            toast.success('Entry updated successfully');
        } else {
            storage.addEntry(entryData);
            toast.success('Entry added successfully');
        }
        setEntries(storage.getEntries());
        setDialogOpen(false);
    };

    const handleDeleteEntry = (id: string) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            storage.deleteEntry(id);
            setEntries(storage.getEntries());
            toast.success('Entry deleted');
        }
    };

    const handleExport = () => {
        exportToCSV(entries);
        toast.success('CSV exported successfully');
    };


    const RenderCurrentSection = () =>
    {
        switch (currentSection)
        {
            case "Dashboard":
                return (
                    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                    <div className="min-h-screen bg-white dark:bg-black/60">
                        <Toaster position="top-right" />
                        {/* Header */}
                        <header className="border-b border-border bg-card backdrop-blur-sm sticky top-0 z-50">
                            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-linear-to-br from-cyan-500 to-blue-600 rounded-lg p-2">
                                            <FileText className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h1 className="text-xl bg-linear-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                                                Claimr
                                            </h1>
                                            <p className="text-xs text-muted-foreground">Tax Return Tracker</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            className="text-black dark:text-white "
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleNavigateToLanding}
                                        >
                                            About
                                        </Button>
                                        <ThemeToggle />
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Main Content */}
                        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'dashboard' | 'entries')}>
                                <TabsList className="mb-6">
                                    <TabsTrigger value="dashboard" className="flex items-center gap-2">
                                        <LayoutDashboard className="h-4 w-4" />
                                        Dashboard
                                    </TabsTrigger>
                                    <TabsTrigger value="entries" className="flex items-center gap-2">
                                        <List className="h-4 w-4" />
                                        Entries
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="dashboard">
                                    <Dashboard
                                        stats={stats}
                                        entries={entries}
                                        onAddEntry={handleAddEntry}
                                        onExport={handleExport}
                                    />
                                </TabsContent>

                                <TabsContent value="entries">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h2 className="text-2xl">All Entries</h2>
                                                <p className="text-sm text-muted-foreground">
                                                    {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                                                </p>
                                            </div>
                                            <Button onClick={handleAddEntry} className="bg-cyan-600 hover:bg-cyan-700">
                                                Add Entry
                                            </Button>
                                        </div>
                                        <EntryList
                                            entries={entries}
                                            onEdit={handleEditEntry}
                                            onDelete={handleDeleteEntry}
                                        />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </main>

                        {/* Add/Edit Dialog */}
                        <AddEditEntryDialog
                            open={dialogOpen}
                            onClose={() => setDialogOpen(false)}
                            onSave={handleSaveEntry}
                            entry={editingEntry}
                        />
                    </div>
                    </ThemeProvider>
                )
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
            case "Landing":
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