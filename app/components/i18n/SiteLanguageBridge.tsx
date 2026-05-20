'use client';

import { useEffect } from 'react';

const SITE_LANGUAGE_STORAGE_KEY = 'sai-site-language';

const PT_TRANSLATIONS: Record<string, string> = {
  // Navigation / Profile
  Profile: 'Perfil',
  'Creator Profile': 'Perfil do criador',
  Settings: 'Configurações',
  'Profile Menu': 'Menu do perfil',
  'My Wardrobe Pieces': 'Meu Guarda-roupa',
  'User Info': 'Informações do usuário',
  'My Schemes': 'Meus Esquemas',
  'Saved Schemes': 'Esquemas Salvos',
  'My Posts': 'Minhas postagens',
  'Active section:': 'Seção ativa:',
  Authenticated: 'Autenticado',
  'Public Profile': 'Perfil público',

  // Language / Settings
  'Site language': 'Idioma do site',
  'Current saved:': 'Idioma salvo:',
  Save: 'Salvar',
  Confirm: 'Confirmar',
  'Danger Zone': 'Zona de perigo',
  'Delete your account': 'Excluir sua conta',
  Logout: 'Sair',
  'Export account data': 'Exportar dados da conta',
  Privacy: 'Privacidade',
  Theme: 'Tema',
  Current: 'Atual',
  New: 'Nova',
  'Change Password': 'Alterar senha',
  'Dark enabled': 'Escuro ativado',
  'Dark disabled': 'Escuro desativado',
  Public: 'Público',
  Private: 'Privado',
  English: 'Inglês',
  'Visible to everyone': 'Visível para todos',
  'Only visible to you': 'Visível apenas para você',

  // Page titles / headers
  'Saved Outfit Cards': 'Cards de Look Salvos',
  'Manage outfits by occasion, preference, favorite, and availability.': 'Gerencie looks por ocasião, preferência, favoritos e disponibilidade.',
  Search: 'Buscar',
  'Interactive discovery hub for users, outfits, brands, styles, and wardrobe items.': 'Hub de descoberta interativa de usuários, looks, marcas, estilos e roupas.',
  'Virtual Wardrobe': 'Guarda-Roupa Virtual',
  'Classify pieces as available, unavailable, and favorites.': 'Classifique peças como disponíveis, indisponíveis e favoritas.',
  'Create Outfit Card': 'Criar Card de Look',
  'Background Studio': 'Estúdio de Fundo',
  'Dress Tester': 'Provador 2D',

  // Sections / filters
  Available: 'Disponíveis',
  Unavailable: 'Indisponíveis',
  Favorites: 'Favoritos',
  'Available Pieces': 'Peças Disponíveis',
  'Unavailable Pieces': 'Peças Indisponíveis',
  'Favorite Pieces': 'Peças Favoritas',
  'Add Piece': 'Adicionar Peça',
  'Quick creator action to publish a new wardrobe piece.': 'Ação rápida do criador para publicar uma nova peça do guarda-roupa.',
  'Export data': 'Exportar dados',
  Notifications: 'Notificações',
  'System Inbox': 'Caixa do sistema',
  'Quick Navigation': 'Navegação rápida',
  Account: 'Conta',

  // Outfit card actions
  'View details': 'Ver detalhes',
  Edit: 'Editar',
  'Use in Dress Tester': 'Usar no Provador 2D',
  'Add to Scheme': 'Adicionar ao Esquema',
  Delete: 'Excluir',
  Open: 'Abrir',
  Export: 'Exportar',
  Duplicate: 'Duplicar',
  Remove: 'Remover',
  Publish: 'Publicar',
  Unpublish: 'Despublicar',
  'Export to Social': 'Exportar para Redes Sociais',
  Favorite: 'Favorito',
  '★ Favorite': '★ Favorito',

  // Outfit status
  'Status:': 'Status:',
  'Favorite:': 'Favorito:',
  available: 'disponível',
  unavailable: 'indisponível',
  yes: 'sim',
  no: 'não',

  // Wardrobe section
  'Scan and manage your pieces with premium compact cards.': 'Visualize e gerencie suas peças com cards premium compactos.',
  'No wardrobe items found yet.': 'Nenhuma peça encontrada ainda.',
  'No pieces in this list.': 'Nenhuma peça nesta lista.',
  'Manage list status for each wardrobe item.': 'Gerencie o status de cada peça do guarda-roupa.',

  // Search page
  'Global Search': 'Busca Global',
  'Search users, outfits, brands, styles, wearstyles, and wardrobe items.': 'Busque usuários, looks, marcas, estilos e roupas.',
  'Search outfits, brands, styles, or wardrobe items': 'Busque looks, marcas, estilos ou roupas',
  'No users found.': 'Nenhum usuário encontrado.',
  'No outfits found.': 'Nenhum look encontrado.',
  'Expandable Discovery Groups': 'Grupos de Descoberta',
  'Structured results model is ready for Brands, Wardrobe Items, and Styles.': 'Resultados organizados para marcas, roupas e estilos.',
  'Public outfits in compact Saved Outfit Cards card mode.': 'Looks públicos no modo compacto de Cards de Look.',

  // Explore/Saved section
  'Outfits grouped by occasion.': 'Looks agrupados por ocasião.',
  'No authored schemes yet.': 'Nenhum esquema criado ainda.',
  'No saved schemes available.': 'Nenhum esquema salvo disponível.',
  'Authored creative assets with compact premium outfit cards.': 'Cards de look criados por você com visualização premium compacta.',
  'Compact Saved Outfit Cards card family with premium visual continuity.': 'Cards de look salvos com continuidade visual premium.',
  'Saved outfit card with editable social-ready metadata.': 'Card de look salvo com metadados editáveis para redes sociais.',
  'Creator scheme ready for editing and publishing.': 'Esquema criador pronto para edição e publicação.',

  // Profile summary
  'Premium creator hub for wardrobe, schemes, publishing, and account controls.': 'Hub premium para guarda-roupa, esquemas, publicação e controles de conta.',
  'Public creator profile view.': 'Visualização pública do perfil do criador.',

  // Buttons/loading
  Close: 'Fechar',
  Cancel: 'Cancelar',
  'Load more': 'Carregar mais',
  Loading: 'Carregando',
  'Loading…': 'Carregando…',
  'AI Search': 'Busca IA',
  Searching: 'Buscando',
  'Searching...': 'Buscando...',

  // Modal / confirmation
  'Are you sure?': 'Tem certeza?',
  'This action cannot be undone.': 'Esta ação não pode ser desfeita.',
  'Confirm delete': 'Confirmar exclusão',
  'Please fill name, image file and market before saving.': 'Preencha nome, arquivo de imagem e mercado antes de salvar.',
  'User session not found. Please sign in again.': 'Sessão do usuário não encontrada. Faça login novamente.',
  'Unable to load form data. Please try again.': 'Não foi possível carregar os dados do formulário. Tente novamente.',
  'Piece added and 3D generation started successfully.': 'Peça adicionada e geração 3D iniciada com sucesso.',
  'Failed to create piece. Please verify your fields and try again.': 'Falha ao criar peça. Verifique os campos e tente novamente.',
  'No file selected': 'Nenhum arquivo selecionado',
  'Analyze with AI': 'Analisar com IA',
  'Analyzing...': 'Analisando...',
  'Publishing...': 'Publicando...',
  'Publish Piece': 'Publicar Peça',

  // Misc badges
  AI: 'IA',
  Manual: 'Manual',
  recent: 'recente',
  'Ready for 3D Viewer': 'Pronto para o Visualizador 3D',
  'Queue pending': 'Na fila',
  'Generating asset': 'Gerando ativo',
  'Failed (tap to retry)': 'Falhou (toque para tentar novamente)',

  // Section labels
  Occasion: 'Ocasião',
  Style: 'Estilo',
  pieces: 'peças',

  // Filter pills (new)
  Disponíveis: 'Disponíveis',
  Indisponíveis: 'Indisponíveis',
  Favoritos: 'Favoritos',

  // ── Background Studio modal ───────────────────────────────────────────────
  'Customize the visual surface of your outfit card': 'Personalize a superfície visual do seu card de look',
  'Close ✕': 'Fechar ✕',

  // Tabs
  Color: 'Cor',
  Gradient: 'Gradiente',
  'AI Artwork': 'Arte com IA',

  // Color tab
  'Solid Color': 'Cor Sólida',
  'Recent colors': 'Cores recentes',
  'Subtle texture overlay': 'Textura sutil sobreposta',

  // Gradient tab
  Reverse: 'Inverter',
  Randomize: 'Aleatorizar',
  Stop: 'Parada',
  'Angle (': 'Ângulo (',
  'Intensity (': 'Intensidade (',

  // AI Artwork tab — section headers
  'Visual Direction': 'Direção Visual',
  'Define composition and style behavior before generating.': 'Defina a composição e o estilo antes de gerar.',
  'Use brand and mood details. Geometry control below has priority for structure.': 'Use detalhes de marca e mood. A geometria abaixo tem prioridade na estrutura.',
  '✨ Generate Palette from Prompt': '✨ Gerar Paleta do Prompt',
  'Generates a color palette and gradient from your text prompt.': 'Gera uma paleta de cores e gradiente a partir do seu prompt.',
  'Composition Type': 'Tipo de Composição',
  'Changes whether AI prioritizes full background, frame, overlay, or shape-pack output.': 'Define se a IA prioriza fundo completo, moldura, sobreposição ou conjunto de formas.',
  'Style Preset': 'Estilo Predefinido',
  'Controls campaign direction and visual tone.': 'Controla a direção da campanha e o tom visual.',
  'Palette Mode': 'Modo de Paleta',
  'Controls the dominant color family in generated artwork.': 'Controla a família de cores dominante na arte gerada.',
  'Color & Contrast': 'Cor e Contraste',
  'All controls below are wired to the generation payload.': 'Todos os controles estão conectados ao payload de geração.',
  Contrast: 'Contraste',
  'Color Intent': 'Intenção de Cor',
  'Instantly applies the color palette to the preview.': 'Aplica instantaneamente a paleta de cores ao preview.',
  Geometry: 'Geometria',
  'Selected geometry always wins if typed prompt conflicts.': 'A geometria selecionada prevalece sobre o prompt em caso de conflito.',
  'Geometry Family': 'Família de Geometria',
  'Reference image (upload)': 'Imagem de referência (upload)',
  'Upload reference image': 'Enviar imagem de referência',
  'Generation Mode': 'Modo de Geração',
  'Style preset:': 'Estilo predefinido:',
  'Contrast:': 'Contraste:',
  'Geometry:': 'Geometria:',
  'Safe area mode for text and subject': 'Modo de área segura para texto e assunto',
  'Generating...': 'Gerando...',
  'Generate AI Background': 'Gerar Fundo com IA',
  'Apply to outfit card': 'Aplicar ao card de look',
  'AI Gradient Options': 'Opções de Gradiente IA',
  'Generating…': 'Gerando…',
  'Save asset': 'Salvar ativo',
  'Saved assets in this session:': 'Ativos salvos nesta sessão:',
  'Apply to Card ·': 'Aplicar ao Card ·',

  // Material Layer section
  'Material Layer (Premium)': 'Camada de Material (Premium)',
  'Separate layer for textile rendering on top of color/gradient and below decorative overlays.':
    'Camada separada para renderização têxtil acima da cor/gradiente e abaixo das sobreposições.',
  'Material Type': 'Tipo de Material',
  'Apply Scope': 'Escopo de Aplicação',
  'Whole Card': 'Card Inteiro',
  'Applies material to complete card surface': 'Aplica o material em toda a superfície do card',
  'Hero Block': 'Bloco Principal',
  'Applies material only on hero section': 'Aplica o material apenas na seção principal',
  'Content Block': 'Bloco de Conteúdo',
  'Applies material on lower content area': 'Aplica o material na área de conteúdo inferior',
  'Fabric Density:': 'Densidade do Tecido:',
  'Thread Thickness:': 'Espessura do Fio:',
  'Thread Direction': 'Direção do Fio',
  'Cross Weave': 'Trama Cruzada',
  'Diagonal + counter weave for textile look': 'Trama diagonal + contratrama para visual têxtil',
  'Diagonal Weave': 'Trama Diagonal',
  'Fashion-forward diagonal thread field': 'Campo de fios diagonal para moda',
  'Horizontal Weave': 'Trama Horizontal',
  'Horizontal stitching emphasis': 'Ênfase em costura horizontal',
  'Vertical Weave': 'Trama Vertical',
  'Vertical stitching emphasis': 'Ênfase em costura vertical',
  'Matte / Satin Finish': 'Acabamento Matte / Cetim',
  Matte: 'Fosco',
  'Soft low-sheen textile': 'Têxtil suave de baixo brilho',
  Satin: 'Cetim',
  'Subtle highlights and richer sheen': 'Realces sutis e brilho mais rico',
  'Emboss Intensity:': 'Intensidade de Relevo:',
  'Surface Contrast:': 'Contraste de Superfície:',
  'Stitch Border On/Off': 'Borda de Costura',
  'Stitch Color': 'Cor do Ponto',

  // Preset recommendation section
  'Recommended presets based on current outfit': 'Predefinições recomendadas para o look atual',
  '🔵 AI enhanced': '🔵 Aprimorado com IA',
  '🟢 Ready': '🟢 Pronto',

  // Live preview panel
  'Live Preview': 'Pré-visualização ao Vivo',
  'Contrast recommendation:': 'Recomendação de contraste:',
  'text/icons': 'texto/ícones',
  'Warning: high-luminance solid background may reduce metadata readability.':
    'Aviso: fundo sólido de alta luminância pode reduzir a legibilidade dos metadados.',

  // Bottom bar
  'Selected shape': 'Forma selecionada',
  'None (no overlay)': 'Nenhum (sem sobreposição)',
  'Updates geometry in preview': 'Atualiza a geometria no preview',
  'Gradient picker': 'Seletor de gradiente',
  'Applies gradient + geometry recipe': 'Aplica gradiente + receita de geometria',
  'Applies flower motif artwork surface': 'Aplica superfície artística com motivo floral',
  'Cancel / Close': 'Cancelar / Fechar',
  Reset: 'Redefinir',
  'Save Background': 'Salvar Fundo',
};

