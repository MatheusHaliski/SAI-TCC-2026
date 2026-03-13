import { AppRoute } from '@/app/lib/stylist-shell';
import ProfileView from '@/app/views/ProfileView';
import CreateMySchemeView from '@/app/views/CreateMySchemeView';
import ExploreSchemeView from '@/app/views/ExploreSchemeView';
import MyWardrobeView from '@/app/views/MyWardrobeView';
import SearchItemsView from '@/app/views/SearchItemsView';

interface ContentRouterProps {
  route: AppRoute;
}

export default function ContentRouter({ route }: ContentRouterProps) {
  if (route === 'create-my-scheme') return <CreateMySchemeView />;
  if (route === 'search-items') return <SearchItemsView />;
  if (route === 'explore-scheme') return <ExploreSchemeView />;
  if (route === 'profile') return <ProfileView />;
  return <MyWardrobeView />;
}
