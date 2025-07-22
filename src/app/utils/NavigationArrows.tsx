"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function NavigationArrows() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const historyStack = useRef<string[]>([]);
  const forwardStack = useRef<string[]>([]);
  const currentPath = useRef<string>("");

  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    const path = pathname + (searchParams ? `?${searchParams.toString()}` : "");
    currentPath.current = path;

    if (
      historyStack.current.length === 0 ||
      historyStack.current[historyStack.current.length - 1] !== path
    ) {
      historyStack.current.push(path);
      forwardStack.current = [];
    }

    setCanGoBack(historyStack.current.length > 1);
    setCanGoForward(forwardStack.current.length > 0);
  }, [pathname, searchParams]);

  const goBack = () => {
    if (canGoBack) {
      const current = historyStack.current.pop(); // remove current path
      if (current) forwardStack.current.push(current); // add to forward stack
      const previous = historyStack.current[historyStack.current.length - 1];
      if (previous) {
        router.push(previous);
        setCanGoBack(historyStack.current.length > 1);
        setCanGoForward(forwardStack.current.length > 0);
      }
    } else {
      router.back();
    }
  };

  const goForward = () => {
    if (canGoForward) {
      const next = forwardStack.current.pop();
      if (next) {
        historyStack.current.push(next);
        router.push(next);
        setCanGoBack(historyStack.current.length > 1);
        setCanGoForward(forwardStack.current.length > 0);
      }
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <span
        title={canGoBack ? "Go Back" : "No Back History"}
        className={`cursor-pointer ${canGoBack ? "" : "pointer-events-none"}`}
        onClick={goBack}
      >
        <ArrowLeft size={24} color={canGoBack ? "white" : "gray"} />
      </span>

      <span
        title={canGoForward ? "Go Forward" : "No Forward History"}
        className={`cursor-pointer ${canGoForward ? "" : "pointer-events-none"}`}
        onClick={goForward}
      >
        <ArrowRight size={24} color={canGoForward ? "white" : "gray"} />
      </span>
    </div>
  );
}
