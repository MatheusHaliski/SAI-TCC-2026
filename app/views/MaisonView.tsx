'use client';

import { useEffect, useMemo, useState } from 'react';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';
import BrandBadge from '@/app/components/outfit-card/BrandBadge';
import { resolveBrandLogoUrlByName } from '@/app/lib/outfit-card';

type PriceRange = 'Acessível' | 'Moderado' | 'Premium' | 'Luxo';
type SustainabilityRating = 1 | 2 | 3 | 4 | 5;

interface IconicPiece {
  name: string;
  type: string;
  note: string;
  icon: string;
}

interface SeasonTips {
  verao: string;
  outono: string;
  inverno: string;
  primavera: string;
}

interface BrandProfile {
  category: string;
  segment: string;
  targetAudience: string;
  audienceAge: string;
  audienceProfile: string;
  audienceValues: string[];
  origin: string;
  founded: number;
  positioning: string;
  tags: string[];
  accentColor: string;
  priceRange: PriceRange;
  priceNote: string;
  seasons: SeasonTips;
  iconicPieces: IconicPiece[];
  occasions: string[];
  colorPalette: string[];
  pairsWith: string[];
  sustainability: { rating: SustainabilityRating; note: string };
}

const PREMIUM_BRAND_SEAL_SCHEMES = [
  {
    id: 'premium-brand-1',
    brand: 'Nike',
    creator: 'Ari Studio',
    title: 'Air Tailoring Motion',
    note: 'Esquema com selo premium vigente: performance, alfaiataria esportiva e leitura limpa de marca.',
  },
  {
    id: 'premium-brand-2',
    brand: 'Lacoste',
    creator: 'Maison Norte',
    title: 'Polo Garden Capsule',
    note: 'Curadoria mensal com selo premium aplicado ao esquema e destaque visual no feed da marca.',
  },
  {
    id: 'premium-brand-3',
    brand: 'Adidas',
    creator: 'Three Lines Lab',
    title: 'Terrace Club Weekend',
    note: 'Look publicado com selo premium durante o mes atual para ampliar descoberta por marca.',
  },
];

