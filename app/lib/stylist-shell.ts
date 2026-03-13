export type AppRoute = 'create-my-scheme' | 'my-wardrobe' | 'search-items' | 'explore-scheme' | 'profile';

export interface NavItem {
  route: AppRoute;
  label: string;
  helperText: string;
  icon: string;
  path: string;
}

export const NAV_ITEMS: NavItem[] = [
  { route: 'my-wardrobe', label: 'My Wardrobe', helperText: 'Your wardrobe collection', icon: '⌂', path: '/my-wardrobe' },
  { route: 'search-items', label: 'Search Items', helperText: 'Catalog filters and discovery', icon: '◈', path: '/search-items' },
  { route: 'create-my-scheme', label: 'Create My Scheme', helperText: 'Build a new scheme', icon: '✦', path: '/create-my-scheme' },
  { route: 'explore-scheme', label: 'Explore Scheme', helperText: 'Public community schemes', icon: '◍', path: '/explore-scheme' },
  { route: 'profile', label: 'Profile', helperText: 'Personal style identity', icon: '◉', path: '/profile' },
];

export const ROUTE_TITLES: Record<AppRoute, string> = {
  'my-wardrobe': 'My Wardrobe',
  'search-items': 'Search Items',
  'create-my-scheme': 'Create My Scheme',
  'explore-scheme': 'Explore Scheme',
  profile: 'Profile',
};

export const PATH_TO_ROUTE: Record<string, AppRoute> = {
  '/': 'my-wardrobe',
  '/home': 'my-wardrobe',
  '/my-wardrobe': 'my-wardrobe',
  '/search-items': 'search-items',
  '/create-my-scheme': 'create-my-scheme',
  '/explore-scheme': 'explore-scheme',
  '/profile': 'profile',
};
