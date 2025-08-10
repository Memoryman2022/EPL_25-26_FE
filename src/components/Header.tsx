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

  const { user, setUser, authLoaded } = useUser(); // <-- NEW

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setShowHeader(currentY < lastScrollY || currentY < 50);
      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    setUser(null);
    setMenuOpen(false);
    router.push("/auth/login");
  };

  // ✅ Don't render anything auth-dependent until auth is loaded
  if (!authLoaded) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 shadow-md ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      } bg-black`}
    >
      <div className="relative flex items-center justify-between p-4 max-w-screen-md mx-auto">
        <div className="absolute left-4">
          <NavigationArrows />
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src="/icons/predict.png" alt="Logo" className="w-8 h-8" />
        </div>

        <div className="flex-1" />

        <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="bg-gray-800 border-t border-green-200">
          <ul className="flex flex-col p-4 space-y-2 text-sm">
            {!user ? (
              <>
                <li className="mb-[20px]">
                  <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                    Login
                  </Link>
                </li>
                <li className="">
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
                    Profile
                  </Link>
                </li>
              </>
            )}

            {user && (
              <>
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
                <li>
                  <Link href="/leaderboard" onClick={() => setMenuOpen(false)}>
                    Leaderboard
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
