import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import type { TaxEntry, DashboardStats } from './types';
import {
    calculateStats,
    formatCurrency,
    formatDate,
    getCurrentFinancialYear,
    getTaxDueDate,
    storage,
    syncEntries,
    exportToCSV,
} from './utils';

import "@/styles/theme.css";
import {
    DollarSign,
    FileText,
    Calendar,
    AlertCircle,
    Upload,
    Plus,
    Download,
    LayoutDashboard,
    List
} from 'lucide-react';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { toast, Toaster } from "sonner";
import { ThemeToggle } from "@/components/App/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { EntryList } from "@/components/App/EntryList";
import { AddEditEntryDialog } from "@/components/App/AddEditEntryDialog";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

// bar colours to display
const COLORS: string[] = [
    '#06b6d4', '#0ea5e9', '#22d3ee', '#67e8f9',
    '#a5f3fc', '#cffafe', '#0e7490', '#155e75',
    '#164e63', '#083344'
];


export function Dashboard(): JSX.Element
{
    /**
     * Main Dashboard component.
     * Manages the global state of tax entries, handles CRUD operations, 
     * and provides data visualization via charts and stats.
     */
    const [entries, setEntries] = useState<TaxEntry[]>([]);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'entries'>('dashboard');
    const {logout} = useAuth();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<TaxEntry | undefined>();
    
    // Memoized statistics to prevent unnecessary recalculations on every render
    const stats: DashboardStats = useMemo(
        () => calculateStats(entries),
        [entries]
    );

    const navigate = useNavigate();

    // Effect: Initial load of entries from storage (server-sync + local)
    useEffect((): void =>
    {
        const loadEntries = async () =>
        {
            try
            {
                const data = await storage.getEntries();
                setEntries(data);
                
                // If there are unsynced entries, attempt to sync them now
                if (data.some(e => !e.synced)) {
                    await syncEntries();
                    const syncedData = await storage.getEntries();
                    setEntries(syncedData);
                }
            } catch
            {
                console.log("Offline mode");
                toast.error("using Offline Mode (no connection to server)")
            }
        };
        loadEntries().then(r => console.log(r));
    }, []);


    // Effect: Listen for 'online' status to trigger background synchronization
    useEffect(() =>
    {
        const handleOnline = async () => {
            await syncEntries();
            const updated = await storage.getEntries();
            setEntries(updated);
        };

        window.addEventListener("online", handleOnline);

        return () =>
        {
            window.removeEventListener("online", handleOnline);
        };
    }, []);

    // Prepare data for the Pie Chart visualization
    const chartData = useMemo(() =>
    {
        return Object.entries(stats.categoryBreakdown)
            .filter(([_, value]) => value > 0)
            .map(([name, value]) => ({ name, value }));
    }, [stats.categoryBreakdown]);

    const taxDueDate = getTaxDueDate();
    const daysUntilTaxDue = Math.ceil((new Date(taxDueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));


    // --- CRUD HANDLERS ---

    const handleAddEntry = (): void =>
    {
        setEditingEntry(undefined);
        setDialogOpen(true);
    };

    const handleEditEntry = (entry: TaxEntry) =>
    {
        setEditingEntry(entry);
        setDialogOpen(true);
    };

    /**
     * Saves a new entry or updates an existing one via the storage wrapper.
     */
    const handleSaveEntry = async (
        entryData: Omit<TaxEntry, 'id' | 'createdAt'>
    ) =>
    {
        if (editingEntry)
        {
            await storage.updateEntry(editingEntry.id, entryData);
            toast.success('Entry updated successfully');
        }
        else
        {
            await storage.addEntry(entryData);
            toast.success('Entry added successfully');
        }

        const updated = await storage.getEntries();
        setEntries(updated);

        setDialogOpen(false);
    };

    /**
     * Deletes an entry with a confirmation prompt.
     */
    const handleDeleteEntry = async (id: string) =>
    {
        if (!window.confirm('Are you sure you want to delete this entry?')) return;

        // Optimistic UI update: Remove from state immediately
        setEntries(prev => prev.filter(e => e.id !== id));

        await storage.deleteEntry(id);

        const updated = await storage.getEntries();
        setEntries(updated);


        toast.success('Entry deleted');
    };

    const handleExport = () =>
    {
        exportToCSV(entries);
        toast.success('CSV exported successfully');
    };

    /**
     * Handles user logout, clearing sensitive local and session data.
     * Warns user if there are unsynced entries.
     */
    const handleLogout = async () =>
    {
        const currentEntries = await storage.getEntries();
        const unsyncedCount = currentEntries.filter(e => !e.synced).length;
        
        let message = "Are you sure you want to logout?";
        if (unsyncedCount > 0) {
            message += `\n\nWarning: You have ${unsyncedCount} unsynced entries that will be lost.`;
        } else {
            message += " This will clear local data.";
        }

        if (!confirm(message)) return;
        
        logout();
        // Clear all persistent local data
        localStorage.clear();
        sessionStorage.clear();

        if ("caches" in window)
        {
            const keys = await caches.keys();
            await Promise.all(keys.map(k => caches.delete(k)));
        }

        setEntries([]);
        toast.success("Logged out");
        navigate("/");
    };

    /**
     * Parses a CSV file and batch adds the entries.
     */
    const handleImportCSV = async (file: File) =>
    {
        try
        {
            const text = await file.text();
            const rows = text.split('\n').slice(1); // Exclude header row


            const parsed: Omit<TaxEntry, 'id' | 'createdAt'>[] = rows
                .map(row =>
                {
                    const cols = row.split(',').map(c => c.replace(/"/g, ''));

                    if (cols.length < 6) return null;

                    return {
                        date: cols[0],
                        merchant: cols[1],
                        category: cols[2] as any,
                        amount: parseFloat(cols[3]),
                        tax: parseFloat(cols[4]),
                        description: cols[5],
                        warrantyExpiryDate: cols[6] || undefined,
                    };
                })
                .filter(Boolean) as any[];

            if (parsed.length === 0) {
                toast.error('No valid entries found in CSV');
                return;
            }

            const updated = await storage.addEntries(parsed);
            setEntries(updated);

            toast.success('CSV imported successfully');
        }
        catch (error)
        {
            toast.error('Failed to import CSV!');
            console.log(`client error: ${error}`);
        }
    };

    // UI
    return (
        <div className="min-h-screen bg-white dark:bg-black/60">
            <Toaster
                theme="dark"
                position="top-left"
                toastOptions={{
                    style: {
                        background: '#1f2937',
                        border: `1px solid ${'#00ffff'}`,
                        color: '#f9fafb',
                    },
                }}
            />
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
                                <p className="text-xs text-muted-foreground">Receipt Tracker</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                className="text-black dark:text-white "
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate("/")}
                            >
                                About
                            </Button>
                            <Button
                                onClick={handleLogout}
                                size="sm"
                                className="
            border border-red-500/40 text-red-400
            bg-transparent
            hover:bg-red-500/10 hover:border-red-400
            hover:shadow-md hover:shadow-red-500/20
            transition-all duration-200
            hover:-translate-y-0.5
            active:scale-95
        "
                            >
                                Logout
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
                        <div className="h-64 space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl bg-linear-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                                        Dashboard
                                    </h1>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Financial Year {getCurrentFinancialYear()}
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    accept=".csv"
                                    id="csv-upload"
                                    className="hidden"
                                    onChange={(e) =>
                                    {
                                        const file = e.target.files?.[0];
                                        if (file) handleImportCSV(file);
                                    }}
                                />
                                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">

                                    {/* Import */}
                                    <Button
                                        variant="outline"
                                        asChild
                                        className="
                    w-full sm:w-auto
                    border-cyan-500/40
                    dark:hover:text-cyan-500
                    hover:text-cyan-500
                    hover:border-cyan-400
                    hover:bg-cyan-500/10
                    hover:shadow-md hover:shadow-cyan-500/20
                    transition-all duration-200
                    hover:-translate-y-0.5
                    active:scale-95
                "
                                    >
                                        <label htmlFor="csv-upload" className="cursor-pointer flex items-center justify-center gap-2">
                                            <Upload className="h-4 w-4" />
                                            Import
                                        </label>
                                    </Button>

                                    {/* Export */}
                                    <Button
                                        onClick={handleExport}
                                        variant="outline"
                                        disabled={entries.length === 0}
                                        className="
                    w-full sm:w-auto
                    border-blue-500/40
                    hover:border-blue-400
                    dark:hover:text-cyan-500
                    hover:text-cyan-500
                    hover:bg-blue-500/10
                    hover:shadow-md hover:shadow-blue-500/20
                    transition-all duration-200
                    hover:-translate-y-0.5
                    active:scale-95
                "
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Export
                                    </Button>

                                    {/* Add Entry */}
                                    <Button
                                        onClick={handleAddEntry}
                                        className="
                                         w-full sm:w-auto
                                        bg-cyan-600 hover:bg-cyan-700
                                        hover:text-black
                                        dark:hover:text-white
                                        shadow-md shadow-cyan-500/20
                                        hover:shadow-lg hover:shadow-cyan-500/30
                                        transition-all duration-200
                                        hover:-translate-y-0.5
                                        active:scale-95
                                         "
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Entry
                                    </Button>

                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Card className="border-cyan-200 dark:border-cyan-900">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm">Total Deductions</CardTitle>
                                        <DollarSign className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl">{formatCurrency(stats.totalDeductions)}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Potential tax savings
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-blue-200 dark:border-blue-900">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm">Total Entries</CardTitle>
                                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl">{stats.entriesCount}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Tracked receipts
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-cyan-200 dark:border-cyan-900">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm">Last Added</CardTitle>
                                        <Calendar className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl">
                                            {stats.lastAddedDate ? formatDate(stats.lastAddedDate) : 'N/A'}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Most recent entry
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className={`${daysUntilTaxDue < 60 ? 'border-orange-200 dark:border-orange-900' : 'border-blue-200 dark:border-blue-900'}`}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm">Tax Due Date</CardTitle>
                                        <AlertCircle className={`h-4 w-4 ${daysUntilTaxDue < 60 ? 'text-orange-600 dark:text-orange-400' : 'text-blue-600 dark:text-blue-400'}`} />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl">{formatDate(taxDueDate)}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {daysUntilTaxDue} days remaining
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Charts and breakdown */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Category Breakdown</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {chartData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height={300}>
                                                <PieChart>
                                                    <Pie
                                                        data={chartData}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                    >
                                                        {chartData.map((_entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-75 flex items-center justify-center text-muted-foreground">
                                                No entries yet. Add your first receipt to see breakdown.
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Top Categories</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {chartData.length > 0 ? (
                                                chartData
                                                    .sort((a, b) => b.value - a.value)
                                                    .slice(0, 5)
                                                    .map((item, index) => (
                                                        <div key={item.name} className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className="w-3 h-3 rounded-full"
                                                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                                />
                                                                <span className="text-sm">{item.name}</span>
                                                            </div>
                                                            <span className="font-medium">{formatCurrency(item.value)}</span>
                                                        </div>
                                                    ))
                                            ) : (
                                                <div className="text-center text-muted-foreground py-8">
                                                    No categories yet
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
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
    );
}