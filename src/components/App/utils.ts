import type {TaxEntry, ATOCategory, DashboardStats} from './types';

const STORAGE_KEY = 'claimr_tax_entries';

export const storage = {
    getEntries: (): TaxEntry[] => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading entries:', error);
            return [];
        }
    },

    saveEntries: (entries: TaxEntry[]): void => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        } catch (error) {
            console.error('Error saving entries:', error);
        }
    },

    addEntry: (entry: Omit<TaxEntry, 'id' | 'createdAt'>): TaxEntry => {
        const entries = storage.getEntries();
        const newEntry: TaxEntry = {
            ...entry,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };
        entries.push(newEntry);
        storage.saveEntries(entries);
        return newEntry;
    },

    updateEntry: (id: string, updates: Partial<TaxEntry>): void => {
        const entries = storage.getEntries();
        const index = entries.findIndex(e => e.id === id);
        if (index !== -1) {
            entries[index] = { ...entries[index], ...updates };
            storage.saveEntries(entries);
        }
    },

    deleteEntry: (id: string): void => {
        const entries = storage.getEntries();
        const filtered = entries.filter(e => e.id !== id);
        storage.saveEntries(filtered);
    },
};

export const calculateStats = (entries: TaxEntry[]): DashboardStats => {
    const totalDeductions = entries.reduce((sum, entry) => sum + entry.amount, 0);
    const entriesCount = entries.length;
    const lastAddedDate = entries.length > 0
        ? entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt
        : null;

    const categoryBreakdown: Record<ATOCategory, number> = {
        'Work-Related': 0,
        'Self-Education': 0,
        'Vehicle Expenses': 0,
        'Home Office': 0,
        'Travel': 0,
        'Clothing & Laundry': 0,
        'Tools & Equipment': 0,
        'Insurance': 0,
        'Other Deductible': 0,
        'Non-Deductible': 0,
    };

    entries.forEach(entry => {
        categoryBreakdown[entry.category] += entry.amount;
    });

    return {
        totalDeductions,
        entriesCount,
        lastAddedDate,
        categoryBreakdown,
    };
};

export const exportToCSV = (entries: TaxEntry[]): void => {
    const headers = ['Date', 'Merchant', 'Category', 'Amount', 'Tax', 'Description', 'Warranty Expiry'];
    const rows = entries.map(entry => [
        entry.date,
        entry.merchant,
        entry.category,
        entry.amount.toFixed(2),
        entry.tax.toFixed(2),
        entry.description,
        entry.warrantyExpiryDate || '',
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `claimr-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
};

// Mock OCR function - in production, this would call an OCR API
export const mockOCRExtraction = (file: File): Promise<Partial<TaxEntry>> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                merchant: 'Sample Merchant',
                date: new Date().toISOString().split('T')[0],
                amount: Math.random() * 100 + 10,
                tax: Math.random() * 10 + 1,
                description: 'Extracted from receipt',
            });
        }, 1500);
    });
};

export const calculateWarrantyExpiry = (purchaseDate: string, warrantyMonths: number): string => {
    const date = new Date(purchaseDate);
    date.setMonth(date.getMonth() + warrantyMonths);
    return date.toISOString().split('T')[0];
};

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
    }).format(amount);
};

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

// Australian financial year runs from July 1 to June 30
export const getCurrentFinancialYear = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    if (month >= 6) {
        // July onwards - current FY
        return `${year}-${year + 1}`;
    } else {
        // Before July - previous FY
        return `${year - 1}-${year}`;
    }
};

export const getTaxDueDate = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // Tax due date is October 31
    if (month >= 6) {
        // After July - next year's Oct 31
        return `${year + 1}-10-31`;
    } else {
        // Before July - this year's Oct 31
        return `${year}-10-31`;
    }
};
