import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-12 dark:bg-black">
            <div className="w-full max-w-md rounded-2xl bg-white p-10 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-700">
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    Welcome back
                </h1>
                <form className="space-y-6 py-4" action="#" method="post">
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
                            placeholder="Enter your password"
                            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 shadow-sm transition hover:border-zinc-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-white dark:focus:ring-white"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full rounded-xl bg-black px-6 py-3 text-base font-medium text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-black dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 dark:focus:ring-white"
                        >
                            Sign in
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