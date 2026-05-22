// file stores type entry blueprints for objects (required by typescript)

export type ATOCategory = // categories allowed
    | 'Work-Related'
    | 'Self-Education'
    | 'Vehicle Expenses'
    | 'Home Office'
    | 'Travel'
    | 'Clothing & Laundry'
    | 'Tools & Equipment'
    | 'Insurance'
    | 'Other Deductible'
    | 'Non-Deductible';

export interface TaxEntry
{
    // entry blueprint
    id: string;
    merchant: string;
    date: string;
    amount: number;
    tax: number;
    category: ATOCategory;
    description: string;
    receiptUrl?: string;
    warrantyMonths?: number;
    warrantyExpiryDate?: string;
    createdAt: string;
    synced?: boolean;
}

export interface DashboardStats
{
    // dashboard blueprint display
    totalDeductions: number;
    entriesCount: number;
    lastAddedDate: string | null;
    categoryBreakdown: Record<ATOCategory, number>;
}
