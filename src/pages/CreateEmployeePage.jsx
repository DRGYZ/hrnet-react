import { useRef, useState } from "react";
import { useAppRouter } from "../router/routerContext";
import { Modal } from "@drgyz/hrnet-accessible-modal";
import "@drgyz/hrnet-accessible-modal/style.css";
import { DateInput } from "../components/DateInput";
import { SelectInput } from "../components/SelectInput";
import { TextInput } from "../components/TextInput";
import { departments } from "../data/departments";
import { fictionalDraftPresets } from "../data/fictionalEmployees";
import { states } from "../data/states";
import { useEmployees } from "../state/employeeStateContext";
import { formatDate, getLocalDateInputValue } from "../utils/date";

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

const fieldMeta = {
  firstName: { id: "first-name", label: "First name" },
  lastName: { id: "last-name", label: "Last name" },
  dateOfBirth: { id: "date-of-birth", label: "Date of birth" },
  startDate: { id: "start-date", label: "Start date" },
  department: { id: "department", label: "Department" },
  street: { id: "street", label: "Street" },
  city: { id: "city", label: "City" },
  state: { id: "state", label: "State" },
  zipCode: { id: "zip-code", label: "ZIP code" },
};

const zipCodePattern = /^[0-9]{5}(-[0-9]{4})?$/;

function validateForm(form, today) {
  const errors = {};
  if (!form.firstName.trim()) {
    errors.firstName = "Enter a first name (blank spaces are not allowed).";
  }
  if (!form.lastName.trim()) {
    errors.lastName = "Enter a last name.";
  }
  if (!form.dateOfBirth) {
    errors.dateOfBirth = "Select a date of birth.";
  } else if (form.dateOfBirth > today) {
    errors.dateOfBirth = `Date of birth cannot be after ${formatDate(today)}.`;
  }
  if (!form.startDate) {
    errors.startDate = "Select an employment start date.";
  } else if (form.dateOfBirth && form.startDate < form.dateOfBirth) {
    errors.startDate = `Start date must be on or after birth date (${formatDate(form.dateOfBirth)}).`;
  }
  if (!form.department) {
    errors.department = "Select a department.";
  }
  if (!form.street.trim()) {
    errors.street = "Enter a street address.";
  }
  if (!form.city.trim()) {
    errors.city = "Enter a city.";
  }
  if (!form.state) {
    errors.state = "Select a state.";
  }
  if (!zipCodePattern.test(form.zipCode.trim())) {
    errors.zipCode = "Enter a 5-digit ZIP code (94105) or ZIP+4 (94105-1234).";
  }
  return errors;
}

