export function DateInput({
  id,
  label,
  value,
  onChange,
  min,
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
        min={min}
        max={max}
        required={required}
      />
    </div>
  );
}
