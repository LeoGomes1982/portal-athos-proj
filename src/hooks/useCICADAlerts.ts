import { useState, useEffect } from "react";
import { Denuncia } from "@/types/cicad";

export const useCICADAlerts = () => {
  const [hasNewDenuncias, setHasNewDenuncias] = useState(false);
  const [newDenunciasCount, setNewDenunciasCount] = useState(0);

  const checkNewDenuncias = () => {
    try {
      // Verificar se há denúncias não lidas no localStorage
      const lastCheck = localStorage.getItem('cicad_last_check');
      const denuncias = JSON.parse(localStorage.getItem('cicad_denuncias') || '[]') as Denuncia[];
      
      const now = new Date().getTime();
      const lastCheckTime = lastCheck ? parseInt(lastCheck) : now;

      // Encontrar denúncias criadas após a última verificação
      const newDenuncias = denuncias.filter(denuncia => {
        const denunciaTime = new Date(denuncia.dataSubmissao).getTime();
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
    
    // Verificar a cada 30 segundos
    const interval = setInterval(checkNewDenuncias, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { hasNewDenuncias, newDenunciasCount, checkNewDenuncias, markAsChecked };
};