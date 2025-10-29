import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;
  if (!authToken) {
    redirect("/login");
  }

  const apiBaseUrl =
    process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL is not configured.");
  }

  const response = await fetch(`${apiBaseUrl}/landing`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error("Failed to load landing page content.");
  }

  const payload = (await response.json()) as { message?: string };
  const message = payload.message ?? "Welcome!";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 py-24 dark:bg-black">
      <section className="w-full max-w-2xl rounded-3xl border border-zinc-200 bg-white px-10 py-16 text-center shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {message}
        </h1>
        <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
          This content is fetched directly from the secured ASP.NET Core
          endpoint and rendered on the server.
        </p>
      </section>
    </main>
  );
}
