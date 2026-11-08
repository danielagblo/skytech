export function parseIssueDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : new Date(value.getTime());
  }
  const text = String(value).slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return null;
  const date = new Date(`${text}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function invalidAfterIssue(value: unknown): Date | null {
  const issued = parseIssueDate(value);
  if (!issued) return null;
  const invalid = new Date(issued.getTime());
  invalid.setDate(invalid.getDate() + 14);
  return invalid;
}
