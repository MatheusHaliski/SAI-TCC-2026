import { Suspense } from 'react';
import { AppRoute } from '@/app/lib/stylist-shell';
import ProfileView from '@/app/views/ProfileView';
import CreateMySchemeView from '@/app/views/CreateMySchemeView';
import ExploreSchemeView from '@/app/views/ExploreSchemeView';
import MyWardrobeView from '@/app/views/MyWardrobeView';
import SearchItemsView from '@/app/views/SearchItemsView';
import DressTesterView from '@/app/views/DressTesterView';
import SearchPiecesView from '@/app/views/SearchPiecesView';
import AutopilotView from '@/app/views/AutopilotView';
import MyPhotosView from '@/app/views/MyPhotosView';
import FutureTopicsView from '@/app/views/FutureTopicsView';
import MaisonView from '@/app/views/MaisonView';

interface ContentRouterProps {
  route: AppRoute;
}

export default function ContentRouter({ route }: ContentRouterProps) {
  if (route === 'create-my-scheme') return <CreateMySchemeView />;
  if (route === 'search-items') return <SearchItemsView />;
  if (route === 'explore-scheme') return <ExploreSchemeView />;
  if (route === 'profile' || route === 'profile-settings') return <ProfileView />;
  if (route === 'search-pieces') return <SearchPiecesView />;
  if (route === 'dress-tester') return <Suspense><DressTesterView /></Suspense>;
  if (route === 'autopilot') return <AutopilotView />;
  if (route === 'my-photos') return <MyPhotosView />;
  if (route === 'future-topics') return <FutureTopicsView />;
  if (route === 'maison') return <MaisonView />;
  return <MyWardrobeView />;
}
