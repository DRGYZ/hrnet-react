export const EMPLOYEE_STORAGE_KEY = "hrnet.employees.v1";
const employeeStringFields = [
  "id",
  "firstName",
  "lastName",
  "dateOfBirth",
  "startDate",
  "department",
  "street",
  "city",
  "state",
  "zipCode",
  "createdAt",
];
function isEmployee(value) {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value;
  return employeeStringFields.every(
    (field) => typeof candidate[field] === "string",
  );
}
export function loadEmployees(storage) {
  try {
    const storedValue = storage.getItem(EMPLOYEE_STORAGE_KEY);
    if (!storedValue) {
      return [];
    }
    const parsed = JSON.parse(storedValue);
    return Array.isArray(parsed) ? parsed.filter(isEmployee) : [];
  } catch {
    return [];
  }
}
export function saveEmployees(employees, storage) {
  try {
    storage.setItem(EMPLOYEE_STORAGE_KEY, JSON.stringify(employees));
    return true;
  } catch {
    return false;
  }
}