function createEmployee(form) {
  return {
    ...form,
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    street: form.street.trim(),
    city: form.city.trim(),
    zipCode: form.zipCode.trim(),
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
}

function isSectionReady(fields, form, errors, today) {
  const formErrors = validateForm(form, today);
  return fields.every((field) => !formErrors[field] && !errors[field]);
}

export function CreateEmployeePage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [createdEmployee, setCreatedEmployee] = useState(null);
  const viewListButtonRef = useRef(null);
  const { addEmployee, storageAvailable } = useEmployees();
  const { navigate } = useAppRouter();
  const today = getLocalDateInputValue();

  const liveValidationErrors = validateForm(form, today);
  const completedFieldsCount = Object.keys(fieldMeta).length - Object.keys(liveValidationErrors).length;
  const errorEntries = Object.entries(errors);

  const updateField = (field, value) => {
    const nextForm = { ...form, [field]: value };
    setForm(nextForm);
    if (hasSubmitted || Object.keys(errors).length > 0) {
      setErrors(validateForm(nextForm, today));
    }
  };

  const applyPreset = (presetValues) => {
    setForm(presetValues);
    setErrors({});
    setHasSubmitted(false);
  };

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
    setHasSubmitted(false);
  };

  const focusField = (fieldKey) => {
    const elementId = fieldMeta[fieldKey]?.id;
    const element = elementId ? document.getElementById(elementId) : null;
    if (element) {
      element.focus();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setHasSubmitted(true);
    const nextErrors = validateForm(form, today);
    setErrors(nextErrors);
    const nativeValid = event.currentTarget.checkValidity();
    if (!nativeValid || Object.keys(nextErrors).length > 0) {
      const firstInvalidKey = Object.keys(nextErrors)[0];
      if (firstInvalidKey) {
        focusField(firstInvalidKey);
      }
      return;
    }
    const employee = createEmployee(form);
    addEmployee(employee);
    setCreatedEmployee(employee);
    setForm(initialForm);
    setErrors({});
    setHasSubmitted(false);
    setIsConfirmationOpen(true);
  };

  const firstInitial = (form.firstName.trim()[0] || "W").toUpperCase();
  const lastInitial = (form.lastName.trim()[0] || "H").toUpperCase();
  const previewName =
    form.firstName.trim() || form.lastName.trim()
      ? `${form.firstName.trim() || "First"} ${form.lastName.trim() || "Last"}`
      : "New employee dossier";

  const isDirty = Boolean(
    form.firstName ||
      form.lastName ||
      form.dateOfBirth ||
      form.startDate ||
      form.street ||
      form.city ||
      form.zipCode,
  );

  const personalReady = isSectionReady(["firstName", "lastName", "dateOfBirth"], form, errors, today);
  const employmentReady = isSectionReady(["startDate", "department"], form, errors, today);
  const addressReady = isSectionReady(["street", "city", "state", "zipCode"], form, errors, today);

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
          <span>Fields marked with * must be completed. Invalid inputs appear below each field.</span>
        </div>
      </section>

      <div className="preset-bar" aria-label="Fictional test record presets">
        <span className="preset-label">Sample fictional entries</span>
        <div className="preset-actions">
          {fictionalDraftPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="preset-chip"
              onClick={() => applyPreset(preset.values)}
            >
              {preset.label}
            </button>
          ))}
          {isDirty ? (
            <button
              type="button"
              className="preset-chip preset-chip-clear"
              onClick={resetForm}
            >
              Clear form
            </button>
          ) : null}
        </div>
      </div>

      {errorEntries.length > 0 ? (
        <div className="validation-summary" role="alert" aria-labelledby="validation-summary-title">
          <div className="validation-summary-header">
            <strong id="validation-summary-title">
              {errorEntries.length} {errorEntries.length === 1 ? "field needs" : "fields need"} attention before saving
            </strong>
            <span>Select a field below to jump directly to it and correct the entry.</span>
          </div>
          <ul className="validation-summary-list">
            {errorEntries.map(([fieldKey, message]) => (
              <li key={fieldKey}>
                <button
                  type="button"
                  className="validation-jump-button"
                  onClick={() => focusField(fieldKey)}
                >
                  <strong>{fieldMeta[fieldKey]?.label}:</strong> {message}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="create-workspace">
        <form className="employee-form" onSubmit={handleSubmit} noValidate>
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
                hint="Required non-blank name."
                error={errors.firstName}
                required
              />
              <TextInput
                id="last-name"
                label="Last name"
                value={form.lastName}
                onChange={(value) => updateField("lastName", value)}
                autoComplete="family-name"
                maxLength={80}
                hint="Family name used for sorting."
                error={errors.lastName}
                required
              />
              <DateInput
                id="date-of-birth"
                label="Date of birth"
                value={form.dateOfBirth}
                onChange={(value) => updateField("dateOfBirth", value)}
                max={today}
                hint="Today or earlier."
                error={errors.dateOfBirth}
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
                min={form.dateOfBirth || undefined}
                hint={
                  form.dateOfBirth
                    ? `On or after ${formatDate(form.dateOfBirth)}.`
                    : "Must be on or after birth date."
                }
                error={errors.startDate}
                required
              />
              <SelectInput
                id="department"
                label="Department"
                value={form.department}
                options={departmentOptions}
                onChange={(value) => updateField("department", value)}
                hint="Primary WealthHealth team."
                error={errors.department}
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
                  hint="Street number and name."
                  error={errors.street}
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
                hint="Accented characters supported."
                error={errors.city}
                required
              />
              <SelectInput
                id="state"
                label="State"
                value={form.state}
                options={states}
                onChange={(value) => updateField("state", value)}
                hint="US state or territory."
                error={errors.state}
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
                hint="5 digits (94105) or ZIP+4."
                error={errors.zipCode}
                required
              />
            </div>
          </fieldset>

          <div className="form-actions">
            {storageAvailable ? (
              <p>Employee records are saved in this browser.</p>
            ) : (
              <p role="status">
                Browser storage is unavailable. New records last until you leave or reload the app.
              </p>
            )}
            <button className="button button-primary" type="submit">
              Create employee
            </button>
          </div>
        </form>

        <aside className="dossier-card" aria-label="Employee dossier preview">
          <div className="dossier-card-header">
            <span className="dossier-kicker">Live dossier</span>
            <span className="dossier-progress">{completedFieldsCount} / 9 ready</span>
          </div>

          <div className="dossier-identity">
            <span className="dossier-avatar" aria-hidden="true">
              {firstInitial}
              {lastInitial}
            </span>
            <div className="dossier-identity-text">
              <strong>{previewName}</strong>
              <span className="department-badge" data-department={form.department}>
                {form.department}
              </span>
            </div>
          </div>

          <dl className="dossier-meta">
            <div>
              <dt>Start date</dt>
              <dd>{form.startDate ? formatDate(form.startDate) : "MM/DD/YYYY"}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{form.city.trim() ? `${form.city.trim()}, ${form.state}` : form.state}</dd>
            </div>
          </dl>

          <ul className="dossier-checklist" aria-label="Section readiness">
            <li>
              <button type="button" onClick={() => focusField("firstName")}>
                <span>01 Personal information</span>
                <span className={personalReady ? "check-pill is-ready" : "check-pill"}>
                  {personalReady ? "Ready" : "Pending"}
                </span>
              </button>
            </li>
            <li>
              <button type="button" onClick={() => focusField("startDate")}>
                <span>02 Employment details</span>
                <span className={employmentReady ? "check-pill is-ready" : "check-pill"}>
                  {employmentReady ? "Ready" : "Pending"}
                </span>
              </button>
            </li>
            <li>
              <button type="button" onClick={() => focusField("street")}>
                <span>03 Address</span>
                <span className={addressReady ? "check-pill is-ready" : "check-pill"}>
                  {addressReady ? "Ready" : "Pending"}
                </span>
              </button>
            </li>
          </ul>
        </aside>
      </div>

      <Modal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        title="Employee created"
        initialFocusRef={viewListButtonRef}
      >
        <p>
          <strong>
            {createdEmployee
              ? `${createdEmployee.firstName} ${createdEmployee.lastName}`
              : ""}
          </strong>{" "}
          was added to the HRnet employee directory.
        </p>
        {createdEmployee ? (
          <dl className="modal-summary">
            <div>
              <dt>Department</dt>
              <dd>{createdEmployee.department}</dd>
            </div>
            <div>
              <dt>Start date</dt>
              <dd>{formatDate(createdEmployee.startDate)}</dd>
            </div>
          </dl>
        ) : null}
        {!storageAvailable ? (
          <p role="status">
            This record is available until you leave or reload the app.
          </p>
        ) : null}
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
