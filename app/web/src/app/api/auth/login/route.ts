import { NextResponse, type NextRequest } from "next/server";

const API_BASE_URL =
    process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request: NextRequest) {
    if (!API_BASE_URL) {
        return NextResponse.json(
            { message: "API base URL is not configured." },
            { status: 500 }
        );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body.email !== "string" || typeof body.password !== "string") {
        return NextResponse.json(
            { message: "Email and password are required." },
            { status: 400 }
        );
    }

    let response: Response;
    try {
        response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: body.email, password: body.password }),
        });
    } catch {
        return NextResponse.json(
            { message: "Unable to reach authentication service." },
            { status: 502 }
        );
    }

    if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        return NextResponse.json(
            errorPayload ?? { message: "Authentication failed." },
            { status: response.status }
        );
    }

    const { accessToken } = (await response.json().catch(() => ({}))) as {
        accessToken?: string;
    };
    if (!accessToken) {
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
        maxAge: 60 * 60, // 1 hour
    });

    return nextResponse;
}