const reverseTranslations = Object.entries(PT_TRANSLATIONS).reduce<Record<string, string>>((acc, [en, pt]) => {
  acc[pt] = en;
  return acc;
}, {});

const translateTextNodes = (root: ParentNode, toPt: boolean): void => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const dict = toPt ? PT_TRANSLATIONS : reverseTranslations;

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const raw = node.nodeValue;
    if (!raw) continue;

    const normalized = raw.trim();
    if (!normalized) continue;

    const translated = dict[normalized];
    if (!translated) continue;

    node.nodeValue = raw.replace(normalized, translated);
  }
};

const translateAttributes = (root: ParentNode, toPt: boolean): void => {
  const dict = toPt ? PT_TRANSLATIONS : reverseTranslations;
  const elements = (root as Element).querySelectorAll?.('*');
  if (!elements) return;

  elements.forEach((el) => {
    const placeholder = el.getAttribute('placeholder');
    if (placeholder && dict[placeholder]) el.setAttribute('placeholder', dict[placeholder]);

    const ariaLabel = el.getAttribute('aria-label');
    if (ariaLabel && dict[ariaLabel]) el.setAttribute('aria-label', dict[ariaLabel]);

    if (el instanceof HTMLOptionElement) {
      const content = el.textContent?.trim();
      if (content && dict[content]) el.textContent = dict[content];
    }
  });
};

export default function SiteLanguageBridge() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const applyLanguage = () => {
      const isPt = window.localStorage.getItem(SITE_LANGUAGE_STORAGE_KEY) !== 'en';
      document.documentElement.setAttribute('lang', isPt ? 'pt-BR' : 'en');
      translateTextNodes(document.body, isPt);
      translateAttributes(document.body, isPt);
    };

    applyLanguage();

    const observerOptions: MutationObserverInit = { childList: true, subtree: true };

    const observer = new MutationObserver(() => {
      observer.disconnect();
      applyLanguage();
      observer.observe(document.body, observerOptions);
    });
    observer.observe(document.body, observerOptions);

    const onStorage = (event: StorageEvent) => {
      if (event.key === SITE_LANGUAGE_STORAGE_KEY) applyLanguage();
    };

    window.addEventListener('storage', onStorage);
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return null;
}
