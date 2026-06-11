import type {ATOCategory, DashboardStats, TaxEntry} from './types';
import Tesseract from "tesseract.js";
import {
    createEntriesBatch,
    createEntry,
    deleteEntry as apiDeleteEntry,
    getEntries,
    updateEntry as apiUpdateEntry
} from "@/api/entries";
import {toast} from "sonner";

const STORAGE_KEY = 'claimr_tax_entries';
// holds utility to process entries, etc

// --- LOCAL STORAGE UTILITIES ---

/**
 * Retrieves tax entries from the browser's local storage.
 */
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

/**
 * Persists tax entries to the browser's local storage.
 */
const saveLocalEntries = (entries: TaxEntry[]) =>
{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};


let syncInProgress = false;

// --- SYNC SYSTEM ---

/**
 * Synchronizes unsynced local entries with the server.
 * Uses batch creation to improve performance.
 */
export const syncEntries = async () =>
{
    if (syncInProgress) return;

    const entries = getLocalEntries();
    const unsynced = entries.filter(e => !e.synced);

    if (unsynced.length === 0) return;

    syncInProgress = true;
    try {
        // Strip temporary local fields before sending to API
        const payloads = unsynced.map(({ id: _id, synced: _s, ...p }) => p);
        const results = await createEntriesBatch(payloads);

        // Update local entries with server-generated IDs
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


// --- STORAGE WRAPPER API ---

function GetUUIDRandom(): string
{
    // Generate a temporary unique ID for local-only entries
    if (crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c =>
    {
        // make entryID uuid —> converts to int id on backend
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


export const storage = {
    /**
     * Loads entries by merging server data with local-only (unsynced) data.
     */
    getEntries: async (): Promise<TaxEntry[]> =>
    {
        const localEntries = getLocalEntries();

        try
        {
            const serverEntries = await getEntries();
            const serverMapped: TaxEntry[] = serverEntries.map((e: any) => ({
                ...e,
                id: e.id.toString(),
                synced: true
            }));

            const serverIds = new Set(serverMapped.map(e => e.id));

            // Merge logic:
            // 1. Keep all entries from server (source of truth for synced data)
            // 2. Keep local entries that are NOT on the server yet (unsynced)
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

    /**
     * Adds a new entry locally and attempts to sync it with the server.
     */
    addEntry: async (entry: Omit<TaxEntry, 'id' | 'createdAt'>): Promise<TaxEntry> =>
    {
        const entries = getLocalEntries();

        // Simple deduplication check
        const isDuplicate = entries.some(e => 
            e.merchant === entry.merchant && 
            e.amount === entry.amount && 
            e.date === entry.date &&
            e.description === entry.description
        );

        if (isDuplicate)
        {
            // check if entry already exists
            return entries.find(e =>
                e.merchant === entry.merchant &&
                e.amount === entry.amount &&
                e.date === entry.date &&
                e.description === entry.description
            )!;
        }

        const newEntry: TaxEntry = {
            // construct a new entry
            ...entry,
            id: GetUUIDRandom(),
            createdAt: new Date().toISOString(),
            synced: false
        };

        // add entries to local storage
        entries.push(newEntry);
        saveLocalEntries(entries);

        try
        {
            // get entries
            const { id: localId, synced, ...payload } = newEntry;
            const created = await createEntry(payload);

            // Update local entry with server-generated ID
            const currentEntries = getLocalEntries();
            const index = currentEntries.findIndex(e => e.id === localId);
            if (index !== -1)
            {
                // get position of entries using indexes to save on server
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

    /**
     * Batch adds multiple entries (primarily for CSV imports).
     */
    addEntries: async (newEntriesData: Omit<TaxEntry, 'id' | 'createdAt'>[]): Promise<TaxEntry[]> =>
    {
        const localEntries = getLocalEntries();

        // Filter out duplicates
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

        if (uniqueNewData.length === 0) return localEntries; // if no data given

        // construct new entry
        const newEntries: TaxEntry[] = uniqueNewData.map(data => ({
            ...data,
            id: GetUUIDRandom(),
            createdAt: new Date().toISOString(),
            synced: false
        }));

        // update entries
        const updatedEntries = [...localEntries, ...newEntries];
        saveLocalEntries(updatedEntries);

        try
        {
            // try to sync entry with server upon update
            const payloads = newEntries.map(({ id: _i, synced: _s, ...p }) => p);
            const results = await createEntriesBatch(payloads);

            // Map server IDs back to local storage
            newEntries.forEach((entry, idx) => {
                const res = results[idx];
                if (res && res.synced)
                {
                    entry.id = res.id.toString();
                    entry.synced = true;
                }
            });
            saveLocalEntries(updatedEntries);
        }
        catch (err)
        {
            console.log("Batch add sync failed", err);
        }
        return updatedEntries;
    },

    /**
     * Updates an existing entry locally and on the server.
     */
    updateEntry: async (id: string, updates: Partial<TaxEntry>) =>
    {
        //  get entry info
        const entries = getLocalEntries();
        const index = entries.findIndex(e => e.id === id);

        if (index !== -1)
        {
            // if no update / error
            entries[index] = {
                ...entries[index],
                ...updates,
                synced: false
            };
            saveLocalEntries(entries);


            try
            {
                // push changes to api backend and store on database
                const numericId = parseInt(id);
                if (!isNaN(numericId))
                {
                    // do this if server online
                    const { id: _, synced, ...payload } = updates;
                    await apiUpdateEntry(numericId, payload);
                    entries[index].synced = true;
                    saveLocalEntries(entries);
                }
            }
            catch
            {
                console.log("Offline update!"); // log if client is updating entries offline instead
            }
        }
    },

    /**
     * Deletes an entry locally and from the server.
     */
    deleteEntry: async (id: string) =>
    {
        const entries = getLocalEntries();
        const filtered = entries.filter(e => e.id !== id);
        saveLocalEntries(filtered);

        try
        {
            // call delete on server end
            const numericId = parseInt(id);
            if (!isNaN(numericId))
            {
                await apiDeleteEntry(numericId);
            }
        }
        catch
        {
            // if offline
            console.log("Offline delete");
        }
    },
};

// --- STATISTICS CALCULATIONS ---

/**
 * Aggregates tax entries to calculate dashboard statistics.
 */
export const calculateStats = (entries: TaxEntry[]): DashboardStats =>
{
    const totalDeductions = entries.reduce((sum, entry) => sum + entry.amount, 0);
    const entriesCount = entries.length;
    const lastAddedDate = entries.length > 0
        ? entries.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0].createdAt
        : null;
    // initial value of dashboard
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

    // use local entries to display visual information
    entries.forEach(entry =>
    {
        // get each entry
        const category = entry.category as keyof typeof categoryBreakdown;

        // if category type not defined
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



// --- CSV EXPORT UTILITIES ---

/**
 * Generates and triggers a download for a CSV file of all entries.
 */
export const exportToCSV = (entries: TaxEntry[]): void =>
{
    // outline rows and blueprint structure to export as csv
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

    // join all fields and data
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // write to csv and push
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `claimr-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
};


// --- OCR UTILITIES (EXPERIMENTAL) ---

// ocr merchants to look for in text (lists common)
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

/**
 * Normalizes text for easier merchant matching.
 */
function normalize(text: string): string
{
    return text
        .toLowerCase()
        .replace(/[^a-z]/g, "");
}

/**
 * Attempts to identify a known merchant from OCR text.
 */
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

/**
 * Fallback to identify merchant from the first few lines of text.
 */
function fallbackMerchant(lines: string[]): string
{
    return lines
        .slice(0, 5)
        .map(l => l.replace(/[^A-Za-z\s]/g, "").trim())
        .find(l => l.length > 3) || "Unknown";
}

/**
 * Extracts GST amount from text or falls back to standard 1/11 calculation.
 */
function extractGST(text: string, amount: number): number
{
    const match = text.match(/GST.*?(\d+\.\d{2})/i);

    if (match) return Number(match[1]);

    return amount / 11;
};

/**
 * Parses raw text from Tesseract into structured tax entry data.
 */
export const parseReceiptText = (text: string): Partial<TaxEntry> =>
{
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

    // Identify the largest decimal number as the total amount
    const amounts = text.match(/\d+\.\d{2}/g)?.map(Number) || [];
    const amount = amounts.length ? Math.max(...amounts) : 0;

    const merchant =
        findMerchant(text) ||
        fallbackMerchant(lines);

    const tax = extractGST(text, amount);

    // Identify standard date formats
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

/**
 * Uses Tesseract.js to perform OCR on a receipt image.
 */
export const extractReceiptData = async (file: File): Promise<Partial<TaxEntry>> =>
{
    try
    {
        const result = await Tesseract.recognize(file, "eng", {
            logger: m => console.log(m)
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

/**
 * High-level OCR handler for UI integration.
 */
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

// --- FORMATTING UTILITIES ---

/**
 * Formats a number as AUD currency.
 */
export const formatCurrency = (amount: number): string =>
{
    return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
    }).format(amount);
};

/**
 * Formats a date string for Australian locale.
 */
export const formatDate = (dateString: string): string =>
{
    return new Date(dateString).toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

/**
 * Calculates a future date based on warranty months.
 */
export const calculateWarrantyExpiry = (purchaseDate: string, warrantyMonths: number): string =>
{
    const date = new Date(purchaseDate);
    date.setMonth(date.getMonth() + warrantyMonths);
    return date.toISOString().split('T')[0];
};


// --- FINANCIAL YEAR UTILITIES ---

/**
 * Determines the current Australian Financial Year (July-June).
 */
export const getCurrentFinancialYear = (): string =>
{
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    if (month >= 6)
    {
        // July onwards
        return `${year}-${year + 1}`;
    }
    else
    {
        // Before July
        return `${year - 1}-${year}`;
    }
};

/**
 * Calculates the next tax due date (October 31st).
 */
export const getTaxDueDate = (): string =>
{
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

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