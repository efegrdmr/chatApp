  import { NextResponse } from "next/server";
  import { backendFetch } from "@/lib/apiClient";

  export async function GET() {
    try {
      const res = await backendFetch("/friendship/friends");
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const message = (data as { message?: string })?.message ?? `Upstream error`;
        return NextResponse.json({ message }, { status: res.status });
      }

      return NextResponse.json(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      const statusCandidate = (error as { status?: unknown })?.status;
      const status = typeof statusCandidate === "number" ? statusCandidate : 500;

      return NextResponse.json({ message }, { status });
    }
  }
