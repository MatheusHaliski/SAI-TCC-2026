'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthSessionProfile } from '@/app/lib/authSession';
import { AppRoute } from '@/app/lib/stylist-shell';

interface DashboardStat {
  label: string;
  value: string;
  color: string;
  icon: React.ReactNode;
}

const ShirtIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" width="24" height="24"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg>;
const SparklesIcon = () => <img src="/80A950EF-F93D-4C1B-89B8-17490D321F97_1_105_c.jpeg" alt="sparkles" width="24" height="24" style={{ objectFit: 'cover', borderRadius: '4px' }} />;
const HeartIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" width="24" height="24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>;
const TrendIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" width="24" height="24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
const ArrowRightIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const CalendarIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;

interface HomeViewProps {
  onNavigate?: (route: AppRoute) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  const [userName, setUserName] = useState('');
  const [wardrobeCount, setWardrobeCount] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const profile = getAuthSessionProfile();
    if (profile?.name) setUserName(profile.name.split(' ')[0]);

    // Fetch wardrobe count
    fetch('/api/wardrobe-items?limit=1')
      .then(r => r.json())
      .then((data: unknown) => {
        const d = data as { total?: number };
        if (typeof d?.total === 'number') setWardrobeCount(d.total);
      })
      .catch(() => {});
  }, []);

  const navigate = (route: AppRoute) => {
    if (onNavigate) { onNavigate(route); return; }
    const paths: Record<AppRoute, string> = {
      'home': '/',
      'my-wardrobe': '/my-wardrobe',
      'create-my-scheme': '/create-my-scheme',
      'explore-scheme': '/explore-scheme',
      'autopilot': '/autopilot',
      'my-photos': '/my-photos',
      'future-topics': '/future-topics',
      'maison': '/maison',
      'profile': '/profile',
      'profile-settings': '/profile/settings',
      'search-items': '/search-items',
      'search-pieces': '/search-pieces',
      'dress-tester': '/dress-tester',
    };
    router.push(paths[route]);
  };

  const stats: DashboardStat[] = [
    { label: 'Peças no Guarda-roupa', value: wardrobeCount != null ? String(wardrobeCount) : '—', color: '#3b82f6', icon: <ShirtIcon /> },
    { label: 'Looks Criados', value: '—', color: '#8b5cf6', icon: <SparklesIcon /> },
    { label: 'Favoritos', value: '—', color: '#ec4899', icon: <HeartIcon /> },
    { label: 'Tendências Ativas', value: '5', color: '#10b981', icon: <TrendIcon /> },
  ];

  const recentOutfits = [
    { id: 1, name: 'Casual Chic', items: 3, date: '28 Mar' },
    { id: 2, name: 'Business Meeting', items: 4, date: '27 Mar' },
    { id: 3, name: 'Weekend Vibes', items: 3, date: '26 Mar' },
  ];

  const aiSuggestions = [
    { emoji: '🌟', title: 'Tendência de Verão', desc: 'Cores vibrantes estão em alta esta estação' },
    { emoji: '💡', title: 'Combinação Sugerida', desc: 'Que tal combinar sua blusa azul com a saia midi?' },
    { emoji: '🛍️', title: 'Peça em Falta', desc: 'Um blazer complementaria seu guarda-roupa' },
  ];

  const card: React.CSSProperties = {
    background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '1rem',
    padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  };

  return (
    <div style={{ padding: '0.5rem 0' }}>
      {/* Greeting */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          Bem-vindo{userName ? `, ${userName}` : ''} de volta! 👋
        </h2>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9375rem' }}>
          Aqui está um resumo do seu guarda-roupa
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(stat => (
          <div key={stat.label} style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', background: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stat.icon}
              </div>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--foreground)' }}>{stat.value}</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {/* AI action */}
        <div style={{ borderRadius: '1rem', padding: '2rem', background: 'linear-gradient(135deg,#7c3aed,#db2777)', color: '#fff' }}>
          <img src="/80A950EF-F93D-4C1B-89B8-17490D321F97_1_105_c.jpeg" alt="sparkles" width="32" height="32" style={{ objectFit: 'cover', borderRadius: '6px', marginBottom: '0.75rem' }} />
          <h3 style={{ color: '#fff', fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Criar Look com IA</h3>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            Deixe nossa IA sugerir combinações perfeitas baseadas no seu estilo
          </p>
          <button
            onClick={() => navigate('create-my-scheme')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', color: '#7c3aed', border: 'none', borderRadius: '0.625rem', padding: '0.625rem 1.25rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}
          >
            Começar <ArrowRightIcon />
          </button>
        </div>

        {/* Wardrobe action */}
        <div style={card}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" width="32" height="32" style={{ marginBottom: '0.75rem' }}>
            <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/>
          </svg>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Adicionar Peças</h3>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            Expanda seu guarda-roupa digital com novas peças
          </p>
          <button
            onClick={() => navigate('my-wardrobe')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '0.625rem', padding: '0.625rem 1.25rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}
          >
            Ir para Guarda-roupa <ArrowRightIcon />
          </button>
        </div>
      </div>

      {/* Recent outfits */}
      <div style={{ ...card, marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Looks Recentes</h3>
          <button onClick={() => navigate('explore-scheme')} style={{ background: 'none', border: 'none', color: 'var(--muted-foreground)', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500 }}>
            Ver todos
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {recentOutfits.map(outfit => (
            <div key={outfit.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '0.75rem', background: 'var(--accent)', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SparklesIcon />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{outfit.name}</p>
                  <p style={{ color: 'var(--muted-foreground)', fontSize: '0.8125rem' }}>{outfit.items} peças</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--muted-foreground)', fontSize: '0.8125rem' }}>
                <CalendarIcon /> {outfit.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI suggestions */}
      <div style={card}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Sugestões da IA</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '0.75rem' }}>
          {aiSuggestions.map(s => (
            <div key={s.title} style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--accent)' }}>
              <p style={{ fontSize: '0.9375rem', marginBottom: '0.375rem' }}>{s.emoji} {s.title}</p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
