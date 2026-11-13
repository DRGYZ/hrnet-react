import { useMemo, useReducer, useRef, useState } from "react";
import { employeeReducer } from "./employeeReducer";
import { loadEmployees, saveEmployees } from "./employeeStorage";
import { EmployeeContext } from "./employeeStateContext";
function browserStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
function getInitialState() {
  return {
    employees: loadEmployees(browserStorage()),
  };
}
export function EmployeeProvider({ children }) {
  const [state, dispatch] = useReducer(
    employeeReducer,
    undefined,
    getInitialState,
  );
  const employeesRef = useRef(state.employees);
  const [storageAvailable, setStorageAvailable] = useState(() => browserStorage() !== null);
  const contextValue = useMemo(
    () => ({
      ...state,
      storageAvailable,
      addEmployee: (employee) => {
        const employees = [...employeesRef.current, employee];
        employeesRef.current = employees;
        setStorageAvailable(saveEmployees(employees, browserStorage()));
        dispatch({ type: "employee/added", payload: employee });
      },
    }),
    [state, storageAvailable],
  );
  return (
    <EmployeeContext.Provider value={contextValue}>
      {children}
    </EmployeeContext.Provider>
  );
}
