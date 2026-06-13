'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ProfileSummaryCard from '@/app/components/cards/ProfileSummaryCard';
import PageHeader from '@/app/components/shell/PageHeader';
import { getAuthSessionProfile } from '@/app/lib/authSession';
import { getServerSession } from '@/app/lib/clientSession';
import ProfileContextMenu from '@/app/components/profile/ProfileContextMenu';
import ProfileSectionRenderer from '@/app/components/profile/ProfileSectionRenderer';
import { ProfileSectionKey, UserPostRecord } from '@/app/components/profile/types';
import ArtCelebrityPanel from '@/app/components/social/ArtCelebrityPanel';

const ALLOWED_SECTIONS: ProfileSectionKey[] = ['wardrobe', 'user-info', 'style-dna', 'my-schemes', 'saved-schemes', 'my-posts', 'settings'];
// Perfil-Lookbook (RF20): visitors may also see the creator's Style DNA.
const PUBLIC_SECTIONS: ProfileSectionKey[] = ['user-info', 'style-dna'];

interface WardrobeItem {
  wardrobe_item_id: string;
  name: string;
  image_url: string;
  brand: string;
  piece_type: string;
  gender?: string;
}

interface SchemeItem {
  scheme_id: string;
  title: string;
  style: string;
  occasion: string;
  description?: string | null;
  cover_image_url?: string | null;
  visibility: 'public' | 'private';
  creation_mode?: 'manual' | 'ai';
  updatedAt?: string;
}

interface PublicProfile {
  name?: string;
  username?: string;
  email?: string;
  bio?: string;
  photo_url?: string;
  brandSealTier?: string;
  brandSealStatus?: string;
  officialFeedEligible?: boolean;
  officialFeedUntil?: string | null;
}

const parseSectionFromQuery = (value: string | null): ProfileSectionKey => {
  if (!value) return 'wardrobe';
  const normalized = value.trim().toLowerCase() as ProfileSectionKey;
  return ALLOWED_SECTIONS.includes(normalized) ? normalized : 'wardrobe';
};

