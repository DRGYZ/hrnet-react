import { useMemo, useReducer, useRef, useState } from "react";
import { fictionalEmployees } from "../data/fictionalEmployees";
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
  const [lastCreatedEmployee, setLastCreatedEmployee] = useState(null);
  const contextValue = useMemo(
    () => ({
      ...state,
      storageAvailable,
      lastCreatedEmployee,
      addEmployee: (employee) => {
        const employees = [...employeesRef.current, employee];
        employeesRef.current = employees;
        setStorageAvailable(saveEmployees(employees, browserStorage()));
        setLastCreatedEmployee(employee);
        dispatch({ type: "employee/added", payload: employee });
      },
      loadFictionalEmployees: () => {
        const existingIds = new Set(employeesRef.current.map((employee) => employee.id));
        const additions = fictionalEmployees.filter((employee) => !existingIds.has(employee.id));
        if (additions.length === 0) {
          return;
        }
        const employees = [...employeesRef.current, ...additions];
        employeesRef.current = employees;
        setStorageAvailable(saveEmployees(employees, browserStorage()));
        dispatch({ type: "employees/replaced", payload: employees });
      },
    }),
    [lastCreatedEmployee, state, storageAvailable],
  );
  return (
    <EmployeeContext.Provider value={contextValue}>
      {children}
    </EmployeeContext.Provider>
  );
}
