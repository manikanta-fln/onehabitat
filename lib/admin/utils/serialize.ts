import type { ObjectId } from "mongodb";

export function serializeId(
  value: ObjectId | string | { toString(): string } | undefined | null
): string {
  if (!value) return "";
  return typeof value === "string" ? value : value.toString();
}

export function serializeDate(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : value;
}

export function sanitizeRecord(
  value: Record<string, unknown> | null | undefined
): Record<string, unknown> | null {
  if (!value) return null;

  const output: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (entry instanceof Date) {
      output[key] = entry.toISOString();
    } else if (entry && typeof entry === "object" && "_bsontype" in entry) {
      output[key] = String(entry);
    } else {
      output[key] = entry;
    }
  }
  return output;
}
