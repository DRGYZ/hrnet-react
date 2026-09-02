import { describe, expect, it } from "vitest";
import { createEmployeeFixture } from "../test/fixtures";
import { employeeReducer, initialEmployeeState } from "./employeeReducer";
describe("employeeReducer", () => {
  it("adds an employee without mutating the existing state", () => {
    const employee = createEmployeeFixture();
    const nextState = employeeReducer(initialEmployeeState, {
      type: "employee/added",
      payload: employee,
    });
    expect(nextState.employees).toEqual([employee]);
    expect(initialEmployeeState.employees).toEqual([]);
  });
  it("replaces records with a copied array", () => {
    const employees = [createEmployeeFixture()];
    const nextState = employeeReducer(initialEmployeeState, {
      type: "employees/replaced",
      payload: employees,
    });
    expect(nextState.employees).toEqual(employees);
    expect(nextState.employees).not.toBe(employees);
  });
});
