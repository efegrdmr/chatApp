import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete("auth_token");
    return res;
}