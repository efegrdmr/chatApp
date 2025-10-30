"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => ({
                    message: "Failed to sign in.",
                }));
                setError(payload?.message ?? "Failed to sign in.");
                setIsSubmitting(false);
                return;
            }

            router.push("/");
            router.refresh();
        } catch {
            setError("Unexpected error while signing in.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-12 dark:bg-black">
            <div className="w-full max-w-md rounded-2xl bg-white p-10 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-700">
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    Welcome back
                </h1>
                <form className="space-y-6 py-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="block text-lg font-medium text-zinc-700 dark:text-zinc-300"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="block text-lg font-medium text-zinc-700 dark:text-zinc-300"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                    {error && (
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    )}
                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="primary-button"
                        >
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </button>
                    </div>
                    <p className="text-right text-sm text-zinc-500 dark:text-zinc-400">
                        No account?{" "}
                        <Link
                            href="/register"
                            className="font-medium text-black underline hover:text-zinc-800 dark:text-white dark:hover:text-zinc-200"
                        >
                            Register
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
