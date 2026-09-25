import type { Href } from 'expo-router';

import type { MaterialSymbolName } from '@/components/material-symbol';

export interface Destination {
  href: Href;
  label: string;
  title: string;
  symbol: MaterialSymbolName;
}

export const destinations: Destination[] = [
  {
    href: '/',
    label: 'Calculator',
    title: 'Lot Size Calculator',
    symbol: 'calculate',
  },
  {
    href: '/settings',
    label: 'Appearance',
    title: 'Appearance',
    symbol: 'palette',
  },
  {
    href: '/about',
    label: 'About',
    title: 'About',
    symbol: 'info',
  },
];

export function destinationForPath(pathname: string): Destination {
  return (
    destinations.find((item) => {
      if (item.href === '/') return pathname === '/' || pathname === '/index';
      return pathname === item.href;
    }) ?? destinations[0]
  );
}

export function isDestinationActive(pathname: string, href: Href): boolean {
  if (href === '/') return pathname === '/' || pathname === '/index';
  return pathname === href;
}
