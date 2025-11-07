import { NextResponse, type NextRequest } from "next/server";
import { backendFetch } from "@/lib/apiClient";

export async function POST(request: NextRequest) {
    const body = await request.json().catch(() => null);
    if (!body || typeof body.email !== "string" || typeof body.password !== "string") {
        return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
        );
    }

    try {
        const response = await backendFetch(
        "/auth/login",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: body.email, password: body.password }),
        },
        false
        );

        const { accessToken } = (await response.json().catch(() => ({}))) as {
        accessToken?: string;
        };
        if (!accessToken) {
        console.error("Auth login proxy: backend response missing access token.");
        return NextResponse.json(
            { message: "Authentication response is missing an access token." },
            { status: 502 }
        );
        }

        const nextResponse = NextResponse.json({ success: true });
        nextResponse.cookies.set({
        name: "auth_token",
        value: accessToken,
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60,
        });

        console.debug("Auth login proxy: login succeeded for", body.email);
        return nextResponse;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        const statusCandidate = (error as { status?: unknown })?.status;
        const status = typeof statusCandidate === "number" ? statusCandidate : 500;

        return NextResponse.json({ message }, { status });
    }
}
