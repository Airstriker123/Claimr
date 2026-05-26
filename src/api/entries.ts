/*
file contains various api calls related to user entries
- add
- remove
- get
- update
- edit
 */

export interface Entry
{
    // export entries interface for other component use
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


export async function getEntries(): Promise<Entry[]>
{
    // use payload to get entries from database api
    const res = await fetch("/api/entries", {
        credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch entries");

    return res.json();
}


export async function createEntry(data: Partial<Entry>): Promise<Entry>
{
    // method to create entry
    const res = await fetch("/api/entries", { // push payload with entry to api
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });

    // error
    if (!res.ok) throw new Error("Failed to create entry");

    return res.json(); // json payload
}

export async function createEntriesBatch(data: Partial<Entry>[]): Promise<Entry[]>
{
    // method to create multiple entries
    const res = await fetch("/api/entries/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to create batch entries");

    return res.json();
}


export async function updateEntry(id: number, data: Partial<Entry>)
{
    // method to update entry
    const res = await fetch(`/api/entries/${id}`, { //push changes to api
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });

    //error in request
    if (!res.ok) throw new Error("Failed to update entry");
    // return json payload
    return res.json();
}

export async function deleteEntry(id: number)
{
    // delete entry from api cloud
    const res = await fetch(`/api/entries/${id}`, { //payload to delete entry (with id)
        method: "DELETE",
        credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to delete entry");
}