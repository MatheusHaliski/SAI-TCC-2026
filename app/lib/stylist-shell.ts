export type AppRoute = 'my-wardrobe' | 'create-my-scheme' | 'explore-scheme' | 'profile' | 'search-items' | 'add-wardrobe-item' | 'dress-tester';

export interface NavItem {
  route: AppRoute;
  label: string;
  helperText: string;
  icon: string;
  path: string;
}

export const NAV_ITEMS: NavItem[] = [
  { route: 'my-wardrobe', label: 'Virtual Wardrobe', helperText: 'Available, unavailable and favorites', icon: '⌂', path: '/my-wardrobe' },
  { route: 'create-my-scheme', label: 'Create Outfit', helperText: 'Build manually or with AI', icon: '✦', path: '/create-my-scheme' },
  { route: 'explore-scheme', label: 'Saved Outfits', helperText: 'Manage outfits by occasion and preferences', icon: '◍', path: '/explore-scheme' },
  { route: 'profile', label: 'Profile', helperText: 'Manage your account details', icon: '◉', path: '/profile' },
  { route: 'search-items', label: 'Search', helperText: 'Find users and outfits', icon: '⌕', path: '/search-items' },
  { route: 'add-wardrobe-item', label: 'Add Piece', helperText: 'Register a new wardrobe piece', icon: '+', path: '/add-wardrobe-item' },
  { route: 'dress-tester', label: 'Dress Tester', helperText: '2D premium mannequin studio', icon: '◌', path: '/dress-tester' },
];

export const ROUTE_TITLES: Record<AppRoute, string> = {
  'my-wardrobe': 'Virtual Wardrobe',
  'create-my-scheme': 'Create Outfit',
  'explore-scheme': 'Saved Outfits',
  profile: 'Profile',
  'search-items': 'Search',
  'add-wardrobe-item': 'Add Piece',
  'dress-tester': 'Dress Tester',
};

export const PATH_TO_ROUTE: Record<string, AppRoute> = {
  '/': 'my-wardrobe',
  '/home': 'my-wardrobe',
  '/my-wardrobe': 'my-wardrobe',
  '/create-my-scheme': 'create-my-scheme',
  '/explore-scheme': 'explore-scheme',
  '/profile': 'profile',
  '/search-items': 'search-items',
  '/add-wardrobe-item': 'add-wardrobe-item',
  '/dress-tester': 'dress-tester',
};
