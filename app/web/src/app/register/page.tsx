"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors([]);
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, username, password }),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => null);
                const collectedErrors: string[] = [];

                if (payload && typeof payload.message === "string") {
                    collectedErrors.push(payload.message);
                }

                if (payload && Array.isArray(payload.errors)) {
                    for (const error of payload.errors) {
                        if (error && typeof error.description === "string") {
                            collectedErrors.push(error.description);
                        }
                    }
                }

                if (!collectedErrors.length) {
                    collectedErrors.push("Failed to create account.");
                }

                setErrors(collectedErrors);
                setIsSubmitting(false);
                return;
            }

            router.push("/");
            router.refresh();
        } catch {
            setErrors(["Unexpected error while creating account."]);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-12 dark:bg-black">
            <div className="w-full max-w-md rounded-2xl bg-white p-10 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-700">
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    Create your account
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
                            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 shadow-sm transition hover:border-zinc-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-white dark:focus:ring-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label
                            htmlFor="username"
                            className="block text-lg font-medium text-zinc-700 dark:text-zinc-300"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Pick a username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            required
                            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 shadow-sm transition hover:border-zinc-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-white dark:focus:ring-white"
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
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 shadow-sm transition hover:border-zinc-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-white dark:focus:ring-white"
                        />
                    </div>
                    {errors.length > 0 && (
                        <ul className="space-y-1 text-sm text-red-600 dark:text-red-400">
                            {errors.map((errorMessage) => (
                                <li key={errorMessage}>{errorMessage}</li>
                            ))}
                        </ul>
                    )}
                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-xl bg-black px-6 py-3 text-base font-medium text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-black disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 dark:focus:ring-white"
                        >
                            {isSubmitting ? "Creating account..." : "Create account"}
                        </button>
                    </div>
                    <p className="text-right text-sm text-zinc-500 dark:text-zinc-400">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-medium text-black underline hover:text-zinc-800 dark:text-white dark:hover:text-zinc-200"
                        >
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
