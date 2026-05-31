import { AppRoute } from '@/app/lib/stylist-shell';
import HomeView from '@/app/views/HomeView';
import MyWardrobeView from '@/app/views/MyWardrobeView';
import CreateMySchemeView from '@/app/views/CreateMySchemeView';
import ExploreSchemeView from '@/app/views/ExploreSchemeView';
import DressTesterView from '@/app/views/DressTesterView';
import SearchItemsView from '@/app/views/SearchItemsView';
import SearchPiecesView from '@/app/views/SearchPiecesView';
import ProfileView from '@/app/views/ProfileView';
import AutopilotView from '@/app/views/AutopilotView';
import MyPhotosView from '@/app/views/MyPhotosView';

interface ContentRouterProps {
  route: AppRoute;
}

export default function ContentRouter({ route }: ContentRouterProps) {
  switch (route) {
    case 'home':             return <HomeView />;
    case 'my-wardrobe':      return <MyWardrobeView />;
    case 'create-my-scheme': return <CreateMySchemeView />;
    case 'explore-scheme':   return <ExploreSchemeView />;
    case 'autopilot':        return <AutopilotView />;
    case 'dress-tester':     return <DressTesterView />;
    case 'search-items':     return <SearchItemsView />;
    case 'search-pieces':    return <SearchPiecesView />;
    case 'my-photos':        return <MyPhotosView />;
    case 'profile':
    case 'profile-settings': return <ProfileView />;
    default:                 return <MyWardrobeView />;
  }
}
