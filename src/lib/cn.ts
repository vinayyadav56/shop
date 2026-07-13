import cx from 'classnames';
import { twMerge } from 'tailwind-merge';

/**
 * cn() — merge conditional class names and de-dupe conflicting Tailwind classes.
 * Used across the revamped (v2) storefront.
 */
export function cn(...inputs: Parameters<typeof cx>): string {
  return twMerge(cx(inputs));
}

export default cn;
