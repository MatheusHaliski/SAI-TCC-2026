'use client';

import { useState } from 'react';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';

interface FutureTopic {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  status: 'planned' | 'research' | 'concept';
  icon: string;
  accentClass: string;
  badgeClass: string;
}

const STATUS_LABELS: Record<FutureTopic['status'], string> = {
  planned: 'Planejado',
  research: 'Em Pesquisa',
  concept: 'Conceito',
};

const TOPICS: FutureTopic[] = [
  {
    id: 'provador-3d',
    code: '14.1',
    title: 'Provador 3D',
    subtitle: 'Experimentação imersiva de peças em manequim tridimensional',
    description:
      'O Provador 3D representa uma funcionalidade avançada do Fashion AI, voltada à experimentação de peças de roupa em um manequim tridimensional. Essa ferramenta permite visualizar roupas com maior profundidade, proporção, volume e perspectiva, oferecendo uma experiência mais imersiva.',
    bullets: [
      'Manequim 3D gerado a partir da peça cadastrada no guarda-roupa',
      'Visualização de volume, proporção e perspectiva da roupa',
      'Combinação de peças sobrepostas no espaço tridimensional',
      'Geração de modelos via IA para melhor representação visual',
      'Base para a criação de outfit cards com imagem 3D representativa',
    ],
    status: 'planned',
    icon: '◌',
    accentClass: 'border-cyan-400/40 bg-cyan-500/5',
    badgeClass: 'border-cyan-400/50 bg-cyan-500/15 text-cyan-200',
  },
  {
    id: 'aurora-cps',
    code: '14.2',
    title: 'AURORA CPS',
    subtitle: 'Sistema Ciberfísico do Fashion AI',
    description:
      'O AURORA CPS corresponde a uma proposta futura de Sistema Ciberfísico do Fashion AI, integrando recursos digitais, inteligência artificial, dados do usuário e possíveis interações com o ambiente físico. Transforma o FAI em uma plataforma mais inteligente e contextualmente conectada.',
    bullets: [
      'Recomendações inteligentes baseadas na rotina real do usuário',
      'Análise de padrões de uso e histórico de vestimenta',
      'Integração com clima, agenda, localização e eventos',
      'Sugestões automáticas de outfits por contexto e ocasião',
      'Conexão entre o comportamento digital e o uso físico das roupas',
    ],
    status: 'research',
    icon: '◎',
    accentClass: 'border-violet-400/40 bg-violet-500/5',
    badgeClass: 'border-violet-400/50 bg-violet-500/15 text-violet-200',
  },
  {
    id: 'editor-2d',
    code: '14.3',
    title: 'Editor de Peças 2D',
    subtitle: 'Edição interativa e visual de peças de roupa no plano digital',
    description:
      'Funcionalidade futura voltada à criação e edição interativa de peças de roupa no plano 2D. O editor permitirá ao usuário ajustar visualmente a peça cadastrada, com ferramentas de recorte, ajuste de fundo, correção de cor e geração por IA.',
    bullets: [
      'Ajustes visuais diretos sobre a imagem da peça (recorte, fundo, cores)',
      'Sugestões da IA para melhorar a descrição e estilo da peça',
      'Identificação automática de estilo e ocasião via visão computacional',
      'Preparação da peça para uso em outfit cards e provadores',
      'Ferramentas de normalização e limpeza de imagem para o catálogo',
    ],
    status: 'concept',
    icon: '✦',
    accentClass: 'border-fuchsia-400/40 bg-fuchsia-500/5',
    badgeClass: 'border-fuchsia-400/50 bg-fuchsia-500/15 text-fuchsia-200',
  },
];

function TopicCard({ topic }: { topic: FutureTopic }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-2xl border p-5 transition ${topic.accentClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="mt-0.5 shrink-0 text-2xl leading-none">{topic.icon}</span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-white/40 font-mono">{topic.code}</span>
              <h3 className="text-base font-semibold text-white">{topic.title}</h3>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${topic.badgeClass}`}>
                {STATUS_LABELS[topic.status]}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-white/60">{topic.subtitle}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="shrink-0 rounded-lg border border-white/15 px-2.5 py-1 text-xs text-white/60 hover:border-white/30 hover:text-white transition"
        >
          {expanded ? 'Fechar' : 'Ver mais'}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
          <p className="text-sm text-white/75 leading-relaxed">{topic.description}</p>
          <ul className="space-y-1.5">
            {topic.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2 text-sm text-white/60">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-white/30" />
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function FutureTopicsView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Temas Futuros"
        subtitle="Funcionalidades planejadas para próximas versões do Fashion AI — além das Sprints 1, 2 e 3."
      />

      {/* Context banner */}
      <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 shrink-0 text-lg">◇</span>
          <div>
            <p className="text-sm font-semibold text-amber-200">Fora do escopo atual</p>
            <p className="mt-0.5 text-sm text-amber-100/70">
              Os temas desta página fazem parte do roadmap de evolução do Fashion AI, mas não integram
              o produto das Sprints 1, 2 e 3. São apresentados aqui como visão de futuro e referência
              para desenvolvimento contínuo da plataforma.
            </p>
          </div>
        </div>
      </div>

      {/* Topics */}
      <SectionBlock
        title="Funcionalidades Planejadas"
        subtitle="Clique em 'Ver mais' para expandir a descrição de cada tema."
      >
        <div className="mt-4 space-y-4">
          {TOPICS.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </SectionBlock>

      {/* Status legend */}
      <SectionBlock title="Legenda de Status" subtitle="Indica o estágio atual de cada tema futuro.">
        <div className="mt-3 flex flex-wrap gap-3">
          {(Object.entries(STATUS_LABELS) as Array<[FutureTopic['status'], string]>).map(([key, label]) => {
            const topic = TOPICS.find((t) => t.status === key);
            return (
              <span key={key} className={`rounded-full border px-3 py-1 text-xs font-medium ${topic?.badgeClass ?? 'border-white/20 text-white/60'}`}>
                {label}
              </span>
            );
          })}
          <p className="w-full text-xs text-white/40 mt-1">
            Planejado — já especificado para implementação futura · Em Pesquisa — sendo explorado tecnicamente · Conceito — proposta inicial
          </p>
        </div>
      </SectionBlock>
    </div>
  );
}
