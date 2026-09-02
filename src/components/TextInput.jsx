export function TextInput({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  inputMode,
  pattern,
  maxLength,
  required = false,
}) {
  return (
    <div className="form-field">
      <label htmlFor={id}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        pattern={pattern}
        maxLength={maxLength}
        required={required}
      />
    </div>
  );
}
