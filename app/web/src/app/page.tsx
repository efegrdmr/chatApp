import { redirect } from "next/navigation";
import { backendFetch } from "@/lib/apiClient";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    const response = await backendFetch("/landing");
    const payload = (await response.json()) as { message?: string };
    const message = payload.message ?? "Welcome!";

    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 py-24 dark:bg-black">
        {message}
      </main>
    );
  } catch (error) {
    const status = typeof error === "object" && error && "status" in error
      ? (error as { status?: number }).status
      : undefined;

    if (status === 401) {
      redirect("/api/auth/logout");
    }

    throw error;
  }
}


