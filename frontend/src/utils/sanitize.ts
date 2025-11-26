/**
 * Sanitizes user input to prevent XSS attacks
 * Escapes HTML special characters
 */
export function sanitizeInput(input: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return input.replace(/[&<>"'/]/g, (char) => htmlEntities[char]);
}

/**
 * Sanitizes a string for use in URLs
 */
export function sanitizeForUrl(input: string): string {
  return encodeURIComponent(input);
}

/**
 * Strips HTML tags from a string
 */
export function stripHtmlTags(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

/**
 * Sanitizes an object's string properties
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };

  for (const key in sanitized) {
    const value = sanitized[key];
    if (typeof value === 'string') {
      (sanitized as Record<string, unknown>)[key] = sanitizeInput(value);
    }
  }

  return sanitized;
}

/**
 * Validates and sanitizes todo input
 */
export function sanitizeTodoInput(input: {
  title: string;
  description?: string;
  tags?: string[];
}): {
  title: string;
  description?: string;
  tags?: string[];
} {
  return {
    title: stripHtmlTags(input.title).trim(),
    description: input.description ? stripHtmlTags(input.description).trim() : undefined,
    tags: input.tags?.map((tag) => stripHtmlTags(tag).trim()).filter(Boolean),
  };
}
