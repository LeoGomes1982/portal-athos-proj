import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Hook para corrigir problemas de navegação e estabilidade
 */
export const useNavigationFix = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Atualizar título da página baseado na rota
    const updatePageTitle = () => {
      const titles: Record<string, string> = {
        '/': 'Portal Grupo Athos',
        '/auth': 'Login - Portal Athos',
        '/dp': 'Departamento Pessoal - Portal Athos',
        '/agenda': 'Agenda - Portal Athos',
        '/gerencia': 'Gerência - Portal Athos',
        '/comercial': 'Comercial - Portal Athos',
        
        '/configuracoes': 'Configurações - Portal Athos',
        '/cicad': 'CICAD - Portal Athos',
        '/processo-seletivo': 'Processo Seletivo - Portal Athos',
        
      };

      document.title = titles[location.pathname] || 'Portal Grupo Athos';
    };

    updatePageTitle();

    // Prevenir navegação problemática
    const handlePopState = () => {
      // Pequeno delay para garantir que o React Router processe a mudança
      setTimeout(() => {
        if (document.title.includes('Lovable')) {
          updatePageTitle();
        }
      }, 100);
    };

    window.addEventListener('popstate', handlePopState);

    // Limpar dados de sessão problemáticos
    try {
      const problematicKeys = Object.keys(sessionStorage).filter(key => 
        key.includes('lovable') || key.includes('temp')
      );
      problematicKeys.forEach(key => sessionStorage.removeItem(key));
    } catch (error) {
      // Ignorar erros de sessionStorage
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname]);

  // Função auxiliar para navegação segura
  const safeNavigate = (path: string, options?: { replace?: boolean }) => {
    try {
      navigate(path, options);
    } catch (error) {
      console.error('Erro na navegação:', error);
      // Fallback para navegação direta
      window.location.href = path;
    }
  };

  return { safeNavigate };
};