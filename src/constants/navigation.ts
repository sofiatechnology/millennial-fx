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
    href: '/news',
    label: 'News',
    title: 'News',
    symbol: 'newspaper',
  },
  {
    href: '/settings',
    label: 'Settings',
    title: 'Settings',
    symbol: 'settings',
  },
];

export function pageTitle(pathname: string): string {
  if (pathname === '/settings/appearance') return 'Appearance';
  if (pathname === '/settings/about') return 'About';
  return destinationForPath(pathname).title;
}

export function destinationForPath(pathname: string): Destination {
  return (
    destinations.find((item) => isDestinationActive(pathname, item.href)) ?? destinations[0]
  );
}

export function isDestinationActive(pathname: string, href: Href): boolean {
  if (href === '/') return pathname === '/' || pathname === '/index';
  if (href === '/settings') {
    return pathname === '/settings' || pathname.startsWith('/settings/');
  }
  return pathname === href;
}
