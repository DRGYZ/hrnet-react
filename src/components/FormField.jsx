import { getFieldAria } from "./fieldAccessibility";

export function FormField({ id, label, required = false, hint, error, children }) {
  const { hintId, errorId } = getFieldAria(id, hint, error);
  return (
    <div className={error ? "form-field has-error" : "form-field"}>
      <label htmlFor={id}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
      {hint ? (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
