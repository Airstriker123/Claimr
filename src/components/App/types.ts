export type ATOCategory =
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
    totalDeductions: number;
    entriesCount: number;
    lastAddedDate: string | null;
    categoryBreakdown: Record<ATOCategory, number>;
}
