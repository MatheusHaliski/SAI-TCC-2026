export type AppRoute = 'home' | 'my-wardrobe' | 'create-my-scheme' | 'explore-scheme' | 'profile' | 'profile-settings' | 'search-items' | 'search-pieces' | 'dress-tester';

export interface NavItem {
  route: AppRoute;
  label: string;
  helperText: string;
  icon: string;
  path: string;
}

export const NAV_ITEMS: NavItem[] = [
  { route: 'home',             label: 'Dashboard',       helperText: 'Resumo e sugestões da IA',            icon: '⌂',  path: '/home' },
  { route: 'my-wardrobe',      label: 'Guarda-roupa',    helperText: 'Disponíveis, indisponíveis e favoritos', icon: '⌂', path: '/my-wardrobe' },
  { route: 'create-my-scheme', label: 'Criar Look',      helperText: 'Monte manualmente ou com IA',          icon: '✦',  path: '/create-my-scheme' },
  { route: 'explore-scheme',   label: 'Looks Salvos',    helperText: 'Gerenciar looks por ocasião',          icon: '◍',  path: '/explore-scheme' },
  { route: 'dress-tester',     label: 'Provador 2D',     helperText: 'Estúdio de manequim premium',          icon: '◌',  path: '/dress-tester' },
  { route: 'search-items',     label: 'Explorar',        helperText: 'Encontre usuários e looks',            icon: '⌕',  path: '/search-items' },
  { route: 'search-pieces',    label: 'Buscar Peças',    helperText: 'Descubra peças de criadores',          icon: '◈',  path: '/search-pieces' },
  { route: 'profile',          label: 'Perfil',          helperText: 'Gerenciar sua conta',                  icon: '◉',  path: '/profile' },
  { route: 'profile-settings', label: 'Configurações',   helperText: 'Configurações e privacidade',          icon: '⚙︎', path: '/profile/settings' },
];

export const ROUTE_TITLES: Record<AppRoute, string> = {
  'home':             'Dashboard',
  'my-wardrobe':      'Guarda-roupa Virtual',
  'create-my-scheme': 'Criar Look',
  'explore-scheme':   'Looks Salvos',
  'profile':          'Perfil',
  'profile-settings': 'Configurações',
  'search-items':     'Explorar',
  'search-pieces':    'Buscar Peças',
  'dress-tester':     'Provador 2D',
};

export const PATH_TO_ROUTE: Record<string, AppRoute> = {
  '/':                  'home',
  '/home':              'home',
  '/my-wardrobe':       'my-wardrobe',
  '/create-my-scheme':  'create-my-scheme',
  '/explore-scheme':    'explore-scheme',
  '/profile':           'profile',
  '/profile/settings':  'profile-settings',
  '/search-items':      'search-items',
  '/search-pieces':     'search-pieces',
  '/add-wardrobe-item': 'my-wardrobe',
  '/dress-tester':      'dress-tester',
};
