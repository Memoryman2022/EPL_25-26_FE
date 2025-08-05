"use client";

import { useUser } from "@/app/auth/components/Context";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import NavigationArrows from "@/app/utils/NavigationArrows";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  const { user, setUser } = useUser();

  // Scroll show/hide header logic (keep as you had it)
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setShowHeader(currentY < lastScrollY || currentY < 50);
      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Instead of isLoggedIn state, use presence of user object
  // If you want to keep sync with localStorage token, do it in login/logout functions

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null); // clear user context on logout
    setMenuOpen(false);
    router.push("/auth/login"); // redirect to login after logout
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 shadow-md ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      } bg-black`}
    >
      <div className="relative flex items-center justify-between p-4 max-w-screen-md mx-auto">
        {/* Arrows container */}
        <div className="absolute left-4">
          <NavigationArrows />
        </div>

        {/* Logo centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src="/icons/predict.png" alt="Logo" className="w-8 h-8" />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Burger menu */}
        <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="bg-black border-t border-green-200">
          <ul className="flex flex-col p-4 space-y-2 text-sm">
            {!user ? (
              <>
                <li className="mb-[20px]">
                  <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                    Login
                  </Link>
                </li>
                <li className="mb-[20px]">
                  <Link href="/auth/register" onClick={() => setMenuOpen(false)}>
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="mb-[20px]">
                  <button onClick={handleLogout} className="text-left w-full">
                    Logout
                  </button>
                </li>
                <li className="mb-[20px]">
                  <Link href="/profile" onClick={() => setMenuOpen(false)}>
                    {user.email}'s Profile
                  </Link>
                </li>
              </>
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
