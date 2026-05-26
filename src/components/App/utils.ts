import type { TaxEntry, ATOCategory, DashboardStats } from './types';
import Tesseract from "tesseract.js";
import {
    createEntry,
    createEntriesBatch,
    getEntries,
    updateEntry as apiUpdateEntry,
    deleteEntry as apiDeleteEntry
} from "@/api/entries";
import {toast} from "sonner";
const STORAGE_KEY = 'claimr_tax_entries';


//  LOCAL STORAGE

const getLocalEntries = (): TaxEntry[] =>
{
    // fetch entriss from storage.
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
    // add local entries to application
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};


let syncInProgress = false;

//   SYNC SYSTEM
export const syncEntries = async () =>
{
    if (syncInProgress) return;
    
    // add and update entries from API
    const entries = getLocalEntries();
    const unsynced = entries.filter(e => !e.synced);

    if (unsynced.length === 0) return;

    syncInProgress = true;
    try {
        const payloads = unsynced.map(({ id: _id, synced: _s, ...p }) => p);
        const results = await createEntriesBatch(payloads);

        unsynced.forEach((entry, idx) => {
            const res = results[idx];
            if (res && res.synced) {
                entry.id = res.id.toString();
                entry.synced = true;
            } else if (res && res.error) {
                console.error("Sync failed for entry:", res.error);
            }
        });
        saveLocalEntries(entries);
    } catch (err) {
        console.log("Batch sync failed:", err);
    } finally {
        syncInProgress = false;
    }
};


//   STORAGE API

