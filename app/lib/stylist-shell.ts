export type AppRoute =
  | 'home'
  | 'my-wardrobe'
  | 'create-my-scheme'
  | 'explore-scheme'
  | 'feed'
  | 'autopilot'
  | 'dress-tester'
  | 'search-pieces'
  | 'search-items'
  | 'my-photos'
  | 'future-topics'
  | 'maison'
  | 'tributes'
  | 'profile'
  | 'profile-settings';

export interface NavItem {
  route: AppRoute;
  label: string;
  helperText: string;
  icon: string;
  path: string;
}

export const NAV_ITEMS: NavItem[] = [
  { route: 'home',             label: 'Dashboard',      helperText: 'Resumo e sugestões da IA',              icon: '⌂',  path: '/home' },
  { route: 'my-wardrobe',      label: 'Guarda-Roupa',   helperText: 'Disponível, indisponível e favoritos', icon: '⌂',  path: '/my-wardrobe' },
  { route: 'create-my-scheme', label: 'Criar Look',     helperText: 'Monte manualmente ou com IA',          icon: '✦',  path: '/create-my-scheme' },
  { route: 'explore-scheme',   label: 'Looks Salvos',   helperText: 'Gerencie looks por ocasião',           icon: '◍',  path: '/explore-scheme' },
  { route: 'feed',             label: 'The Runway',     helperText: 'Feed social da comunidade FAI',        icon: '◈',  path: '/feed' },
  { route: 'autopilot',        label: 'Autopiloto',     helperText: 'Looks diários e planejamento semanal', icon: '◎',  path: '/autopilot' },
  { route: 'dress-tester',     label: 'Provador 2D',    helperText: 'Estúdio premium de manequim',          icon: '◌',  path: '/dress-tester' },
  { route: 'search-pieces',    label: 'Peças Públicas', helperText: 'Descubra peças de criadores',          icon: '⊞',  path: '/search-pieces' },
  { route: 'search-items',     label: 'Buscar',         helperText: 'Encontre usuários e looks',            icon: '⌕',  path: '/search-items' },
  { route: 'my-photos',        label: 'Minhas Fotos',   helperText: 'Galeria de peças e looks',             icon: '⬡',  path: '/my-photos' },
  { route: 'maison',           label: 'Marcas',         helperText: 'Perfil de marcas e identidade',        icon: '◆',  path: '/maison' },
  { route: 'tributes',         label: 'Tributos',       helperText: 'Celebridades, pedidos e feed mensal',  icon: '✧',  path: '/tributes' },
  { route: 'future-topics',    label: 'Temas Futuros',  helperText: 'Funcionalidades planejadas',           icon: '◇',  path: '/future-topics' },
  { route: 'profile',          label: 'Perfil',         helperText: 'Gerencie sua conta',                   icon: '◉',  path: '/profile' },
  { route: 'profile-settings', label: 'Configurações',  helperText: 'Preferências e privacidade',           icon: '⚙︎', path: '/profile/settings' },
];

export const ROUTE_TITLES: Record<AppRoute, string> = {
  home: 'Dashboard',
  'my-wardrobe': 'Guarda-Roupa Virtual',
  'create-my-scheme': 'Criar Look',
  'explore-scheme': 'Looks Salvos',
  feed: 'The Runway',
  autopilot: 'Autopiloto',
  profile: 'Perfil',
  'profile-settings': 'Configurações',
  'search-items': 'Buscar',
  'search-pieces': 'Peças Públicas',
  'dress-tester': 'Provador 2D',
  'my-photos': 'Minhas Fotos',
  'future-topics': 'Temas Futuros',
  maison: 'Marcas',
  tributes: 'Tributos',
};

export const PATH_TO_ROUTE: Record<string, AppRoute> = {
  '/': 'home',
  '/home': 'home',
  '/my-wardrobe': 'my-wardrobe',
  '/create-my-scheme': 'create-my-scheme',
  '/explore-scheme': 'explore-scheme',
  '/feed': 'feed',
  '/autopilot': 'autopilot',
  '/autopilot/week': 'autopilot',
  '/autopilot/history': 'autopilot',
  '/profile': 'profile',
  '/profile/settings': 'profile-settings',
  '/search-items': 'search-items',
  '/search-pieces': 'search-pieces',
  '/add-wardrobe-item': 'my-wardrobe',
  '/dress-tester': 'dress-tester',
  '/my-photos': 'my-photos',
  '/future-topics': 'future-topics',
  '/maison': 'maison',
  '/tributes': 'tributes',
};
