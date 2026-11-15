import { FormField } from "./FormField";
import { getFieldAria } from "./fieldAccessibility";

export function DateInput({
  id,
  label,
  value,
  onChange,
  min,
  max,
  required = false,
  hint,
  error,
}) {
  const { describedBy, invalid } = getFieldAria(id, hint, error);
  return (
    <FormField id={id} label={label} required={required} hint={hint} error={error}>
      <input
        id={id}
        name={id}
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        min={min}
        max={max}
        required={required}
        aria-invalid={invalid}
        aria-describedby={describedBy}
      />
    </FormField>
  );
}
