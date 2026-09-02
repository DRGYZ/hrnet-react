import { createContext, useContext } from "react";
export const RouterContext = createContext(null);
export function useAppRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useAppRouter must be used inside RouterProvider");
  }
  return context;
}
