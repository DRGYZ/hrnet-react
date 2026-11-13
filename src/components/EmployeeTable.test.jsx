import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { RouterProvider } from "../router/Router";
import { createEmployeeFixture } from "../test/fixtures";
import { EmployeeTable } from "./EmployeeTable";
const employees = [
  createEmployeeFixture(),
  createEmployeeFixture({
    id: "employee-2",
    firstName: "Grace",
    lastName: "Hopper",
    department: "Engineering",
    city: "Montréal",
  }),
  createEmployeeFixture({
    id: "employee-3",
    firstName: "Alan",
    lastName: "Turing",
    department: "Research",
    city: "Manchester",
  }),
];
describe("EmployeeTable", () => {
  it("shows a create action when no records exist", () => {
    render(
      <RouterProvider initialPath="/employees">
        <EmployeeTable employees={[]} />
      </RouterProvider>,
    );
    expect(
      screen.getByRole("heading", { name: "No employee records yet" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Create employee" }),
    ).toHaveAttribute("href", "/");
  });
  it("filters across visible employee fields", async () => {
    const user = userEvent.setup();
    render(
      <RouterProvider initialPath="/employees">
        <EmployeeTable employees={employees} />
      </RouterProvider>,
    );
    await user.type(screen.getByRole("searchbox"), "Manchester");
    expect(screen.getByRole("cell", { name: "Alan" })).toBeInTheDocument();
    expect(screen.queryByRole("cell", { name: "Ada" })).not.toBeInTheDocument();
  });
  it("finds accented names and dates as they appear in the directory", async () => {
    const user = userEvent.setup();
    render(
      <RouterProvider initialPath="/employees">
        <EmployeeTable employees={[
          createEmployeeFixture({ city: "Montréal", startDate: "2024-02-01" }),
          employees[2],
        ]} />
      </RouterProvider>,
    );
    const search = screen.getByRole("searchbox");
    await user.type(search, "montreal");
    expect(screen.getByRole("cell", { name: "Montréal" })).toBeInTheDocument();
    expect(screen.queryByRole("cell", { name: "Alan" })).not.toBeInTheDocument();
    await user.clear(search);
    await user.type(search, "02/01/2024");
    expect(screen.getByRole("cell", { name: "Montréal" })).toBeInTheDocument();
    expect(screen.queryByRole("cell", { name: "Alan" })).not.toBeInTheDocument();
  });
  it("sorts a selected column in both directions", async () => {
    const user = userEvent.setup();
    render(
      <RouterProvider initialPath="/employees">
        <EmployeeTable employees={employees} />
      </RouterProvider>,
    );
    const firstNameHeader = screen.getByRole("button", { name: /First name/ });
    await user.click(firstNameHeader);
    let rows = screen.getAllByRole("row").slice(1);
    expect(within(rows[0]).getByText("Ada")).toBeInTheDocument();
    expect(within(rows[2]).getByText("Grace")).toBeInTheDocument();
    await user.click(firstNameHeader);
    rows = screen.getAllByRole("row").slice(1);
    expect(within(rows[0]).getByText("Grace")).toBeInTheDocument();
    expect(within(rows[2]).getByText("Ada")).toBeInTheDocument();
  });
});
