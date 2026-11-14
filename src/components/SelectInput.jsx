import { FormField } from "./FormField";
import { getFieldAria } from "./fieldAccessibility";

export function SelectInput({
  id,
  label,
  value,
  options,
  onChange,
  required = false,
  hint,
  error,
}) {
  const { describedBy, invalid } = getFieldAria(id, hint, error);
  return (
    <FormField id={id} label={label} required={required} hint={hint} error={error}>
      <div className="select-control">
        <select
          id={id}
          name={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          aria-invalid={invalid}
          aria-describedby={describedBy}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </FormField>
  );
}
