import { useRef, useState } from "react";
import { useAppRouter } from "../router/routerContext";
import { Modal } from "@drgyz/hrnet-accessible-modal";
import "@drgyz/hrnet-accessible-modal/style.css";
import { DateInput } from "../components/DateInput";
import { SelectInput } from "../components/SelectInput";
import { TextInput } from "../components/TextInput";
import { departments } from "../data/departments";
import { states } from "../data/states";
import { useEmployees } from "../state/employeeStateContext";
import { getLocalDateInputValue } from "../utils/date";
const departmentOptions = departments.map((department) => ({
  label: department,
  value: department,
}));
const initialForm = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  startDate: "",
  department: departments[0],
  street: "",
  city: "",
  state: states[0].value,
  zipCode: "",
};
function createEmployee(form) {
  return {
    ...form,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
}
export function CreateEmployeePage() {
  const [form, setForm] = useState(initialForm);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [createdEmployeeName, setCreatedEmployeeName] = useState("");
  const viewListButtonRef = useRef(null);
  const { addEmployee } = useEmployees();
  const { navigate } = useAppRouter();
  const today = getLocalDateInputValue();
  const updateField = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) {
      return;
    }
    const employee = createEmployee(form);
    addEmployee(employee);
    setCreatedEmployeeName(`${employee.firstName} ${employee.lastName}`);
    setForm(initialForm);
    setIsConfirmationOpen(true);
  };
  return (
    <>
      <section className="page-heading create-heading">
        <div>
          <p className="eyebrow">People operations</p>
          <h1>Create employee</h1>
          <p className="page-intro">
            Add a new team member to the WealthHealth employee directory.
          </p>
        </div>
        <div className="heading-note">
          <strong>Required fields</strong>
          <span>Fields marked with * must be completed.</span>
        </div>
      </section>

      <form className="employee-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>
            <span>01</span>
            Personal information
          </legend>
          <div className="form-grid">
            <TextInput
              id="first-name"
              label="First name"
              value={form.firstName}
              onChange={(value) => updateField("firstName", value)}
              autoComplete="given-name"
              maxLength={80}
              required
            />
            <TextInput
              id="last-name"
              label="Last name"
              value={form.lastName}
              onChange={(value) => updateField("lastName", value)}
              autoComplete="family-name"
              maxLength={80}
              required
            />
            <DateInput
              id="date-of-birth"
              label="Date of birth"
              value={form.dateOfBirth}
              onChange={(value) => updateField("dateOfBirth", value)}
              max={today}
              required
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <span>02</span>
            Employment details
          </legend>
          <div className="form-grid form-grid-two">
            <DateInput
              id="start-date"
              label="Start date"
              value={form.startDate}
              onChange={(value) => updateField("startDate", value)}
              required
            />
            <SelectInput
              id="department"
              label="Department"
              value={form.department}
              options={departmentOptions}
              onChange={(value) => updateField("department", value)}
              required
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <span>03</span>
            Address
          </legend>
          <div className="form-grid">
            <div className="form-span-two">
              <TextInput
                id="street"
                label="Street"
                value={form.street}
                onChange={(value) => updateField("street", value)}
                autoComplete="street-address"
                maxLength={120}
                required
              />
            </div>
            <TextInput
              id="city"
              label="City"
              value={form.city}
              onChange={(value) => updateField("city", value)}
              autoComplete="address-level2"
              maxLength={80}
              required
            />
            <SelectInput
              id="state"
              label="State"
              value={form.state}
              options={states}
              onChange={(value) => updateField("state", value)}
              required
            />
            <TextInput
              id="zip-code"
              label="ZIP code"
              value={form.zipCode}
              onChange={(value) => updateField("zipCode", value)}
              autoComplete="postal-code"
              inputMode="numeric"
              pattern="[0-9]{5}(-[0-9]{4})?"
              maxLength={10}
              required
            />
          </div>
        </fieldset>

        <div className="form-actions">
          <p>Your employee record is stored only in this browser.</p>
          <button className="button button-primary" type="submit">
            Create employee
          </button>
        </div>
      </form>

      <Modal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        title="Employee created"
        initialFocusRef={viewListButtonRef}
      >
        <p>
          <strong>{createdEmployeeName}</strong> was added to the HRnet employee
          directory.
        </p>
        <div className="modal-actions">
          <button
            className="button button-secondary"
            type="button"
            onClick={() => setIsConfirmationOpen(false)}
          >
            Create another
          </button>
          <button
            ref={viewListButtonRef}
            className="button button-primary"
            type="button"
            onClick={() => {
              setIsConfirmationOpen(false);
              navigate("/employees");
            }}
          >
            View employee list
          </button>
        </div>
      </Modal>
    </>
  );
}
