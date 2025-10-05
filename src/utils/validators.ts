/**
 * Input validation utilities
 */

export function validatePositiveInteger(value: unknown, fieldName: string): void {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    throw new Error(`${fieldName} must be a positive integer`);
  }
}

export function validateSortOrder(value: unknown): void {
  if (value !== undefined && value !== 'asc' && value !== 'desc') {
    throw new Error('Sort order must be "asc" or "desc"');
  }
}

export function validateLimit(value: unknown): void {
  if (value !== undefined) {
    if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
      throw new Error('Limit must be a positive integer');
    }
  }
}

export function validateString(value: unknown, fieldName: string): void {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${fieldName} must be a non-empty string`);
  }
}

export function validateEmail(value: unknown): void {
  if (typeof value !== 'string' || !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    throw new Error('Invalid email format');
  }
}

export function validateUrl(value: unknown, fieldName: string): void {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${fieldName} must be a non-empty string`);
  }
  try {
    const url = new URL(value);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error(`${fieldName} must use HTTP or HTTPS protocol`);
    }
  } catch {
    throw new Error(`${fieldName} must be a valid URL`);
  }
}

export function sanitizePathSegment(value: string): string {
  // Encode URI component and trim whitespace
  return encodeURIComponent(value.trim());
}
