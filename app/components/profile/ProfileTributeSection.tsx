'use client';

import SectionBlock from '@/app/components/shared/SectionBlock';
import ArtCelebrityPanel from '@/app/components/social/ArtCelebrityPanel';
import CelebrityTributeHub from '@/app/components/profile/tribute/CelebrityTributeHub';

interface SchemeOption {
  scheme_id: string;
  title: string;
  style: string;
  occasion: string;
  visibility: 'public' | 'private';
}

interface ProfileTributeSectionProps {
  userId: string;
  viewerId: string;
  viewerName: string;
  canEdit?: boolean;
  schemes?: SchemeOption[];
  brandSealTier?: string;
  brandSealStatus?: string;
  officialFeedEligible?: boolean;
  officialFeedUntil?: string | null;
}

export default function ProfileTributeSection({
  userId,
  viewerId,
  viewerName,
  canEdit = false,
  schemes = [],
  brandSealTier,
  brandSealStatus,
  officialFeedEligible,
  officialFeedUntil,
}: ProfileTributeSectionProps) {
  const sealTierLabel = brandSealTier === 'premium'
    ? 'Premium'
    : brandSealTier === 'free'
      ? 'Gratuito'
      : 'Nenhum';
  const sealStatusLabel = brandSealStatus === 'active'
    ? 'Ativo'
    : brandSealStatus === 'pending'
      ? 'Aguardando validação'
      : brandSealStatus === 'expired'
        ? 'Expirado'
        : 'Inativo';
  const officialFeedUntilLabel = officialFeedUntil
    ? new Date(officialFeedUntil).toLocaleDateString('pt-BR')
    : 'Sem vigência definida';

  return (
    <SectionBlock
      title="Tributo & Consagração"
      subtitle="Participe de tributos, arena de votação e acompanhe o status de selo e feed oficial deste criador."
    >
      <ArtCelebrityPanel
        viewerId={viewerId}
        viewerName={viewerName}
        targetId={userId}
        title="Consagração do criador"
        subtitle="Tributos, arena e status de destaque para o perfil publicamente reconhecido."
      />

      <CelebrityTributeHub
        userId={userId}
        viewerId={viewerId}
        viewerName={viewerName}
        canEdit={canEdit}
        schemes={schemes}
      />

      <section className="rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(17,24,39,0.98))] p-5 shadow-[0_25px_60px_rgba(15,23,42,0.35)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-amber-100/80">Selo de marca</p>
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
            <p className="mt-2 text-base font-semibold text-white">{officialFeedEligible ? 'Habilitado' : 'Indisponível'}</p>
            <p className="mt-1 text-xs text-white/60">Conteúdo com destaque editorial no feed oficial de 30 dias.</p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">Vigência</p>
            <p className="mt-2 text-base font-semibold text-white">{officialFeedUntilLabel}</p>
            <p className="mt-1 text-xs text-white/60">Prazo de destaque e visibilidade oficial para esse perfil.</p>
          </article>
        </div>

        <div className="mt-4 rounded-2xl border border-violet-400/20 bg-violet-400/8 p-4 text-sm text-violet-100/90">
          Gestão do selo: o status e a vigência são atualizados em tempo real, permitindo acompanhar a validação, o destaque oficial e a permanência do selo no perfil. Para alterar seu selo, acesse a aba Configurações.
        </div>
      </section>
    </SectionBlock>
  );
}
