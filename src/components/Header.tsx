"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  // Simulated auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Scroll-based show/hide
    const handleScroll = () => {
      const currentY = window.scrollY;
      setShowHeader(currentY < lastScrollY || currentY < 50);
      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    // Simulate auth state (you'd use real auth in production)
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setMenuOpen(false);
    router.push("/auth/logout");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 shadow-md ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      } bg-green-900`}
    >
      <div className="relative flex items-center justify-between p-4 max-w-screen-md mx-auto">
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src="/icons/predict.png" alt="Logo" className="w-8 h-8" />
        </div>

        <div className="flex-1" />

        <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="bg-green-900 border-t border-green-800">
          <ul className="flex flex-col p-4 space-y-2 text-sm">
            {!isLoggedIn ? (
              <>
                <li className="mb-[20px]">
                  <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                    Login
                  </Link>
                </li>
                <li className="mb-[20px]">
                  <Link
                    href="/auth/register"
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <li className="mb-[20px]">
                <button onClick={handleLogout} className="text-left w-full">
                  Logout
                </button>
              </li>
            )}
            <li className="mb-[20px]">
              <Link href="/league-table" onClick={() => setMenuOpen(false)}>
                EPL Table
              </Link>
            </li>
            <li className="mb-[20px]">
              <Link href="/calendar" onClick={() => setMenuOpen(false)}>
                Fixture Calendar
              </Link>
            </li>
            <li className="mb-[20px]">
              <Link href="/leaderboard" onClick={() => setMenuOpen(false)}>
                Leaderboard
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
