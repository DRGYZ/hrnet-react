export function getFieldAria(id, hint, error) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return {
    hintId,
    errorId,
    describedBy,
    invalid: error ? "true" : undefined,
  };
}
