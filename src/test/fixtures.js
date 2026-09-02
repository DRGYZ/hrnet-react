export function createEmployeeFixture(overrides = {}) {
  return {
    id: "employee-1",
    firstName: "Ada",
    lastName: "Lovelace",
    dateOfBirth: "1815-12-10",
    startDate: "2020-01-15",
    department: "Engineering",
    street: "1 Analytical Engine Way",
    city: "London",
    state: "CA",
    zipCode: "94105",
    createdAt: "2026-08-03T12:00:00.000Z",
    ...overrides,
  };
}
