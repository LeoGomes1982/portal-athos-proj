/**
 * Utilitário para estabilizar a navegação e prevenir problemas de carregamento
 */

export const preventPageReload = () => {
  // Prevenir comportamentos inesperados do browser
  window.addEventListener('beforeunload', (e) => {
    // Apenas mostra confirmação se há dados não salvos
    const hasUnsavedData = sessionStorage.getItem('hasUnsavedData');
    if (hasUnsavedData === 'true') {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  // Interceptar cliques em links para garantir navegação correta
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a');
    
    if (link && link.href) {
      const url = new URL(link.href);
      // Se é um link interno, usar router navigation
      if (url.origin === window.location.origin) {
        e.preventDefault();
        window.history.pushState(null, '', url.pathname + url.search);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
  });

  // Melhorar comportamento do botão voltar
  window.addEventListener('popstate', () => {
    // Força o React Router a reagir corretamente
    setTimeout(() => {
      if (window.location.pathname === '/') {
        document.title = 'Portal Grupo Athos';
      }
    }, 0);
  });
};

export const safeNavigate = (url: string, external = false) => {
  try {
    if (external) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.history.pushState(null, '', url);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  } catch (error) {
    console.error('Erro na navegação:', error);
    // Fallback para navegação tradicional
    window.location.href = url;
  }
};

export const stabilizeApp = () => {
  // Configurar interceptador de erros de navegação
  window.addEventListener('error', (e) => {
    if (e.message.includes('Loading chunk') || e.message.includes('Failed to fetch')) {
      console.warn('Erro de carregamento interceptado, recarregando...');
      window.location.reload();
    }
  });

  // Melhorar estabilidade do histórico
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function(...args) {
    try {
      originalPushState.apply(history, args);
    } catch (error) {
      console.error('Erro no pushState:', error);
      window.location.href = args[2] as string;
    }
  };

  history.replaceState = function(...args) {
    try {
      originalReplaceState.apply(history, args);
    } catch (error) {
      console.error('Erro no replaceState:', error);
      window.location.href = args[2] as string;
    }
  };
};