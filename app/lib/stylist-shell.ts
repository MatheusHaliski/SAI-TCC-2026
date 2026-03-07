export type AppRoute = 'home' | 'discover' | 'create' | 'market' | 'profile';

export interface NavItem {
  route: AppRoute;
  label: string;
  helperText: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { route: 'home', label: 'Home', helperText: 'Daily outfit pulse', icon: '⌂' },
  { route: 'discover', label: 'Discover', helperText: 'Curated style worlds', icon: '◈' },
  { route: 'create', label: 'Create', helperText: 'Build a new scheme', icon: '✦' },
  { route: 'market', label: 'Market', helperText: 'Premium fashion picks', icon: '◍' },
  { route: 'profile', label: 'Profile', helperText: 'Personal style identity', icon: '◉' },
];

export const ROUTE_TITLES: Record<AppRoute, string> = {
  home: 'Home',
  discover: 'Discover',
  create: 'Create Scheme',
  market: 'Market',
  profile: 'Profile',
};