const BRAND_PROFILES: Record<string, BrandProfile> = {
  adidas: {
    category: 'Esportivo & Streetwear',
    segment: 'Performance / Lifestyle',
    targetAudience: 'Atletas e entusiastas de cultura urbana',
    audienceAge: '16–35 anos',
    audienceProfile: 'Jovens conectados à cultura do esporte, música e arte de rua',
    audienceValues: ['Performance', 'Autenticidade', 'Cultura Urbana', 'Colaboração'],
    origin: 'Alemanha',
    founded: 1949,
    positioning: 'Impossible is Nothing — fusão de alto desempenho com estilo de rua.',
    tags: ['Sportswear', 'Streetwear', 'Sneaker Culture', 'Collaborations'],
    accentColor: 'rgba(125,211,252,0.85)',
    priceRange: 'Moderado',
    priceNote: 'R$ 150–1.200 por peça',
    seasons: {
      verao: 'Shorts e camisetas respiráveis das linhas Running e Originals. Tênis ventilados como o Stan Smith ou Ultraboost. Cores vivas e lavados claros.',
      outono: 'Corta-ventos Tiro Track, hoodies de algodão e calças de nylon. Ideal para treinos ao ar livre em dias frescos.',
      inverno: 'Puffers da linha Premium, agasalhos em lã polar e tênis de cano alto. O adidas Puffer é referência de custo-benefício no frio.',
      primavera: 'Leggings coloridas, camisetas de manga longa e o Stan Smith branco — clássico de retorno ao calor.',
    },
    iconicPieces: [
      { name: 'Stan Smith', type: 'Tênis', note: 'O tênis mais vendido da história; ícone atemporal desde 1971', icon: '👟' },
      { name: 'Ultraboost', type: 'Tênis', note: 'Tecnologia Boost de amortecimento para corrida e lifestyle', icon: '🏃' },
      { name: 'Superstar', type: 'Tênis', note: 'Couro com ponta Shell Toe — ícone do hip-hop dos anos 80', icon: '⭐' },
      { name: 'Track Jacket 3-Stripes', type: 'Jaqueta', note: 'As três listras que definiram o DNA visual da marca', icon: '🧥' },
      { name: 'Tiro Pants', type: 'Calça', note: 'Calça esportiva com vibe de futebol e uso cotidiano', icon: '👖' },
      { name: 'Forum Low', type: 'Tênis', note: 'Referência do basquete dos anos 80, revivido pelo streetwear', icon: '🏀' },
      { name: 'Gazelle', type: 'Tênis', note: 'Camurça suave e silhueta slim; preferido no Britpop e indie', icon: '🦌' },
      { name: 'Adilette Slides', type: 'Calçado', note: 'Slide pós-treino que virou item de lifestyle e beach culture', icon: '🩴' },
      { name: 'NMD R1', type: 'Tênis', note: 'Plataforma Boost com visual futurista inspirado nos anos 80', icon: '🚀' },
      { name: 'Hoodie Trefoil', type: 'Moletom', note: 'O Trefoil bordado — símbolo do Originals em formato casual', icon: '🌿' },
    ],
    occasions: ['Treino', 'Casual Urbano', 'Streetwear', 'Show & Evento', 'Viagem'],
    colorPalette: ['#FFFFFF', '#000000', '#3B82F6', '#EF4444', '#10B981'],
    pairsWith: ['nike', 'puma', 'levi\'s'],
    sustainability: { rating: 3, note: 'Linha Parley usa plástico reciclado de oceanos. Meta de alcançar neutralidade de carbono até 2050.' },
  },

  nike: {
    category: 'Esportivo & Lifestyle',
    segment: 'Performance / Premium Casual',
    targetAudience: 'Atletas e consumidores de moda esportiva',
    audienceAge: '14–40 anos',
    audienceProfile: 'Performáticos e aspiracionais que conectam esporte com identidade pessoal',
    audienceValues: ['Superação', 'Inovação', 'Empoderamento', 'Status'],
    origin: 'Estados Unidos',
    founded: 1964,
    positioning: 'Just Do It — motivação, superação e estilo de vida ativo.',
    tags: ['Sportswear', 'Running', 'Basketball', 'Sneaker Culture'],
    accentColor: 'rgba(251,113,133,0.85)',
    priceRange: 'Moderado',
    priceNote: 'R$ 200–2.500 por peça',
    seasons: {
      verao: 'Camisetas Dri-FIT, shorts leves e Air Max brancos ou pastéis — máxima ventilação e estilo sob o calor.',
      outono: 'Tech Fleece, corta-ventos Shield e meias-calças de compressão para treinos em temperatura amena.',
      inverno: 'Puffer vests, calças Therma-FIT e botas ACG para dias frios e chuvosos sem abrir mão do visual.',
      primavera: 'Camisetas manga longa Dri-FIT, Air Force 1 coloridos e shorts de corrida para retomada dos treinos.',
    },
    iconicPieces: [
      { name: 'Air Force 1', type: 'Tênis', note: 'Lançado em 1982; o tênis mais versátil do mercado — street e social', icon: '🤍' },
      { name: 'Air Jordan 1', type: 'Tênis', note: 'De Michael Jordan para o mundo; definiu o mercado de sneakers premium', icon: '🐐' },
      { name: 'Dri-FIT T-shirt', type: 'Camiseta', note: 'Tecnologia de absorção de suor presente em todo o portfólio performance', icon: '💧' },
      { name: 'Tech Fleece Hoodie', type: 'Moletom', note: 'Material ultraleve com isolamento térmico — o moletom high-tech', icon: '🔬' },
      { name: 'Air Max 90', type: 'Tênis', note: 'A janela de ar visível mais icônica; símbolo dos anos 90', icon: '💨' },
      { name: 'Blazer Mid', type: 'Tênis', note: 'Silhueta limpa e retro; favorito em combinações smart-casual', icon: '🎯' },
      { name: 'Vaporfly Next%', type: 'Tênis', note: 'Tênis de corrida com placa de carbono que quebra recordes mundiais', icon: '⚡' },
      { name: 'Cortez', type: 'Tênis', note: 'O primeiro tênis Nike — design original do fundador Bill Bowerman', icon: '🏁' },
      { name: 'ACG Cargo Pants', type: 'Calça', note: 'Linha All Conditions Gear para uso outdoor com vibe gorpcore', icon: '🏔️' },
      { name: 'Pro Compression Tights', type: 'Calça', note: 'Referência em compressão muscular para treino e recuperação', icon: '🦵' },
    ],
    occasions: ['Treino', 'Corrida', 'Casual Urbano', 'Streetwear', 'Basquete', 'Lifestyle'],
    colorPalette: ['#EF4444', '#000000', '#FFFFFF', '#F97316', '#3B82F6'],
    pairsWith: ['adidas', 'levi\'s', 'puma'],
    sustainability: { rating: 3, note: 'Move to Zero: meta de emissões neutras e zero resíduo. Uso crescente de poliéster reciclado nas linhas performance.' },
  },

  zara: {
    category: 'Fast Fashion Premium',
    segment: 'High-Street Fashion',
    targetAudience: 'Consumidores de moda contemporânea',
    audienceAge: '18–45 anos',
    audienceProfile: 'Urbanistas que seguem tendências de passarela com acessibilidade financeira',
    audienceValues: ['Tendência', 'Versatilidade', 'Renovação', 'Estética Contemporânea'],
    origin: 'Espanha',
    founded: 1975,
    positioning: 'Tendências de passarela a preços acessíveis, renovadas quinzenalmente.',
    tags: ['Fast Fashion', 'Contemporary', 'Minimalist', 'Trend-Driven'],
    accentColor: 'rgba(203,213,225,0.85)',
    priceRange: 'Moderado',
    priceNote: 'R$ 120–900 por peça',
    seasons: {
      verao: 'Vestidos linho, tops cropped, calças wide-leg em tecidos leves e mules de couro — tons terrosos e brancos.',
      outono: 'Trench coat oversize, suéteres texturizados e botas de cano longo em couro legítimo ou sintético.',
      inverno: 'Casacos estruturados em tweed, cachecóis de lã, calças alfaiataria em cores neutras.',
      primavera: 'Blazer crop, calças cargo, camisas listradas e tênis minimalistas brancos para o street casual.',
    },
    iconicPieces: [
      { name: 'Blazer Oversize', type: 'Blazer', note: 'O item mais copiado de temporada — versátil do casual ao social', icon: '🧥' },
      { name: 'Trench Coat', type: 'Casaco', note: 'Clássico revisitado a cada coleção com cortes e cores modernos', icon: '🌧️' },
      { name: 'Calça Wide-Leg', type: 'Calça', note: 'A silhueta fluida que dominou o high-street nos anos 2020', icon: '👖' },
      { name: 'Vestido Linho', type: 'Vestido', note: 'Peça-chave das coleções de verão — leve, elegante e acessível', icon: '🌞' },
      { name: 'Biker Jacket', type: 'Jaqueta', note: 'Couro sintético com acabamento premium; ícone do estilo urbano', icon: '🏍️' },
      { name: 'Loafer', type: 'Calçado', note: 'Mocassim atemporal que transita do casual ao work outfit', icon: '👞' },
      { name: 'Top Tricot', type: 'Top', note: 'Modelo crochet e tricot que virou tendência global via Zara', icon: '🧶' },
      { name: 'Calça Alfaiataria', type: 'Calça', note: 'O básico elevado — estrutura formal com uso casual moderno', icon: '📐' },
      { name: 'Cardigan Texturizado', type: 'Cardigan', note: 'Sobreposição favorita das coleções de outono-inverno', icon: '🍂' },
      { name: 'Midi Dress', type: 'Vestido', note: 'Comprimento midi — equilíbrio entre sensualidade e elegância', icon: '💃' },
    ],
    occasions: ['Casual', 'Trabalho', 'Social', 'Eventos', 'Urbano', 'Viagem'],
    colorPalette: ['#F5F5F0', '#1C1C1C', '#C8B89A', '#8B7355', '#D4C5B0'],
    pairsWith: ['lacoste', 'levi\'s', 'c&a'],
    sustainability: { rating: 2, note: 'Coleção Join Life usa materiais sustentáveis. Ainda criticada pelo volume de produção e descarte rápido.' },
  },

  puma: {
    category: 'Esportivo & Streetwear',
    segment: 'Lifestyle / Performance',
    targetAudience: 'Jovens urbanos e apreciadores de cultura pop',
    audienceAge: '16–32 anos',
    audienceProfile: 'Consumidores de moda híbrida entre esporte, música e lifestyle urbano',
    audienceValues: ['Velocidade', 'Ousadia', 'Cultura Pop', 'Autoexpressão'],
    origin: 'Alemanha',
    founded: 1948,
    positioning: 'Forever Faster — velocidade, ousadia e expressão cultural.',
    tags: ['Streetwear', 'Sportswear', 'Motorsport', 'Pop Culture'],
    accentColor: 'rgba(251,146,60,0.85)',
    priceRange: 'Moderado',
    priceNote: 'R$ 150–900 por peça',
    seasons: {
      verao: 'Shorts esportivos, camisetas gráficas e Suede branco ou pastel — estilo retro de verão com influência skate.',
      outono: 'Jaquetas bomber, calças track em nylon e tênis de camurça em tons terrosos.',
      inverno: 'Agasalhos forrados, hoodies oversized e botas de couro cano alto com acabamento Puma.',
      primavera: 'Camisas polo de tricô, leggings coloridas e Clyde Court em tons vibrantes para volta ao calor.',
    },
    iconicPieces: [
      { name: 'Suede Classic', type: 'Tênis', note: 'O tênis de camurça mais icônico — símbolo do streetwear desde 1968', icon: '🐆' },
      { name: 'RS-X', type: 'Tênis', note: 'Solado chunky com visual futurista e colaborações cobiçadas', icon: '🚀' },
      { name: 'Clyde', type: 'Tênis', note: 'Criado para Walt "Clyde" Frazier — referência do basquete e hip-hop', icon: '🏀' },
      { name: 'Cali', type: 'Tênis', note: 'Silhueta feminina inspirada no California lifestyle — clean e versátil', icon: '🌴' },
      { name: 'Track Jacket', type: 'Jaqueta', note: 'DNA motorsport com acabamento veludo — ícone das pistas e festas', icon: '🏎️' },
      { name: 'Palermo', type: 'Tênis', note: 'Couro liso com detalhes gráficos; favorito das colaborações com designers', icon: '🎨' },
      { name: 'Future Rider', type: 'Tênis', note: 'Mistura retro-futurista da Running dos anos 80 repaginada', icon: '⚡' },
      { name: 'Nitro Runner', type: 'Tênis', note: 'Tecnologia de espuma NITRO para máxima leveza e amortecimento', icon: '💨' },
      { name: 'Hoops Crew Neck', type: 'Moletom', note: 'Gola careca de algodão pesado com bordado Puma — básico premium', icon: '🏀' },
      { name: 'Motorsport Polo', type: 'Polo', note: 'Referência nas competições de F1 e Motorsport da marca', icon: '🏁' },
    ],
    occasions: ['Casual', 'Streetwear', 'Sport', 'Lifestyle', 'Cultura Pop', 'Shows'],
    colorPalette: ['#F97316', '#9333EA', '#000000', '#FBBF24', '#EC4899'],
    pairsWith: ['adidas', 'nike', 'c&a'],
    sustainability: { rating: 3, note: 'Programa RE:SUEDE — tênis biodegradáveis em teste. Parcerias com algodão orgânico e materiais reciclados.' },
  },

  lacoste: {
    category: 'Casual Premium',
    segment: 'Preppy / Sport-Chic',
    targetAudience: 'Consumidores de estilo clássico e elegância casual',
    audienceAge: '22–50 anos',
    audienceProfile: 'Profissionais e esportistas que valorizam refinamento sem ostentação',
    audienceValues: ['Sofisticação', 'Elegância', 'Tradição', 'Conforto Premium'],
    origin: 'França',
    founded: 1933,
    positioning: 'Life is a Beautiful Sport — sofisticação com raízes no tênis clássico.',
    tags: ['Classic', 'Sport-Chic', 'Premium Casual', 'Polo'],
    accentColor: 'rgba(52,211,153,0.85)',
    priceRange: 'Premium',
    priceNote: 'R$ 400–3.500 por peça',
    seasons: {
      verao: 'Polo piqué em cores vibrantes, shorts chino e tênis Lerond branco — o clássico de verão europeu.',
      outono: 'Camisetas gola V em algodão, tênis Esparre e moletom bordado com o crocodilo icônico.',
      inverno: 'Suéteres zip em lã merino, casacos Heritage e calças de moletom pesado em tons clássicos.',
      primavera: 'Polo slim manga longa em pastel, tênis Carnaby e calças chino em tons terrosos suaves.',
    },
    iconicPieces: [
      { name: 'Polo L.12.12', type: 'Polo', note: 'A polo original criada por René Lacoste em 1933 — peça fundadora da marca', icon: '🐊' },
      { name: 'Lerond Sneaker', type: 'Tênis', note: 'Couro branco com detalhe verde — o clássico tênis da marca', icon: '🎾' },
      { name: 'Carnaby Evo', type: 'Tênis', note: 'Blend de performance e lifestyle urbano com logo minimalista', icon: '👟' },
      { name: 'Chino Slim', type: 'Calça', note: 'A calça de algodão que transita do casual ao work outfit', icon: '📏' },
      { name: 'Câble Sweater', type: 'Suéter', note: 'Tricô de algodão em ponto cabo — referência do preppy clássico', icon: '🧶' },
      { name: 'Zippered Hoodie', type: 'Moletom', note: 'Moletom com zip e detalhe de crocodilo — casual premium', icon: '🦎' },
      { name: 'T-Clip Sneaker', type: 'Tênis', note: 'Design inspirado nos anos 80 com silhueta moderna e limpa', icon: '✂️' },
      { name: 'Polo Dress', type: 'Vestido', note: 'O vestido polo — extensão feminina do DNA da marca', icon: '🌸' },
      { name: 'Track Jacket Malha', type: 'Jaqueta', note: 'Jaqueta de malha técnica com acabamento polo — sport-chic puro', icon: '🏃' },
      { name: 'Bomber Heritage', type: 'Jaqueta', note: 'Revisão do bomber clássico com acabamento sutil e premium', icon: '✈️' },
    ],
    occasions: ['Casual Premium', 'Trabalho', 'Social', 'Esporte de Quadra', 'Veraneio', 'Eventos'],
    colorPalette: ['#10B981', '#FFFFFF', '#1E3A8A', '#FCD34D', '#F9A8D4'],
    pairsWith: ['zara', 'adidas', 'levi\'s'],
    sustainability: { rating: 3, note: 'Parceria com IUCN para preservação de espécies ameaçadas. Linha Lacoste x Save Our Species.' },
  },

  'levi\'s': {
    category: 'Denim & Casual',
    segment: 'Heritage / Everyday',
    targetAudience: 'Todos os perfis que valorizam autenticidade e durabilidade',
    audienceAge: '18–50 anos',
    audienceProfile: 'Consumidores que buscam qualidade genuína, história e versatilidade cotidiana',
    audienceValues: ['Autenticidade', 'Durabilidade', 'Heritage', 'Inclusão'],
    origin: 'Estados Unidos',
    founded: 1853,
    positioning: 'Live in Levi\'s — autenticidade, durabilidade e história americana.',
    tags: ['Denim', 'Heritage', 'Casual', 'Americana'],
    accentColor: 'rgba(147,197,253,0.85)',
    priceRange: 'Moderado',
    priceNote: 'R$ 200–900 por peça',
    seasons: {
      verao: 'Shorts 501, camisetas brancas e Trucker jacket em denim lavado claro — o look de verão americano.',
      outono: 'Jaqueta Trucker em denim médio, calça 501 clássica e camisas xadrez para dias amenos.',
      inverno: 'Sherpa Trucker com forro de lã, calças jeans skinny escuro e camisas de flanela pesada.',
      primavera: 'Calças 512 Slim Taper, jaquetas vintage wash e camisetas cropped para o retorno ao calor.',
    },
    iconicPieces: [
      { name: '501 Original Jeans', type: 'Calça', note: 'O jeans original de 1873 — a peça de roupa mais influente da história', icon: '🔵' },
      { name: 'Trucker Jacket', type: 'Jaqueta', note: 'Jaqueta de denim lançada em 1962; ícone contracultural absoluto', icon: '🚛' },
      { name: '512 Slim Taper', type: 'Calça', note: 'Slim taper moderno — o corte preferido do streetwear contemporâneo', icon: '📐' },
      { name: 'Sherpa Jacket', type: 'Jaqueta', note: 'Trucker com forro de lã sintética — o must-have do inverno casual', icon: '🐑' },
      { name: '505 Regular', type: 'Calça', note: 'O corte reto clássico — versão original e atemporal dos jeans', icon: '🎸' },
      { name: '510 Skinny', type: 'Calça', note: 'Skinny fit que definiu uma geração — preferido no indie e rock', icon: '🎵' },
      { name: 'Camiseta Batwing', type: 'Camiseta', note: 'O logo Batwing no peito — básico absoluto da marca', icon: '🦇' },
      { name: 'Wide Leg Jeans', type: 'Calça', note: 'Silhueta ampla dos anos 90 revisitada com lavagens modernas', icon: '🌊' },
      { name: 'Engineer Boots', type: 'Bota', note: 'Bota clássica americana em couro — símbolo da cultura workwear', icon: '⚙️' },
      { name: '514 Straight', type: 'Calça', note: 'O corte reto moderno — equilíbrio entre o clássico e o atual', icon: '📏' },
    ],
    occasions: ['Casual', 'Heritage', 'Trabalho Casual', 'Urbano', 'Festas Informais', 'Viagem'],
    colorPalette: ['#1E3A8A', '#9CA3AF', '#FFFFFF', '#92400E', '#1F2937'],
    pairsWith: ['nike', 'adidas', 'zara', 'c&a'],
    sustainability: { rating: 4, note: 'WaterLess® reduz até 96% da água no processo. Linha SecondHand e programa de reciclagem de jeans.' },
  },

  'c&a': {
    category: 'Fast Fashion Popular',
    segment: 'Acessível / Família',
    targetAudience: 'Famílias e consumidores de moda acessível',
    audienceAge: 'Todas as idades',
    audienceProfile: 'Consumidores que priorizam preço justo, variedade e moda inclusiva para o dia a dia',
    audienceValues: ['Acessibilidade', 'Inclusão', 'Variedade', 'Praticidade'],
    origin: 'Países Baixos',
    founded: 1841,
    positioning: 'Moda para todos — preço justo, variedade e inclusão.',
    tags: ['Fast Fashion', 'Family', 'Affordable', 'Basics'],
    accentColor: 'rgba(167,243,208,0.85)',
    priceRange: 'Acessível',
    priceNote: 'R$ 30–300 por peça',
    seasons: {
      verao: 'Vestidos florais leves, regatas básicas, shorts e biquínis — variedade completa para o calor com ótimo custo-benefício.',
      outono: 'Cardigans de malha, calças confortáveis e casacos leves de nylon para a transição de temperatura.',
      inverno: 'Puffers acessíveis, moletões grossos, calças de veludo cotelê e botas de cano curto no frio.',
      primavera: 'Camisetas coloridas, calças jogger, tênis básicos e vestidos midi para a retomada do calor.',
    },
    iconicPieces: [
      { name: 'Basic T-shirt', type: 'Camiseta', note: 'A camiseta básica de algodão — a mais vendida do Brasil pela acessibilidade', icon: '👕' },
      { name: 'Legging Comfort', type: 'Calça', note: 'Legging de suplex com fit ajustado — o básico versátil feminino', icon: '🧘' },
      { name: 'Cardigan Malha', type: 'Cardigan', note: 'Sobreposição de malha com excelente custo-benefício por temporada', icon: '🧶' },
      { name: 'Vestido Floral', type: 'Vestido', note: 'Estampa floral que renova a cada verão — ícone do verão popular', icon: '🌸' },
      { name: 'Jaqueta Jeans', type: 'Jaqueta', note: 'Denim básico de qualidade acessível — peça coringa de transição', icon: '🔷' },
      { name: 'Puffer Leve', type: 'Jaqueta', note: 'Puffer de nylon leve e acessível para dias frios moderados', icon: '🌬️' },
      { name: 'Calça Jogger', type: 'Calça', note: 'Elástico na cintura e tornozelo — conforto máximo para o dia a dia', icon: '🏃' },
      { name: 'Moletom Básico', type: 'Moletom', note: 'Moletom de algodão leve — o básico acessível mais vendido', icon: '🎽' },
      { name: 'Blazer Casual', type: 'Blazer', note: 'Blazer acessível para work casual sem comprometer o orçamento', icon: '🧥' },
      { name: 'Shorts Alfaiataria', type: 'Short', note: 'Bermuda estruturada que eleva o visual casual de forma simples', icon: '📎' },
    ],
    occasions: ['Casual', 'Trabalho', 'Família', 'Escola', 'Lazer', 'Cotidiano'],
    colorPalette: ['#DC2626', '#2563EB', '#FFFFFF', '#16A34A', '#FBBF24'],
    pairsWith: ['zara', 'levi\'s', 'puma'],
    sustainability: { rating: 3, note: 'Programa Moda que Transforma — algodão BCI e poliéster reciclado em expansão. Meta de 100% de materiais sustentáveis até 2030.' },
  },
};

