import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import type {TaxEntry, DashboardStats} from './types';
import { formatCurrency, formatDate, getCurrentFinancialYear, getTaxDueDate } from './utils';
import "@/styles/theme.css"
import {
    DollarSign,
    FileText,
    Calendar,
    AlertCircle,
    Plus,
    Download
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DashboardProps {
    stats: DashboardStats;
    entries: TaxEntry[];
    onAddEntry: () => void;
    onExport: () => void;
}

const COLORS = ['#06b6d4', '#0ea5e9', '#22d3ee', '#67e8f9', '#a5f3fc', '#cffafe', '#0e7490', '#155e75', '#164e63', '#083344'];

export function Dashboard({ stats, entries, onAddEntry, onExport }: DashboardProps) {
    const chartData = useMemo(() => {
        return Object.entries(stats.categoryBreakdown)
            .filter(([_, value]) => value > 0)
            .map(([name, value]) => ({ name, value }));
    }, [stats.categoryBreakdown]);

    const taxDueDate = getTaxDueDate();
    const daysUntilTaxDue = Math.ceil((new Date(taxDueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    return (
        <div className="space-y-6">
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
                <div className="flex gap-2">
                    <Button onClick={onExport} variant="outline" disabled={entries.length === 0}>
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                    </Button>
                    <Button onClick={onAddEntry} className="bg-cyan-600 hover:bg-cyan-700">
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
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
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
    );
}
