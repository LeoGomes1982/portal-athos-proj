import { useState, useEffect } from "react";
import { Denuncia } from "@/types/cicad";
import { supabase } from "@/integrations/supabase/client";

export const useCICADAlerts = () => {
  const [hasNewDenuncias, setHasNewDenuncias] = useState(false);
  const [newDenunciasCount, setNewDenunciasCount] = useState(0);

  const checkNewDenuncias = async () => {
    try {
      // Verificar se há denúncias não lidas no Supabase
      const lastCheck = localStorage.getItem('cicad_last_check');
      
      const { data: denuncias, error } = await supabase
        .from('denuncias')
        .select('*')
        .order('data_envio', { ascending: false });

      if (error) {
        console.error('Erro ao carregar denúncias:', error);
        return;
      }
      
      const now = new Date().getTime();
      const lastCheckTime = lastCheck ? parseInt(lastCheck) : now;

      // Encontrar denúncias criadas após a última verificação
      const newDenuncias = denuncias.filter(denuncia => {
        const denunciaTime = new Date(denuncia.data_envio).getTime();
        return denunciaTime > lastCheckTime;
      });

      setNewDenunciasCount(newDenuncias.length);
      setHasNewDenuncias(newDenuncias.length > 0);
    } catch (error) {
      console.error('Erro ao verificar novas denúncias:', error);
      setHasNewDenuncias(false);
      setNewDenunciasCount(0);
    }
  };

  const markAsChecked = () => {
    try {
      const now = new Date().getTime().toString();
      localStorage.setItem('cicad_last_check', now);
      setHasNewDenuncias(false);
      setNewDenunciasCount(0);
    } catch (error) {
      console.error('Erro ao marcar como verificado:', error);
    }
  };

  useEffect(() => {
    checkNewDenuncias();
    
    // Configurar real-time updates para detectar novas denúncias
    const channel = supabase
      .channel('cicad-alerts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'denuncias'
        },
        () => {
          // Verificar novas denúncias quando houver inserções
          checkNewDenuncias();
        }
      )
      .subscribe();
    
    // Verificar também a cada 30 segundos como fallback
    const interval = setInterval(checkNewDenuncias, 30000);
    
    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  return { hasNewDenuncias, newDenunciasCount, checkNewDenuncias, markAsChecked };
};