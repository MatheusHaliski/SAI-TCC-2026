'use client';

import { useEffect } from 'react';

const SITE_LANGUAGE_STORAGE_KEY = 'sai-site-language';

const PT_TRANSLATIONS: Record<string, string> = {
  Profile: 'Perfil',
  'Creator Profile': 'Perfil do criador',
  Settings: 'Configurações',
  'Profile Menu': 'Menu do perfil',
  'My Wardrobe Pieces': 'Meu Guarda-roupa',
  'User Info': 'Informações do usuário',
  'My Schemes': 'Meus esquemas',
  'Saved Schemes': 'Esquemas salvos',
  'My Posts': 'Minhas postagens',
  'Active section:': 'Seção ativa:',
  Authenticated: 'Autenticado',
  'Public Profile': 'Perfil público',
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

    const observer = new MutationObserver(() => applyLanguage());
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

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
