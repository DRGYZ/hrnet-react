import { FormField } from "./FormField";
import { getFieldAria } from "./fieldAccessibility";

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
  hint,
  error,
}) {
  const { describedBy, invalid } = getFieldAria(id, hint, error);
  return (
    <FormField id={id} label={label} required={required} hint={hint} error={error}>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        pattern={pattern ?? (required && type === "text" ? ".*\\S.*" : undefined)}
        maxLength={maxLength}
        required={required}
        aria-invalid={invalid}
        aria-describedby={describedBy}
      />
    </FormField>
  );
}
