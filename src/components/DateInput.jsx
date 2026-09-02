export function DateInput({
  id,
  label,
  value,
  onChange,
  max,
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
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        max={max}
        required={required}
      />
    </div>
  );
}
