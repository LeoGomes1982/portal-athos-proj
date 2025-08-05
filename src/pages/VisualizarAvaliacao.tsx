import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VisualizarAvaliacaoModal } from "@/components/modals/VisualizarAvaliacaoModal";
import { useToast } from "@/hooks/use-toast";

export function VisualizarAvaliacao() {
  const { avaliacaoId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [avaliacaoExists, setAvaliacaoExists] = useState(false);

  useEffect(() => {
    const verificarAvaliacao = async () => {
      if (!avaliacaoId) {
        navigate('/');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('avaliacoes_desempenho')
          .select('id')
          .eq('id', avaliacaoId)
          .single();

        if (error || !data) {
          toast({
            title: "Erro",
            description: "Avaliação não encontrada.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        setAvaliacaoExists(true);
      } catch (error) {
        console.error('Erro ao verificar avaliação:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar avaliação.",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    verificarAvaliacao();
  }, [avaliacaoId, navigate, toast]);

  const handleClose = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!avaliacaoExists) {
    return null;
  }

  return (
    <VisualizarAvaliacaoModal
      open={true}
      onOpenChange={handleClose}
      avaliacaoId={avaliacaoId}
    />
  );
}