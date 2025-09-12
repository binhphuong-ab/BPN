/**
 * Utility functions for text processing and slug generation
 * Provides comprehensive Vietnamese text support for URL-friendly slug generation
 */

/**
 * Comprehensive Vietnamese character mapping for slug generation
 * Includes all possible Vietnamese diacritical marks and their ASCII equivalents
 */
const VIETNAMESE_CHAR_MAP: Record<string, string> = {
  // Lowercase vowels with diacritics
  'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a',
  'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a',
  'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
  'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e',
  'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
  'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
  'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o',
  'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o',
  'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
  'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u',
  'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
  'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
  'đ': 'd',
  // Uppercase vowels with diacritics
  'À': 'A', 'Á': 'A', 'Ạ': 'A', 'Ả': 'A', 'Ã': 'A',
  'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ẩ': 'A', 'Ẫ': 'A',
  'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ẳ': 'A', 'Ẵ': 'A',
  'È': 'E', 'É': 'E', 'Ẹ': 'E', 'Ẻ': 'E', 'Ẽ': 'E',
  'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ể': 'E', 'Ễ': 'E',
  'Ì': 'I', 'Í': 'I', 'Ị': 'I', 'Ỉ': 'I', 'Ĩ': 'I',
  'Ò': 'O', 'Ó': 'O', 'Ọ': 'O', 'Ỏ': 'O', 'Õ': 'O',
  'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ộ': 'O', 'Ổ': 'O', 'Ỗ': 'O',
  'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ở': 'O', 'Ỡ': 'O',
  'Ù': 'U', 'Ú': 'U', 'Ụ': 'U', 'Ủ': 'U', 'Ũ': 'U',
  'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ự': 'U', 'Ử': 'U', 'Ữ': 'U',
  'Ỳ': 'Y', 'Ý': 'Y', 'Ỵ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y',
  'Đ': 'D'
};

/**
 * Generates a URL-friendly slug from Vietnamese text
 * Handles all Vietnamese diacritical marks and special characters
 * 
 * @param text - The input text to convert to a slug
 * @returns A URL-friendly slug string
 * 
 * @example
 * generateVietnameseSlug('Học lập trình JavaScript') // 'hoc-lap-trinh-javascript'
 * generateVietnameseSlug('Phát triển ứng dụng web') // 'phat-trien-ung-dung-web'
 * generateVietnameseSlug('10 tips để học code hiệu quả') // '10-tips-de-hoc-code-hieu-qua'
 */
export function generateVietnameseSlug(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .trim()
    // Convert to lowercase first for consistency
    .toLowerCase()
    // Replace Vietnamese characters using the mapping
    .split('')
    .map(char => VIETNAMESE_CHAR_MAP[char] || char)
    .join('')
    // Convert to lowercase again after character replacement
    .toLowerCase()
    // Remove all non-alphanumeric characters except spaces and hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    // Replace multiple consecutive spaces with single space
    .replace(/\s+/g, ' ')
    // Replace spaces with hyphens
    .replace(/\s/g, '-')
    // Replace multiple consecutive hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Final trim to ensure no whitespace
    .trim();
}

/**
 * Removes Vietnamese diacritical marks from text while preserving case
 * Useful for search functionality or text normalization
 * 
 * @param text - The input text to normalize
 * @returns Text with Vietnamese diacritics removed
 * 
 * @example
 * removeVietnameseDiacritics('Tiếng Việt') // 'Tieng Viet'
 * removeVietnameseDiacritics('Học tập') // 'Hoc tap'
 */
export function removeVietnameseDiacritics(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .split('')
    .map(char => VIETNAMESE_CHAR_MAP[char] || char)
    .join('');
}

/**
 * Validates if a string contains Vietnamese characters
 * 
 * @param text - The text to check
 * @returns True if the text contains Vietnamese characters
 */
export function hasVietnameseCharacters(text: string): boolean {
  if (!text || typeof text !== 'string') {
    return false;
  }

  return text.split('').some(char => VIETNAMESE_CHAR_MAP.hasOwnProperty(char));
}

/**
 * Sanitizes text for safe usage in URLs, filenames, or HTML attributes
 * 
 * @param text - The text to sanitize
 * @param options - Sanitization options
 * @returns Sanitized text
 */
export function sanitizeText(
  text: string, 
  options: {
    removeVietnamese?: boolean;
    allowSpaces?: boolean;
    maxLength?: number;
  } = {}
): string {
  const { removeVietnamese = true, allowSpaces = false, maxLength } = options;

  if (!text || typeof text !== 'string') {
    return '';
  }

  let sanitized = text.trim();

  // Remove Vietnamese diacritics if requested
  if (removeVietnamese) {
    sanitized = removeVietnameseDiacritics(sanitized);
  }

  // Remove special characters (keep letters, numbers, spaces, hyphens, underscores)
  sanitized = sanitized.replace(/[^a-zA-Z0-9\s\-_]/g, '');

  // Handle spaces
  if (!allowSpaces) {
    sanitized = sanitized.replace(/\s+/g, '-');
  } else {
    sanitized = sanitized.replace(/\s+/g, ' ');
  }

  // Remove multiple consecutive hyphens
  sanitized = sanitized.replace(/-+/g, '-');

  // Remove leading/trailing hyphens
  sanitized = sanitized.replace(/^-+|-+$/g, '');

  // Truncate if max length is specified
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength).replace(/-+$/, '');
  }

  return sanitized.trim();
}
