  "use client";

  import Link from "next/link";

  export function NavBar() {
    return (
      <header className="app-nav">
        <div className="app-nav__inner">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            chatApp
          </Link>

          <nav className="app-nav__links">
            <Link href="/friends">Friends</Link>
            <Link href="/conversations">Conversations</Link>
            <Link href="/settings">Settings</Link>
          </nav>

          <button className="app-nav__logout">Log out</button>
        </div>
      </header>
    );
  }