const PRICE_COLORS: Record<PriceRange, { bg: string; border: string; text: string }> = {
  Acessível: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(52,211,153,0.5)', text: 'text-emerald-200' },
  Moderado: { bg: 'rgba(59,130,246,0.15)', border: 'rgba(96,165,250,0.5)', text: 'text-blue-200' },
  Premium: { bg: 'rgba(139,92,246,0.15)', border: 'rgba(167,139,250,0.5)', text: 'text-violet-200' },
  Luxo: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(251,191,36,0.5)', text: 'text-amber-200' },
};

const SEASON_META: Record<keyof SeasonTips, { label: string; icon: string; color: string }> = {
  verao: { label: 'Verão', icon: '☀️', color: 'rgba(251,191,36,0.15)' },
  outono: { label: 'Outono', icon: '🍂', color: 'rgba(249,115,22,0.12)' },
  inverno: { label: 'Inverno', icon: '❄️', color: 'rgba(96,165,250,0.12)' },
  primavera: { label: 'Primavera', icon: '🌸', color: 'rgba(244,114,182,0.12)' },
};

interface BrandData {
  brand_id: string;
  name: string;
  logo_url: string | null;
  is_active: boolean;
}

interface WardrobePreviewItem {
  wardrobe_item_id: string;
  name: string;
  piece_type: string;
  image_url?: string | null;
  color?: string;
}

