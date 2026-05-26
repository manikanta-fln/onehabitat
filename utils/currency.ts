/** Format a number in Indian numbering (lakhs/crores style grouping). */
export function formatInr(amount: number): string {
  return amount.toLocaleString("en-IN");
}

/** Display an inclusive price range in Indian Rupees. */
export function formatInrRange(min: number, max: number): string {
  return `₹${formatInr(min)} – ₹${formatInr(max)}`;
}