export default function ProfileView() {
  const authProfile = getAuthSessionProfile();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const pathSegments = pathname.split('/').filter(Boolean);
  const publicUserFromPath = pathSegments[0] === 'profile' && pathSegments[1] && pathSegments[1] !== 'settings' ? pathSegments[1] : '';

  const [authUserId, setAuthUserId] = useState(authProfile.user_id?.trim() || '');
  const [userId, setUserId] = useState(publicUserFromPath || authProfile.user_id?.trim() || '');
  const [viewedProfile, setViewedProfile] = useState<PublicProfile>({
    name: authProfile.name?.trim() || '',
    email: authProfile.email?.trim() || '',
  });
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [schemes, setSchemes] = useState<SchemeItem[]>([]);
  const [posts, setPosts] = useState<UserPostRecord[]>([]);

  const isOwnerView = Boolean(authUserId) && Boolean(userId) && authUserId === userId;
  const allowedSections: ProfileSectionKey[] = isOwnerView || !publicUserFromPath
    ? ALLOWED_SECTIONS
    : PUBLIC_SECTIONS;
  const requestedSection = parseSectionFromQuery(searchParams.get('section') ?? (pathname.endsWith('/settings') ? 'settings' : null));
  // For visited profiles, default to user-info but allow switching to the permitted public sections.
  const forcedPublicSection = publicUserFromPath && !isOwnerView && !allowedSections.includes(requestedSection) ? 'user-info' : null;
  const selectedSection = forcedPublicSection ?? requestedSection;

  useEffect(() => {
    const loadProfileHubData = async () => {
      const localProfile = getAuthSessionProfile();
      let resolvedAuthUserId = localProfile.user_id?.trim() || '';

      if (!resolvedAuthUserId) {
        const serverProfile = await getServerSession();
        resolvedAuthUserId = serverProfile?.user_id?.trim() || '';
      }

      const resolvedViewedUserId = publicUserFromPath || resolvedAuthUserId;
      setAuthUserId(resolvedAuthUserId);
      setUserId(resolvedViewedUserId);

      if (!resolvedViewedUserId) {
        setWardrobeItems([]);
        setSchemes([]);
        setPosts([]);
        setViewedProfile({});
        return;
      }

      const profileResponse = await fetch(`/api/users/me?userId=${encodeURIComponent(resolvedViewedUserId)}`);
      const profileData = (await profileResponse.json().catch(() => null)) as { profile?: PublicProfile } | null;
      const loadedProfile = profileData?.profile ?? {};
      setViewedProfile(loadedProfile);

      if (resolvedViewedUserId !== resolvedAuthUserId) {
        setWardrobeItems([]);
        setSchemes([]);
        setPosts([]);
        return;
      }

      const [wardrobeResponse, schemesResponse, postsResponse] = await Promise.all([
        fetch(`/api/wardrobe-items/user/${resolvedViewedUserId}?status=active&limit=24`),
        fetch(`/api/schemes/user/${resolvedViewedUserId}`),
        fetch(`/api/user-posts?user_id=${encodeURIComponent(resolvedViewedUserId)}`),
      ]);

      const wardrobeData = await wardrobeResponse.json().catch(() => ({ items: [] }));
      const schemesData = await schemesResponse.json().catch(() => []);
      const postsData = await postsResponse.json().catch(() => []);

      const normalizedWardrobeItems = Array.isArray((wardrobeData as { items?: unknown })?.items)
        ? ((wardrobeData as { items: WardrobeItem[] }).items)
        : [];
      setWardrobeItems(normalizedWardrobeItems);
      setSchemes(Array.isArray(schemesData) ? (schemesData as SchemeItem[]) : []);
      setPosts(Array.isArray(postsData) ? (postsData as UserPostRecord[]) : []);
    };

    loadProfileHubData().catch(() => {
      setWardrobeItems([]);
      setSchemes([]);
      setPosts([]);
    });
  }, [publicUserFromPath]);

  const publicEmailFallback = 'not-available@user.local';
  const ownerEmail = viewedProfile.email?.trim() || authProfile.email?.trim() || publicEmailFallback;
  const publicEmail = viewedProfile.email?.trim() || publicEmailFallback;
  const email = isOwnerView ? ownerEmail : publicEmail;

  const ownerUsername = viewedProfile.username?.trim() || viewedProfile.name?.trim() || ownerEmail.split('@')[0] || 'user';
  const publicUsername = viewedProfile.username?.trim() || viewedProfile.name?.trim() || 'user';
  const username = isOwnerView ? ownerUsername : publicUsername;
  const displayName = viewedProfile.name?.trim() || username;
  const bio = viewedProfile.bio?.trim() || `@${username}`;

  const sealTierLabel = viewedProfile.brandSealTier === 'premium'
    ? 'Premium'
    : viewedProfile.brandSealTier === 'free'
      ? 'Gratuito'
      : 'Nenhum';
  const sealStatusLabel = viewedProfile.brandSealStatus === 'active'
    ? 'Ativo'
    : viewedProfile.brandSealStatus === 'pending'
      ? 'Aguardando validação'
      : viewedProfile.brandSealStatus === 'expired'
        ? 'Expirado'
        : 'Inativo';
  const officialFeedUntilLabel = viewedProfile.officialFeedUntil
    ? new Date(viewedProfile.officialFeedUntil).toLocaleDateString('pt-BR')
    : 'Sem vigência definida';

  const updateSection = (section: ProfileSectionKey) => {
    const normalized = allowedSections.includes(section) ? section : allowedSections[0];
    const query = new URLSearchParams(searchParams.toString());
    query.set('section', normalized);
    router.replace(`${pathname}?${query.toString()}`);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <ProfileContextMenu selectedSection={selectedSection} onSelectSection={updateSection} allowedSections={allowedSections} />

      <div className="space-y-6">
        <PageHeader title={isOwnerView ? 'Profile' : `Creator Profile`} subtitle={isOwnerView ? 'Premium creator hub for wardrobe, schemes, publishing, and account controls.' : 'Public creator profile view.'} />

        <ProfileSummaryCard
          username={username}
          displayName={displayName}
          bio={bio}
          loginEmail={email}
          loginStatus={isOwnerView ? 'Authenticated' : 'Public Profile'}
          authSource="saiUsers"
          brandSealTier={viewedProfile.brandSealTier || 'none'}
          brandSealStatus={viewedProfile.brandSealStatus || 'inactive'}
          officialFeedEligible={Boolean(viewedProfile.officialFeedEligible)}
          officialFeedUntil={viewedProfile.officialFeedUntil || null}
        />

        <ArtCelebrityPanel
          viewerId={authUserId}
          viewerName={displayName}
          targetId={userId}
          title="Plano 3 · Consagração do criador"
          subtitle="Tributos, arena e status de destaque para o perfil publicamente reconhecido."
        />

        <section className="rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(17,24,39,0.98))] p-5 shadow-[0_25px_60px_rgba(15,23,42,0.35)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-amber-100/80">Plano 2</p>
              <h2 className="text-lg font-semibold text-white">Painel de selo e feed oficial</h2>
              <p className="mt-1 text-sm text-white/65">Visibilidade, vigência e status do selo aparecem em um painel público para marcas e criadores.</p>
            </div>
            <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-amber-100">{sealTierLabel}</span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">Status do selo</p>
              <p className="mt-2 text-base font-semibold text-white">{sealStatusLabel}</p>
              <p className="mt-1 text-xs text-white/60">Estado ativo, pendente ou expirado para o perfil exibido.</p>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">Tipo</p>
              <p className="mt-2 text-base font-semibold text-white">Selo {sealTierLabel}</p>
              <p className="mt-1 text-xs text-white/60">Diferenciação visual para visibilidade premium e marca.</p>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">Feed oficial</p>
              <p className="mt-2 text-base font-semibold text-white">{Boolean(viewedProfile.officialFeedEligible) ? 'Habilitado' : 'Indisponível'}</p>
              <p className="mt-1 text-xs text-white/60">Conteúdo com destaque editorial no feed oficial de 30 dias.</p>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">Vigência</p>
              <p className="mt-2 text-base font-semibold text-white">{officialFeedUntilLabel}</p>
              <p className="mt-1 text-xs text-white/60">Prazo de destaque e visibilidade oficial para esse perfil.</p>
            </article>
          </div>

          <div className="mt-4 rounded-2xl border border-violet-400/20 bg-violet-400/8 p-4 text-sm text-violet-100/90">
            Gestão do Plano 2: o status e a vigência são atualizados em tempo real, permitindo acompanhar a validação, o destaque oficial e a permanência do selo no perfil.
          </div>
        </section>

        <ProfileSectionRenderer
          section={selectedSection}
          userId={userId}
          username={username}
          displayName={displayName}
          email={email}
          canEdit={isOwnerView}
          wardrobeItems={wardrobeItems}
          schemes={schemes}
          posts={posts}
          onWardrobeItemDeleted={(removedId) => setWardrobeItems((prev) => prev.filter((item) => item.wardrobe_item_id !== removedId))}
          onProfileSaved={(profile) => setViewedProfile((prev) => ({ ...prev, ...profile }))}
        />
      </div>
    </div>
  );
}
