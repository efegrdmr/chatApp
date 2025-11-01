import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.API_BASE_URL;

export async function GET(request: Request) {

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
        return NextResponse.json(
            { message: "Authentication token is missing." },
            { status: 401 }
        );
    }

    if (!API_URL) {
        return NextResponse.json(
            { message: "API base URL is not configured." },
            { status: 500 }
        );
    }

    let upstream: Response;
    try {
        upstream = await fetch(`${API_URL}/friendship/friends`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });
    } catch {
        console.error("Friendship proxy: network error fetching friends.");
        return NextResponse.json(
            { message: "Unable to reach friendship service." },
            { status: 502 }
        );
    }

    if (!upstream.ok) {
        console.warn(
            "Friendship proxy: backend returned error status",
            upstream.status
        );
        return NextResponse.json({ message: "Failed to fetch friends." }, { status: upstream.status });
    }

    const payload = await upstream.json().catch(() => ({}));
    console.debug("Friendship proxy: returning friends payload", payload);
    return NextResponse.json(payload);
}
