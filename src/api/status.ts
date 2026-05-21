export async function pingServer()
{
    // LOGIC to ping server and determine if request is successful
    try {
        const res = await fetch("api/status"); //get from endpoint

        if (!res.ok)  // if request fail
        {
            console.log("server down!", res.status);
            return false;
        }
        // if success
        console.log("Server is up:");
        return true;
    }
    catch (error)
    {
        // any error
        console.log("Server is DOWN:", error);
        return false;
    }
}