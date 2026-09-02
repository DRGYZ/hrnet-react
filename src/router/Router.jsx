import { useCallback, useEffect, useMemo, useState } from "react";
import { RouterContext, useAppRouter } from "./routerContext";
function normalizePath(pathname) {
  return pathname === "/employees" ? "/employees" : "/";
}
export function RouterProvider({ children, initialPath }) {
  const [path, setPath] = useState(() => {
    if (initialPath !== undefined || typeof window === "undefined") {
      return initialPath ?? "/";
    }
    return normalizePath(window.location.pathname);
  });
  useEffect(() => {
    if (initialPath !== undefined || typeof window === "undefined") {
      return;
    }
    const handlePopState = () => {
      setPath(normalizePath(window.location.pathname));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [initialPath]);
  const navigate = useCallback(
    (nextPath, options) => {
      setPath(nextPath);
      if (initialPath === undefined && typeof window !== "undefined") {
        if (options?.replace) {
          window.history.replaceState(null, "", nextPath);
        } else {
          window.history.pushState(null, "", nextPath);
        }
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    },
    [initialPath],
  );
  const contextValue = useMemo(() => ({ path, navigate }), [navigate, path]);
  return (
    <RouterContext.Provider value={contextValue}>
      {children}
    </RouterContext.Provider>
  );
}
export function AppLink({ to, children, className, activeClassName }) {
  const { path, navigate } = useAppRouter();
  const isActive = path === to;
  const resolvedClassName = [className, isActive ? activeClassName : undefined]
    .filter(Boolean)
    .join(" ");
  const handleClick = (event) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    navigate(to);
  };
  return (
    <a
      href={to}
      className={resolvedClassName || undefined}
      aria-current={isActive ? "page" : undefined}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
