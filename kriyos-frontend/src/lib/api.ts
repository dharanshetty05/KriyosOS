const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();

    console.error("API Error:", {
      status: response.status,
      body: errorBody,
    });

    throw new Error(
      `API request failed: ${response.status} - ${errorBody}`,
    );
  }

  return response.json() as Promise<T>;
}