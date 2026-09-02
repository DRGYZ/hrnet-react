import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AppContent } from "./App";
describe("HRnet employee workflow", () => {
  it("creates an employee, confirms it, and displays the new table row", async () => {
    const user = userEvent.setup();
    render(<AppContent initialPath="/" />);
    await user.type(screen.getByLabelText(/First name/), "Alex");
    await user.type(screen.getByLabelText(/Last name/), "Morgan");
    fireEvent.change(screen.getByLabelText(/Date of birth/), {
      target: { value: "1998-04-12" },
    });
    fireEvent.change(screen.getByLabelText(/Start date/), {
      target: { value: "2026-08-03" },
    });
    await user.selectOptions(
      screen.getByLabelText(/Department/),
      "Engineering",
    );
    await user.type(screen.getByLabelText(/Street/), "14 React Avenue");
    await user.type(screen.getByLabelText(/City/), "Paris");
    await user.selectOptions(screen.getByLabelText(/State/), "CA");
    await user.type(screen.getByLabelText(/ZIP code/), "94105");
    await user.click(screen.getByRole("button", { name: "Create employee" }));
    expect(
      screen.getByRole("dialog", { name: "Employee created" }),
    ).toHaveTextContent("Alex Morgan");
    await user.click(
      screen.getByRole("button", { name: "View employee list" }),
    );
    expect(
      screen.getByRole("heading", { name: "Current employees" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Alex" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Morgan" })).toBeInTheDocument();
    expect(
      screen.getByText(/employee/, { selector: ".record-count" }),
    ).toBeInTheDocument();
  });
});
