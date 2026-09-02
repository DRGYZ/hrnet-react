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
    city: "Arlington",
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
