/**
 * API service for tax deduction entries.
 * Handles fetching, creating, updating, and deleting entries from the backend.
 */

export interface Entry
{
    id: number;
    merchant: string;
    amount: number;
    tax: number;
    category: string;
    description: string;
    date: string;
    createdAt: string;
    warrantyMonths?: number;
    warrantyExpiryDate?: string;
}

/**
 * Fetches all tax deduction entries for the current authenticated user.
 */
export async function getEntries(): Promise<Entry[]>
{
    const res = await fetch("https://api.claimr.dev/api/entries", {
        credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch entries");

    return res.json();
}

/**
 * Creates a new tax deduction entry.
 */
export async function createEntry(data: Partial<Entry>): Promise<Entry>
{
    const res = await fetch("https://api.claimr.dev/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to create entry");

    return res.json();
}

/**
 * Creates multiple tax deduction entries in a single batch request.
 */
export async function createEntriesBatch(data: Partial<Entry>[]): Promise<Entry[]>
{
    const res = await fetch("https://api.claimr.dev/api/entries/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to create batch entries");

    return res.json();
}

/**
 * Updates an existing tax deduction entry by ID.
 */
export async function updateEntry(id: number, data: Partial<Entry>)
{
    const res = await fetch(`https://api.claimr.dev/api/entries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update entry");
    
    return res.json();
}

/**
 * Deletes a tax deduction entry by ID.
 */
export async function deleteEntry(id: number)
{
    const res = await fetch(`https://api.claimr.dev/api/entries/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to delete entry");
}
