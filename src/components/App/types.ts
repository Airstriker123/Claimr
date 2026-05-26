/**
 * Valid ATO (Australian Taxation Office) deduction categories.
 */
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

/**
 * Represents a single tax deduction entry in the application.
 */
export interface TaxEntry
{
    id: string;              // Unique identifier (UUID for local, Numeric for server)
    merchant: string;        // Store or vendor name
    date: string;            // Date of purchase (ISO string)
    amount: number;          // Total amount paid
    tax: number;             // Tax (GST) amount
    category: ATOCategory;   // Deduction category
    description: string;     // User-provided description or notes
    receiptUrl?: string;     // Optional link to receipt image
    warrantyMonths?: number; // Optional warranty duration
    warrantyExpiryDate?: string; // Calculated warranty end date
    createdAt: string;       // Record creation timestamp
    synced?: boolean;        // Whether the record has been saved to the server
}

/**
 * Statistics used for the dashboard visualization.
 */
export interface DashboardStats
{
    totalDeductions: number;   // Sum of all entry amounts
    entriesCount: number;      // Total number of entries
    lastAddedDate: string | null; // Most recent entry's createdAt date
    categoryBreakdown: Record<ATOCategory, number>; // Total amount spent per category
}
