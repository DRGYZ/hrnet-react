export const initialEmployeeState = {
  employees: [],
};
export function employeeReducer(state, action) {
  switch (action.type) {
    case "employee/added":
      return {
        ...state,
        employees: [...state.employees, action.payload],
      };
    case "employees/replaced":
      return {
        ...state,
        employees: [...action.payload],
      };
    default:
      return state;
  }
}
