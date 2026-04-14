

export interface Entry
{
    id: number;
    merchant: string;
    amount: number;
    tax?: number;
    category?: string;
    description?: string;
    date: string;
}


export async function getEntries(): Promise<Entry[]>
{
    const res = await fetch("/api/entries", {
        credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch entries");

    return res.json();
}


export async function createEntry(data: Partial<Entry>): Promise<Entry>
{
    const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to create entry");

    return res.json();
}


export async function updateEntry(id: number, data: Partial<Entry>)
{
    const res = await fetch(`/api/entries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update entry");

    return res.json();
}

export async function deleteEntry(id: number)
{
    const res = await fetch(`/api/entries/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to delete entry");
}