function SustainabilityStars({ rating }: { rating: SustainabilityRating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`text-sm ${i < rating ? 'text-emerald-300' : 'text-white/20'}`}>
          ★
        </span>
      ))}
    </div>
  );
}

function BrandPanel({ brand, onClose }: { brand: BrandData; onClose: () => void }) {
  const nameKey = brand.name.toLowerCase();
  const profile = BRAND_PROFILES[nameKey];
  const logoUrl = brand.logo_url || resolveBrandLogoUrlByName(brand.name) || undefined;
  const [pieces, setPieces] = useState<WardrobePreviewItem[]>([]);
  const [loadingPieces, setLoadingPieces] = useState(true);
  const [activeTab, setActiveTab] = useState<'perfil' | 'pecas-iconicas' | 'estacoes' | 'plataforma'>('perfil');

  useEffect(() => {
    fetch(`/api/wardrobe-items?brand_id=${encodeURIComponent(brand.brand_id)}&limit=10`)
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => {
        const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
        setPieces(items.slice(0, 10));
      })
      .catch(() => setPieces([]))
      .finally(() => setLoadingPieces(false));
  }, [brand.brand_id]);

  const accentColor = profile?.accentColor ?? 'rgba(203,213,225,0.8)';
  const accentBorder = accentColor.replace('0.85', '0.35');
  const accentBg = accentColor.replace('0.85', '0.08');
  const priceColors = profile ? PRICE_COLORS[profile.priceRange] : PRICE_COLORS['Moderado'];

  const TABS = [
    { key: 'perfil' as const, label: 'Perfil' },
    { key: 'pecas-iconicas' as const, label: 'Top 10 Peças' },
    { key: 'estacoes' as const, label: 'Por Estação' },
    { key: 'plataforma' as const, label: 'Na Plataforma' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 bg-white/5 shadow-lg"
            style={{ borderColor: accentColor }}
          >
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={`${brand.name} logo`} className="h-12 w-12 rounded-xl object-contain" />
            ) : (
              <span className="text-2xl font-black text-white/60">{brand.name.slice(0, 2).toUpperCase()}</span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{brand.name}</h2>
            {profile && (
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <p className="text-xs text-white/50">{profile.origin} · Est. {profile.founded}</p>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${priceColors.text}`}
                  style={{ background: priceColors.bg, borderColor: priceColors.border }}
                >
                  {profile.priceRange} · {profile.priceNote}
                </span>
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg border border-white/20 px-3 py-1.5 text-xs text-white/60 transition hover:border-white/40 hover:text-white"
        >
          ← Voltar
        </button>
      </div>

      {/* Positioning */}
      {profile?.positioning && (
        <div
          className="rounded-2xl border p-4"
          style={{ borderColor: accentBorder, background: accentBg }}
        >
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/40">Posicionamento</p>
          <p className="text-sm italic leading-relaxed text-white/80">&ldquo;{profile.positioning}&rdquo;</p>
        </div>
      )}

      {/* Tab nav */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              activeTab === tab.key
                ? 'border-cyan-400/70 bg-cyan-500/20 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.18)]'
                : 'border-white/20 bg-white/5 text-white/60 hover:border-white/35 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: Perfil */}
      {activeTab === 'perfil' && profile && (
        <div className="space-y-4">
          {/* Audience */}
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4 space-y-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-white/40">Público-Alvo</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <p className="mb-1 text-[9px] uppercase tracking-wide text-white/35">Faixa Etária</p>
                <p className="text-sm font-semibold text-white/90">{profile.audienceAge}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="mb-1 text-[9px] uppercase tracking-wide text-white/35">Perfil</p>
                <p className="text-sm leading-snug text-white/80">{profile.audienceProfile}</p>
              </div>
            </div>
            <div>
              <p className="mb-2 text-[9px] uppercase tracking-wide text-white/35">O que valorizam</p>
              <div className="flex flex-wrap gap-2">
                {profile.audienceValues.map((v) => (
                  <span key={v} className="rounded-full border px-2.5 py-0.5 text-[11px] text-white/70"
                    style={{ borderColor: accentBorder, background: accentBg }}>
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Category + occasions */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/15 bg-white/5 p-3">
              <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/40">Categoria</p>
              <p className="text-sm font-semibold text-white/90">{profile.category}</p>
              <p className="mt-0.5 text-xs text-white/55">{profile.segment}</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/5 p-3">
              <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/40">Ocasiões</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.occasions.map((occ) => (
                  <span key={occ} className="rounded-lg border border-white/20 bg-white/5 px-2 py-0.5 text-[10px] text-white/70">
                    {occ}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Style tags */}
          <div>
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/40">Identidade de Estilo</p>
            <div className="flex flex-wrap gap-2">
              {profile.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border px-2.5 py-1 text-[11px] font-medium text-white/75"
                  style={{ borderColor: accentBorder, background: accentBg }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Color palette */}
          <div>
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/40">Paleta de Cores Assinatura</p>
            <div className="flex gap-2">
              {profile.colorPalette.map((hex) => (
                <div
                  key={hex}
                  title={hex}
                  className="h-8 w-8 rounded-full border-2 border-white/20 shadow-md"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>

          {/* Pairs with */}
          <div>
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/40">Combina com</p>
            <div className="flex flex-wrap gap-2">
              {profile.pairsWith.map((other) => (
                <span
                  key={other}
                  className="rounded-full border border-white/25 bg-white/5 px-3 py-1 text-xs font-semibold capitalize text-white/70"
                >
                  {other}
                </span>
              ))}
            </div>
          </div>

          {/* Sustainability */}
          <div className="rounded-xl border border-emerald-400/25 bg-emerald-500/5 p-3">
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-white/40">Sustentabilidade</p>
              <SustainabilityStars rating={profile.sustainability.rating} />
            </div>
            <p className="text-xs leading-snug text-white/65">{profile.sustainability.note}</p>
          </div>
        </div>
      )}

      {/* TAB: Top 10 Peças Icônicas */}
      {activeTab === 'pecas-iconicas' && profile && (
        <div className="space-y-2">
          <p className="text-xs text-white/50">As 10 peças mais icônicas e relevantes da {brand.name}.</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {profile.iconicPieces.map((piece, index) => (
              <div
                key={piece.name}
                className="flex items-start gap-3 rounded-xl border border-white/15 bg-white/5 p-3 transition hover:border-white/25 hover:bg-white/8"
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-lg"
                  style={{ borderColor: accentBorder, background: accentBg }}
                >
                  {piece.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-white/90">{piece.name}</p>
                    <span className="shrink-0 text-[9px] font-bold text-white/30">#{index + 1}</span>
                  </div>
                  <p className="text-[9px] font-medium uppercase tracking-wide text-white/40">{piece.type}</p>
                  <p className="mt-1 text-[10px] leading-snug text-white/60">{piece.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Por Estação */}
      {activeTab === 'estacoes' && profile && (
        <div className="grid gap-3 sm:grid-cols-2">
          {(Object.keys(SEASON_META) as Array<keyof SeasonTips>).map((season) => {
            const meta = SEASON_META[season];
            return (
              <div
                key={season}
                className="rounded-2xl border border-white/15 p-4"
                style={{ background: meta.color }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xl">{meta.icon}</span>
                  <p className="text-sm font-bold text-white/90">{meta.label}</p>
                </div>
                <p className="text-xs leading-relaxed text-white/70">{profile.seasons[season]}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB: Na Plataforma */}
      {activeTab === 'plataforma' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-white/50">
              Peças desta marca cadastradas pelos usuários do SAI.
            </p>
            {!loadingPieces && (
              <span className="rounded-full border border-white/20 px-2 py-0.5 text-[10px] text-white/50">
                {pieces.length} peça{pieces.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {loadingPieces ? (
            <p className="text-xs text-white/50">Carregando peças...</p>
          ) : pieces.length === 0 ? (
            <p className="text-xs text-white/50">Nenhuma peça desta marca cadastrada ainda.</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {pieces.map((piece) => (
                <div
                  key={piece.wardrobe_item_id}
                  className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 p-2.5"
                >
                  {piece.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={piece.image_url} alt={piece.name} className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-lg">
                      🧥
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-white/90">{piece.name}</p>
                    <p className="text-[10px] text-white/50">
                      {piece.piece_type}{piece.color ? ` · ${piece.color}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MaisonView() {
  const [brands, setBrands] = useState<BrandData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<BrandData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPortuguese, setIsPortuguese] = useState(true);

  useEffect(() => {
    fetch('/api/brands')
      .then((res) => res.json())
      .then((data) => setBrands(Array.isArray(data) ? data : []))
      .catch(() => setBrands([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const refresh = () => setIsPortuguese(window.localStorage.getItem('sai-site-language') !== 'en');
    refresh();
    window.addEventListener('sai-language-change', refresh as EventListener);
    return () => window.removeEventListener('sai-language-change', refresh as EventListener);
  }, []);

  const filteredBrands = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return brands;
    return brands.filter((b) => b.name.toLowerCase().includes(q));
  }, [brands, searchQuery]);

  const enrichedCount = useMemo(
    () => brands.filter((b) => BRAND_PROFILES[b.name.toLowerCase()]).length,
    [brands],
  );

  if (selectedBrand) {
    return (
      <div className="space-y-6">
        <PageHeader title={isPortuguese ? 'Marcas' : 'Brand'} subtitle={isPortuguese ? `Perfil da marca: ${selectedBrand.name}` : `Brand profile: ${selectedBrand.name}`} />
        <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
          <BrandPanel brand={selectedBrand} onClose={() => setSelectedBrand(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isPortuguese ? 'Marcas' : 'Brand'}
        subtitle={isPortuguese ? 'Feed dedicado às marcas — categoria, público-alvo, peças icônicas, recomendações por estação e muito mais.' : 'Dedicated brand feed — category, target audience, iconic pieces, seasonal recommendations, and more.'}
      />

      <SectionBlock
        title={isPortuguese ? 'Selos premium do mês' : 'Monthly premium seals'}
        subtitle={isPortuguese ? 'Esquemas com selo premium ativos no mês vigente aparecem também no feed das marcas.' : 'Outfits with active premium seals for the current month also appear in brand feeds.'}
      >
        <div className="grid gap-3 md:grid-cols-3">
          {PREMIUM_BRAND_SEAL_SCHEMES.map((scheme) => {
            const logoUrl = resolveBrandLogoUrlByName(scheme.brand) || undefined;
            return (
              <article key={scheme.id} className="rounded-2xl border border-amber-200/25 bg-amber-300/10 p-4">
                <div className="flex items-start justify-between gap-3">
                  <BrandBadge brandName={scheme.brand} brandLogoUrl={logoUrl} variant="compact" />
                  <span className="rounded-full border border-amber-200/35 bg-amber-300/14 px-2 py-1 text-[10px] font-black uppercase text-amber-100">
                    Premium
                  </span>
                </div>
                <p className="mt-3 text-sm font-black text-white">{scheme.title}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/42">{scheme.creator}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{scheme.note}</p>
              </article>
            );
          })}
        </div>
      </SectionBlock>

      <SectionBlock title="Marcas Registradas" subtitle="Todas as marcas ativas na plataforma FAI.">
        <label className="mt-4 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="6" />
            <path d="m20 20-4.2-4.2" />
          </svg>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar marca..."
            className="w-full bg-transparent text-white placeholder:text-white/60 focus:outline-none"
          />
        </label>

        {loading ? (
          <p className="mt-4 text-sm text-white/60">Carregando marcas...</p>
        ) : filteredBrands.length === 0 ? (
          <p className="mt-4 text-sm text-white/60">Nenhuma marca encontrada.</p>
        ) : (
          <>
            <p className="mt-3 text-xs text-white/40">
              {filteredBrands.length} marca{filteredBrands.length !== 1 ? 's' : ''} · {enrichedCount} com perfil completo
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredBrands.map((brand) => {
                const nameKey = brand.name.toLowerCase();
                const profile = BRAND_PROFILES[nameKey];
                const logoUrl = brand.logo_url || resolveBrandLogoUrlByName(brand.name) || undefined;
                const accentColor = profile?.accentColor ?? 'rgba(203,213,225,0.8)';
                const priceColors = profile ? PRICE_COLORS[profile.priceRange] : null;

                return (
                  <button
                    key={brand.brand_id}
                    type="button"
                    onClick={() => setSelectedBrand(brand)}
                    className="group flex flex-col gap-3 rounded-2xl border border-white/15 p-4 text-left transition hover:border-white/35"
                    style={{
                      background: profile
                        ? `linear-gradient(135deg, ${accentColor.replace('0.85', '0.24')} 0%, rgba(15,23,42,0.72) 58%, rgba(88,28,135,0.32) 100%)`
                        : 'linear-gradient(135deg, rgba(30,41,59,0.86), rgba(88,28,135,0.3))',
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <BrandBadge brandName={brand.name} brandLogoUrl={logoUrl} variant="default" />
                      {priceColors && (
                        <span
                          className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-semibold ${priceColors.text}`}
                          style={{ background: priceColors.bg, borderColor: priceColors.border }}
                        >
                          {profile.priceRange}
                        </span>
                      )}
                    </div>

                    {profile ? (
                      <>
                        <p className="text-xs leading-snug text-white/55">{profile.category} · {profile.origin}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {profile.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white/65"
                              style={{
                                borderWidth: 1, borderStyle: 'solid',
                                borderColor: accentColor.replace('0.85', '0.35'),
                                background: accentColor.replace('0.85', '0.08'),
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-1">
                          {profile.colorPalette.slice(0, 5).map((hex) => (
                            <div key={hex} className="h-3 w-3 rounded-full border border-white/20" style={{ backgroundColor: hex }} />
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-white/40">Perfil em construção</p>
                    )}

                    <span
                      className="self-start rounded-lg border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/55 transition group-hover:text-white"
                      style={{
                        borderColor: accentColor.replace('0.85', '0.3'),
                        background: accentColor.replace('0.85', '0.06'),
                      }}
                    >
                      {isPortuguese ? 'Ver Marca →' : 'View Brand →'}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </SectionBlock>
    </div>
  );
}