function GetUUIDRandom(): string
{
    // generate an entry uuid for object.
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
        // storage component function
        const localEntries = getLocalEntries();

        try
        {
            const serverEntries = await getEntries();
            const serverMapped: TaxEntry[] = serverEntries.map((e: any) => ({
                ...e,
                id: e.id.toString(), // Use server ID as string
                synced: true
            }));
            
            const serverIds = new Set(serverMapped.map(e => e.id));

            // Merge logic:
            // 1. Keep all entries from server (source of truth for synced data)
            // 2. Keep local entries that are NOT on the server yet (unsynced or just synced but missing from this fetch)
            const localOnly = localEntries.filter(e => !e.synced || !serverIds.has(e.id));
            
            const allEntries = [...serverMapped, ...localOnly];
            saveLocalEntries(allEntries);
            return allEntries;
        }
        catch
        {
            console.log("Offline - using local data");
            return localEntries;
        }
    },

    //  ADD
    addEntry: async (entry: Omit<TaxEntry, 'id' | 'createdAt'>): Promise<TaxEntry> =>
    {
        // add the entries to local
        const entries = getLocalEntries();

        // Simple deduplication
        const isDuplicate = entries.some(e => 
            e.merchant === entry.merchant && 
            e.amount === entry.amount && 
            e.date === entry.date &&
            e.description === entry.description
        );

        if (isDuplicate) {
            const existing = entries.find(e => 
                e.merchant === entry.merchant && 
                e.amount === entry.amount && 
                e.date === entry.date &&
                e.description === entry.description
            )!;
            return existing;
        }

        const newEntry: TaxEntry = {
            ...entry,
            id: GetUUIDRandom(),
            createdAt: new Date().toISOString(),
            synced: false
        };

        // push changes to local storage
        entries.push(newEntry);
        saveLocalEntries(entries);

        try
        {
            const { id: localId, synced, ...payload } = newEntry;

            const created = await createEntry(payload);

            // Update entry with server ID
            const currentEntries = getLocalEntries();
            const index = currentEntries.findIndex(e => e.id === localId);
            if (index !== -1) {
                currentEntries[index].id = created.id.toString();
                currentEntries[index].synced = true;
                saveLocalEntries(currentEntries);
                newEntry.id = created.id.toString();
                newEntry.synced = true;
            }
        }
        catch
        {
            console.log("Offline - saved locally only");
        }

        return newEntry;
    },

    // BATCH ADD (for CSV import)
    addEntries: async (newEntriesData: Omit<TaxEntry, 'id' | 'createdAt'>[]): Promise<TaxEntry[]> =>
    {
        const localEntries = getLocalEntries();
        
        // Filter out duplicates from the input data itself and against local entries
        const uniqueNewData = newEntriesData.filter((data, index, self) => 
            index === self.findIndex(t => (
                t.merchant === data.merchant && 
                t.amount === data.amount && 
                t.date === data.date &&
                t.description === data.description
            )) && 
            !localEntries.some(existing => (
                existing.merchant === data.merchant && 
                existing.amount === data.amount && 
                existing.date === data.date &&
                existing.description === data.description
            ))
        );

        if (uniqueNewData.length === 0) return localEntries;

        const newEntries: TaxEntry[] = uniqueNewData.map(data => ({
            ...data,
            id: GetUUIDRandom(),
            createdAt: new Date().toISOString(),
            synced: false
        }));

        const updatedEntries = [...localEntries, ...newEntries];
        saveLocalEntries(updatedEntries);

        try {
            const payloads = newEntries.map(({ id: _i, synced: _s, ...p }) => p);
            const results = await createEntriesBatch(payloads);
            
            // Map back server IDs
            newEntries.forEach((entry, idx) => {
                const res = results[idx];
                if (res && res.synced) {
                    entry.id = res.id.toString();
                    entry.synced = true;
                }
            });
            saveLocalEntries(updatedEntries);
        } catch (err) {
            console.log("Batch add sync failed", err);
        }

        return updatedEntries;
    },

    //  UPDATE
    updateEntry: async (id: string, updates: Partial<TaxEntry>) =>
    {
        // update entries to local application
        const entries = getLocalEntries();
        const index = entries.findIndex(e => e.id === id);

        if (index !== -1)
        {
            // get position of entries
            entries[index] = {
                ...entries[index],
                ...updates,
                synced: false
            };
            saveLocalEntries(entries);


            try
            {
                const numericId = parseInt(id);
                if (!isNaN(numericId)) {
                    const { id: _, synced, ...payload } = updates;
                    await apiUpdateEntry(numericId, payload);
                    entries[index].synced = true;
                    saveLocalEntries(entries);
                }
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
        // delete entries from local storage
        const entries = getLocalEntries();
        const filtered = entries.filter(e => e.id !== id);
        saveLocalEntries(filtered);

        try
        {
            // delete entry from api also
            const numericId = parseInt(id);
            if (!isNaN(numericId)) {
                await apiDeleteEntry(numericId);
            }
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
    // get stats (dashboard) and display on dashboard
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
        // get category of entries
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
    // function to export local entries as CSV file
    const headers = ['Date', 'Merchant', 'Category', 'Amount', 'Tax', 'Description', 'Warranty Expiry'];
    // get entries fields
    const rows = entries.map(entry => [
        entry.date,
        entry.merchant,
        entry.category,
        entry.amount.toFixed(2),
        entry.tax.toFixed(2),
        entry.description,
        entry.warrantyExpiryDate || '',
    ]);
    // add to csv
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    // export
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `claimr-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
};


//   UTILITIES

// OCR functions EXPERIMENTAL -
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
    // fix text display between API and client formats
    return text
        .toLowerCase()
        .replace(/[^a-z]/g, "");
}

function findMerchant(text: string): string
{
    // find merchants known OCR
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
    // merhcant not found in OCR
    return lines
        .slice(0, 5)
        .map(l => l.replace(/[^A-Za-z\s]/g, "").trim())
        .find(l => l.length > 3) || "Unknown";
}

function extractGST(text: string, amount: number): number
{
    // GET OCR GST (tesseract)
    const match = text.match(/GST.*?(\d+\.\d{2})/i);

    if (match) return Number(match[1]);

    // fallback (not always accurate)
    return amount / 11;
};

export const parseReceiptText = (text: string): Partial<TaxEntry> =>
{
    // GET TEXT DATA
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
    // extract text data to form
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
    // USE OCR
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

export const formatCurrency = (amount: number): string =>
{
    // format data
    return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
    }).format(amount);
};

export const formatDate = (dateString: string): string =>
{
    // format date
    return new Date(dateString).toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const calculateWarrantyExpiry = (purchaseDate: string, warrantyMonths: number): string =>
{
    // calcuate waranty expiry date using maths
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
    // get due date for entries using maths
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