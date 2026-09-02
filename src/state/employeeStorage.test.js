import { describe, expect, it } from "vitest";
import { createEmployeeFixture } from "../test/fixtures";
import {
  EMPLOYEE_STORAGE_KEY,
  loadEmployees,
  saveEmployees,
} from "./employeeStorage";
function createStorage(initialValue = null) {
  let storedValue = initialValue;
  return {
    getItem: () => storedValue,
    setItem: (_key, value) => {
      storedValue = value;
    },
  };
}
describe("employee storage", () => {
  it("returns valid employee records", () => {
    const employee = createEmployeeFixture();
    const storage = createStorage(JSON.stringify([employee]));
    expect(loadEmployees(storage)).toEqual([employee]);
  });
  it("ignores malformed JSON and invalid records", () => {
    expect(loadEmployees(createStorage("not-json"))).toEqual([]);
    expect(loadEmployees(createStorage(JSON.stringify([{ id: 42 }])))).toEqual(
      [],
    );
  });
  it("serializes records under the versioned storage key", () => {
    const employee = createEmployeeFixture();
    let savedKey = "";
    let savedValue = "";
    const storage = {
      getItem: () => null,
      setItem: (key, value) => {
        savedKey = key;
        savedValue = value;
      },
    };
    expect(saveEmployees([employee], storage)).toBe(true);
    expect(savedKey).toBe(EMPLOYEE_STORAGE_KEY);
    expect(JSON.parse(savedValue)).toEqual([employee]);
  });
  it("reports storage write failures without crashing the UI", () => {
    const storage = {
      getItem: () => null,
      setItem: () => {
        throw new Error("Storage unavailable");
      },
    };
    expect(saveEmployees([createEmployeeFixture()], storage)).toBe(false);
  });
});
