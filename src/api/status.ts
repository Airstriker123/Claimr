export async function pingServer()
{
    try {
        const res = await fetch("api/status");

        if (!res.ok) {
            console.log("server down!", res.status);
            return false;
        }
        console.log("Server is up:");
        return true;
    } catch (error) {
        console.log("Server is DOWN:", error);
        return false;
    }
}