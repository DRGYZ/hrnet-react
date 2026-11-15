import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AppContent } from "./App";
import { EMPLOYEE_STORAGE_KEY } from "./state/employeeStorage";

async function fillEmployee(user, firstName) {
  await user.type(screen.getByLabelText(/First name/), firstName);
  await user.type(screen.getByLabelText(/Last name/), "Morgan");
  fireEvent.change(screen.getByLabelText(/Date of birth/), { target: { value: "1998-04-12" } });
  fireEvent.change(screen.getByLabelText(/Start date/), { target: { value: "2026-08-03" } });
  await user.selectOptions(screen.getByLabelText(/Department/), "Engineering");
  await user.type(screen.getByLabelText(/Street/), "14 React Avenue");
  await user.type(screen.getByLabelText(/City/), "Paris");
  await user.selectOptions(screen.getByLabelText(/State/), "CA");
  await user.type(screen.getByLabelText(/ZIP code/), "94105");
}

describe("HRnet employee workflow", () => {
  it("creates an employee, confirms it, and displays the new table row", async () => {
    const user = userEvent.setup();
    render(<AppContent initialPath="/" />);
    await fillEmployee(user, "  Alex  ");
    await user.click(screen.getByRole("button", { name: "Create employee" }));
    expect(
      screen.getByRole("dialog", { name: "Employee created" }),
    ).toHaveTextContent("Alex Morgan");
    expect(JSON.parse(localStorage.getItem(EMPLOYEE_STORAGE_KEY))[0].firstName).toBe("Alex");
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

  it("rejects whitespace-only names and employment before birth", async () => {
    const user = userEvent.setup();
    render(<AppContent initialPath="/" />);
    await fillEmployee(user, "   ");
    const firstName = screen.getByLabelText(/First name/);
    const submit = screen.getByRole("button", { name: "Create employee" });
    await user.click(submit);
    expect(firstName.validity.patternMismatch).toBe(true);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.clear(firstName);
    await user.type(firstName, "Alex");
    const startDate = screen.getByLabelText(/Start date/);
    fireEvent.change(startDate, { target: { value: "1997-04-12" } });
    await user.click(submit);
    expect(startDate.validity.rangeUnderflow).toBe(true);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps the employee in the open app and reports a failed browser save", async () => {
    const user = userEvent.setup();
    const write = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Quota exceeded");
    });
    try {
      render(<AppContent initialPath="/" />);
      await fillEmployee(user, "Alex");
      await user.click(screen.getByRole("button", { name: "Create employee" }));
      expect(screen.getByRole("dialog")).toHaveTextContent("available until you leave or reload");
      await user.click(screen.getByRole("button", { name: "View employee list" }));
      expect(screen.getByRole("cell", { name: "Alex" })).toBeInTheDocument();
      expect(screen.getByRole("status")).toHaveTextContent("Browser storage is unavailable");
      expect(localStorage.getItem(EMPLOYEE_STORAGE_KEY)).toBeNull();
    } finally {
      write.mockRestore();
    }
  });

  it("shows scannable validation alerts and clears them as fields are fixed", async () => {
    const user = userEvent.setup();
    render(<AppContent initialPath="/" />);
    await fillEmployee(user, "   ");
    const firstName = screen.getByLabelText(/First name/);
    await user.click(screen.getByRole("button", { name: "Create employee" }));

    expect(
      screen.getByText(/1 field needs attention before saving/),
    ).toBeInTheDocument();
    expect(firstName).toHaveAttribute("aria-invalid", "true");
    expect(
      screen.getByText(/Enter a first name \(blank spaces are not allowed\)\./, {
        selector: ".field-error",
      }),
    ).toBeInTheDocument();

    await user.clear(firstName);
    await user.type(firstName, "Clara");
    expect(
      screen.queryByText(/fields? needs? attention before saving/),
    ).not.toBeInTheDocument();
    expect(firstName).not.toHaveAttribute("aria-invalid");
  });

  it("fills a fictional preset, confirms in modal, loads fictional roster, and locates the new record", async () => {
    const user = userEvent.setup();
    render(<AppContent initialPath="/" />);
    await user.click(
      screen.getByRole("button", { name: "Clara Moreau · Engineering" }),
    );
    await user.click(screen.getByRole("button", { name: "Create employee" }));

    const dialog = screen.getByRole("dialog", { name: "Employee created" });
    expect(dialog).toHaveTextContent("Clara Moreau");
    expect(dialog).toHaveTextContent("Engineering");
    expect(dialog).toHaveTextContent("10/15/2026");

    await user.click(
      screen.getByRole("button", { name: "View employee list" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Load fictional records" }),
    );
    expect(screen.getByText("13", { selector: ".record-count strong" })).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Find in directory" }),
    );
    expect(screen.getByRole("cell", { name: "Clara" })).toBeInTheDocument();
    expect(screen.queryByRole("cell", { name: "Mateo" })).not.toBeInTheDocument();
  });
});
