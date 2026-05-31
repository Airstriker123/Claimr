export async function onRequest(context)
{
  const { request, env } = context;

  // Serve a real static asset if one exists at this path
  const assetResponse = await env.ASSETS.fetch(request);
  if (assetResponse.status !== 404) {
    return assetResponse;
  }

  // Otherwise serve the SPA shell so React Router can take over
  const url = new URL(request.url);
  url.pathname = "/";
  return env.ASSETS.fetch(new Request(url.toString(), request));
}
