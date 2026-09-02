import { createContext, useContext } from "react";
export const EmployeeContext = createContext(null);
export function useEmployees() {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useEmployees must be used inside EmployeeProvider");
  }
  return context;
}
