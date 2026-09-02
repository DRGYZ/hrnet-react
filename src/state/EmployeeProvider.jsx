import { useEffect, useMemo, useReducer } from "react";
import { employeeReducer } from "./employeeReducer";
import { loadEmployees, saveEmployees } from "./employeeStorage";
import { EmployeeContext } from "./employeeStateContext";
function getInitialState() {
  return {
    employees:
      typeof window === "undefined" ? [] : loadEmployees(window.localStorage),
  };
}
export function EmployeeProvider({ children }) {
  const [state, dispatch] = useReducer(
    employeeReducer,
    undefined,
    getInitialState,
  );
  useEffect(() => {
    saveEmployees(state.employees, window.localStorage);
  }, [state.employees]);
  const contextValue = useMemo(
    () => ({
      ...state,
      addEmployee: (employee) => {
        dispatch({ type: "employee/added", payload: employee });
      },
    }),
    [state],
  );
  return (
    <EmployeeContext.Provider value={contextValue}>
      {children}
    </EmployeeContext.Provider>
  );
}
