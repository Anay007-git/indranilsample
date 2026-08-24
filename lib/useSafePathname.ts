'use client';

import { usePathname } from 'next/navigation';

export function useSafePathname(): string {
  try {
    const pathname = usePathname();
    return pathname || '/';
  } catch {
    return '/';
  }
}
