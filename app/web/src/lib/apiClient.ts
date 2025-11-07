  import { cookies } from "next/headers";

  const API_BASE_URL = process.env.API_BASE_URL;

  class BackendError extends Error {
    constructor(message: string, readonly status: number) {
      super(message);
    }
  }

  export async function backendFetch(
    path: string,
    init: RequestInit = {},
    useAuthToken = true
  ) {
    if (!API_BASE_URL) {
      throw new BackendError("API base URL is not configured.", 500);
    }

    const requestInit: RequestInit = {
      cache: "no-store",
      ...init,
      headers: { ...(init.headers ?? {}) },
    };

    if (useAuthToken) {
      const cookieStore = await cookies();
      const authToken = cookieStore.get("auth_token")?.value;
      if (!authToken) {
        throw new BackendError("Authentication token is missing.", 401);
      }

      requestInit.headers = {
        ...requestInit.headers,
        Authorization: `Bearer ${authToken}`,
      };
    }

    const response = await fetch(`${API_BASE_URL}${path}`, requestInit);

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new BackendError(
        payload.message ??
          "An error occurred while fetching data from the backend.",
        response.status
      );
    }

    return response;
  }
