'use client';

import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface DashboardStats {
  usersPerMonth: { month: string; count: number }[];
  piecesByBrand: { brand: string; count: number }[];
  pipelinesByPiece: { piece: string; count: number }[];
  schemesByUser: { user: string; count: number }[];
  piecesByUser: { user: string; count: number }[];
  meta: {
    totalUsers: number;
    totalPieces: number;
    totalPipelines: number;
    totalSchemes: number;
    totalBrands: number;
  };
}

const CHART_COLORS = {
  primary: '#7c3aed',
  secondary: '#db2777',
  tertiary: '#0ea5e9',
  success: '#22c55e',
  warning: '#f59e0b',
};

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '1rem',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ marginBottom: '1rem' }}>
        <h2
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--card-foreground)',
            margin: 0,
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            style={{
              fontSize: '0.78rem',
              color: 'var(--muted-foreground)',
              margin: '0.25rem 0 0',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      style={{
        background: 'var(--card)',
        border: `1px solid ${color}33`,
        borderRadius: '0.75rem',
        padding: '1rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
      }}
    >
      <span
        style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--muted-foreground)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: '2rem',
          fontWeight: 800,
          color,
          lineHeight: 1,
        }}
      >
        {value.toLocaleString('pt-BR')}
      </span>
    </div>
  );
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: '#1e1b2e',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '0.5rem',
        padding: '0.5rem 0.85rem',
        fontSize: '0.82rem',
        color: '#fff',
      }}
    >
      <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)' }}>{label}</p>
      <p style={{ margin: '2px 0 0', fontWeight: 700 }}>{payload[0].value}</p>
    </div>
  );
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((res) => {
        if (res.status === 401) throw new Error('401');
        if (res.status === 403) throw new Error('403');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<DashboardStats>;
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'var(--background)',
    padding: '2rem',
    fontFamily: 'Inter, sans-serif',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '2rem',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '1.25rem',
  };

  if (loading) {
    return (
      <div style={{ ...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--muted-foreground)' }}>
          <div
            style={{
              width: 48,
              height: 48,
              border: '3px solid var(--border)',
              borderTopColor: CHART_COLORS.primary,
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 1rem',
            }}
          />
          <p style={{ margin: 0 }}>Carregando dados do banco...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (error) {
    const isAuth = error === '401' || error === '403';
    return (
      <div style={{ ...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '0.75rem',
            padding: '1.5rem 2rem',
            color: '#991b1b',
            maxWidth: 420,
            textAlign: 'center',
          }}
        >
          <p style={{ fontWeight: 700, margin: '0 0 0.5rem' }}>
            {isAuth ? 'Acesso negado' : 'Erro ao carregar dashboard'}
          </p>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>
            {error === '401'
              ? 'Você precisa estar autenticado para acessar esta página.'
              : error === '403'
              ? 'Apenas administradores podem acessar este dashboard.'
              : error}
          </p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const chartHeight = 280;
  const tickStyle = { fill: 'var(--muted-foreground)', fontSize: 11 };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--primary)',
            margin: '0 0 0.25rem',
          }}
        >
          Dashboard Administrativo
        </h1>
        <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
          Visão geral dos dados da plataforma SAI
        </p>
      </header>

      {/* Summary cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <StatCard label="Usuários" value={stats.meta.totalUsers} color={CHART_COLORS.primary} />
        <StatCard label="Peças de Roupa" value={stats.meta.totalPieces} color={CHART_COLORS.secondary} />
        <StatCard label="Pipelines 3D" value={stats.meta.totalPipelines} color={CHART_COLORS.tertiary} />
        <StatCard label="Esquemas" value={stats.meta.totalSchemes} color={CHART_COLORS.success} />
        <StatCard label="Marcas" value={stats.meta.totalBrands} color={CHART_COLORS.warning} />
      </div>

      {/* Charts grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(520px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Chart 1: Users per month 2026 */}
        <ChartCard
          title="Usuários Cadastrados — Histórico"
          subtitle="Novos cadastros por mês (todos os anos)"
        >
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={stats.usersPerMonth} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={tickStyle} axisLine={false} tickLine={false} />
              <YAxis tick={tickStyle} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: `${CHART_COLORS.primary}18` }} />
              <Bar dataKey="count" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} name="Usuários" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 2: Pieces per brand */}
        <ChartCard
          title="Peças de Roupa por Marca"
          subtitle="Total de peças criadas agrupadas por marca (top 15)"
        >
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
              data={stats.piecesByBrand}
              layout="vertical"
              margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={tickStyle} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="brand"
                tick={{ ...tickStyle, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: `${CHART_COLORS.secondary}18` }} />
              <Bar dataKey="count" fill={CHART_COLORS.secondary} radius={[0, 4, 4, 0]} name="Peças" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 3: 3D pipelines per piece */}
        <ChartCard
          title="Pipelines 3D Gerados por Peça"
          subtitle="Número de gerações 3D por nome de peça (top 15)"
        >
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
              data={stats.pipelinesByPiece}
              layout="vertical"
              margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={tickStyle} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="piece"
                tick={{ ...tickStyle, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={110}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: `${CHART_COLORS.tertiary}18` }} />
              <Bar dataKey="count" fill={CHART_COLORS.tertiary} radius={[0, 4, 4, 0]} name="Pipelines" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 4: Schemes per user */}
        <ChartCard
          title="Esquemas de Vestimenta por Usuário"
          subtitle="Quantidade de looks criados por cada usuário (top 15)"
        >
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
              data={stats.schemesByUser}
              layout="vertical"
              margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={tickStyle} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="user"
                tick={{ ...tickStyle, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={110}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: `${CHART_COLORS.success}18` }} />
              <Bar dataKey="count" fill={CHART_COLORS.success} radius={[0, 4, 4, 0]} name="Esquemas" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 5: Pieces per user */}
        <ChartCard
          title="Peças de Roupa por Usuário"
          subtitle="Quantidade de peças criadas por cada usuário (top 15)"
        >
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
              data={stats.piecesByUser}
              layout="vertical"
              margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={tickStyle} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="user"
                tick={{ ...tickStyle, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={110}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: `${CHART_COLORS.warning}18` }} />
              <Bar dataKey="count" fill={CHART_COLORS.warning} radius={[0, 4, 4, 0]} name="Peças" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <footer
        style={{
          marginTop: '2.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border)',
          textAlign: 'center',
          color: 'var(--muted-foreground)',
          fontSize: '0.78rem',
        }}
      >
        SAI Dashboard · Dados em tempo real do Firestore
      </footer>
    </div>
  );
}
