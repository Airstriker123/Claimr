import type { TaxEntry, ATOCategory, DashboardStats } from './types';
import Tesseract from "tesseract.js";
import {
    createEntry,
    getEntries,
    updateEntry as apiUpdateEntry,
    deleteEntry as apiDeleteEntry
} from "@/api/entries";
import {toast} from "sonner";
const STORAGE_KEY = 'claimr_tax_entries';


//  LOCAL STORAGE

const getLocalEntries = (): TaxEntry[] =>
{
    try
    {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    }
    catch
    {
        return [];
    }
};

const saveLocalEntries = (entries: TaxEntry[]) =>
{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};


//   SYNC SYSTEM
export const syncEntries = async () =>
{
    const entries = getLocalEntries();

    const unsynced = entries.filter(e => !e.synced);

    for (const entry of unsynced)
    {
        try
        {
            const { id: _id, synced: _synced, createdAt, ...payload } = entry;

            await createEntry({
                ...payload,
                date: createdAt
            });

            entry.synced = true;
        }
        catch
        {
            console.log("Still offline");
        }
    }
    saveLocalEntries(entries);
};


//   STORAGE API

function GetUUIDRandom(): string {
    if (crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


export const storage = {
    //  LOAD
    getEntries: async (): Promise<TaxEntry[]> =>
    {
        try
        {
            const serverEntries = await getEntries();
            const mapped: TaxEntry[] = serverEntries.map((e: any) => ({
                ...e,
                id: GetUUIDRandom(), // local id
                createdAt: e.date,
                synced: true
            }));
            saveLocalEntries(mapped);
            return mapped;
        }
        catch
        {
            console.log("Offline - using local data");
            return getLocalEntries();
        }
    },

    //  ADD
    addEntry: async (entry: Omit<TaxEntry, 'id' | 'createdAt'>): Promise<TaxEntry> =>
    {
        const entries = getLocalEntries();

        const newEntry: TaxEntry = {
            ...entry,
            id: GetUUIDRandom(),
            createdAt: new Date().toISOString(),
            synced: false
        };

        entries.push(newEntry);
        saveLocalEntries(entries);

        try
        {
            const { id, synced, createdAt, ...payload } = newEntry;

            await createEntry({
                ...payload,
                date: createdAt
            });

            newEntry.synced = true;
            saveLocalEntries(entries);

        }
        catch
        {
            console.log("Offline - saved locally only");
        }

        return newEntry;
    },

    //  UPDATE
    updateEntry: async (id: string, updates: Partial<TaxEntry>) =>
    {
        const entries = getLocalEntries();
        const index = entries.findIndex(e => e.id === id);

        if (index !== -1)
        {
            entries[index] = {
                ...entries[index],
                ...updates,
                synced: false
            };
            saveLocalEntries(entries);


            try
            {
                const { id: _, synced, createdAt, ...payload } = updates;
                await apiUpdateEntry(Number(id), {
                    ...payload,
                    date: createdAt
                });
                entries[index].synced = true;
                saveLocalEntries(entries);
            }
            catch
            {
                console.log("Offline update");
            }
        }
    },

    // DELETE
    deleteEntry: async (id: string) =>
    {
        const entries = getLocalEntries();
        const filtered = entries.filter(e => e.id !== id);
        saveLocalEntries(filtered);

        try
        {
            await apiDeleteEntry(Number(id));
        }
        catch
        {
            console.log("Offline delete");
        }
    },
};

//   STATS
export const calculateStats = (entries: TaxEntry[]): DashboardStats =>
{
    const totalDeductions = entries.reduce((sum, entry) => sum + entry.amount, 0);
    const entriesCount = entries.length;
    const lastAddedDate = entries.length > 0
        ? entries.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0].createdAt
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

    entries.forEach(entry =>
    {
        const category = entry.category as keyof typeof categoryBreakdown;

        if (categoryBreakdown[category] !== undefined)
        {
            categoryBreakdown[category] += entry.amount;
        }
        else
        {
            categoryBreakdown["Other Deductible"] += entry.amount;
        }
    });

    return {
        totalDeductions,
        entriesCount,
        lastAddedDate,
        categoryBreakdown,
    };
};



//  CSV EXPORT
export const exportToCSV = (entries: TaxEntry[]): void =>
{
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


//   UTILITIES

// OCR function beta -
const KNOWN_STORES = [
    "Coles",
    "Woolworths",
    "Aldi",
    "Bunnings",
    "Kmart",
    "Target",
    "Officeworks",
    "JB Hi-Fi",
    "Chemist Warehouse",
    "Priceline",
    "IGA",
    "7-Eleven",
    "McDonald's",
    "Hungry Jack's",
    "Domino's",
    "Subway"
];

function normalize(text: string): string
{
    return text
        .toLowerCase()
        .replace(/[^a-z]/g, "");
}

function findMerchant(text: string): string
{
    const cleanedText = normalize(text);

    for (const store of KNOWN_STORES)
    {
        const normalizedStore = normalize(store);

        if (cleanedText.includes(normalizedStore))
        {
            return store;
        }
    }

    return "Unknown";
}

function fallbackMerchant(lines: string[]): string
{
    return lines
        .slice(0, 5)
        .map(l => l.replace(/[^A-Za-z\s]/g, "").trim())
        .find(l => l.length > 3) || "Unknown";
}

function extractGST(text: string, amount: number): number
{
    const match = text.match(/GST.*?(\d+\.\d{2})/i);

    if (match) return Number(match[1]);

    // fallback (not always accurate)
    return amount / 11;
};

export const parseReceiptText = (text: string): Partial<TaxEntry> =>
{
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

    // Amount
    const amounts = text.match(/\d+\.\d{2}/g)?.map(Number) || [];
    const amount = amounts.length ? Math.max(...amounts) : 0;

    // Merchant
    const merchant =
        findMerchant(text) ||
        fallbackMerchant(lines);

    // GST
    const tax = extractGST(text, amount);

    // Date
    const dateMatch = text.match(/\d{2}\/\d{2}\/\d{4}/);
    const date = dateMatch ? dateMatch[0] : new Date().toISOString();

    return {
        merchant,
        amount,
        tax,
        date,
        description: "OCR extracted"
    };
};

export const extractReceiptData = async (file: File): Promise<Partial<TaxEntry>> =>
{
    try
    {
        const result = await Tesseract.recognize(file, "eng", {
            logger: m => console.log(m) // progress logs
        });

        const text = result.data.text;

        return parseReceiptText(text);
    }
    catch (err)
    {
        console.error("OCR failed:", err);
        throw new Error("OCR processing failed");
    }
};

export const HandleOCR = async (file: File): Promise<Partial<TaxEntry> | void> =>
{
    try
    {
        return await extractReceiptData(file);
    }
    catch
    {
        toast.error("Failed to use OCR...");
        return;
    }
};

export const handleImportCSV = async (file: File) =>
{
    const text = await file.text();

    const rows = text.split('\n').slice(1); // skip header

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

    for (const entry of parsed)
    {
        await storage.addEntry(entry);
    }

    const updated = await storage.getEntries();
    setEntries(updated);

    toast.success('CSV imported successfully');
};

export const formatCurrency = (amount: number): string =>
{
    return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
    }).format(amount);
};

export const formatDate = (dateString: string): string =>
{
    return new Date(dateString).toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const calculateWarrantyExpiry = (purchaseDate: string, warrantyMonths: number): string =>
{
    const date = new Date(purchaseDate);
    date.setMonth(date.getMonth() + warrantyMonths);
    return date.toISOString().split('T')[0];
};


// Australian financial year runs from July 1 to June 30
export const getCurrentFinancialYear = (): string =>
{
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    if (month >= 6)
    {
        // July onwards - current FY
        return `${year}-${year + 1}`;
    }
    else
    {
        // Before July - previous FY
        return `${year - 1}-${year}`;
    }
};

export const getTaxDueDate = (): string =>
{
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // Tax due date is October 31
    if (month >= 6)
    {
        // After July - next year's Oct 31
        return `${year + 1}-10-31`;
    }
    else
    {
        // Before July - this year's Oct 31
        return `${year}-10-31`;
    }
};