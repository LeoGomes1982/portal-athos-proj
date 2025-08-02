import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Plus, QrCode, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Denuncia, FormularioCICAD } from "@/types/cicad";
import { denunciasIniciais } from "@/data/cicad";
import { useCICADAlerts } from "@/hooks/useCICADAlerts";
import { FormularioCICADComponent } from "@/components/cicad/FormularioCICAD";
import { DenunciaCard } from "@/components/cicad/DenunciaCard";
import { ResolucaoCasoModal } from "@/components/cicad/ResolucaoCasoModal";
import { CICADSummaryCards } from "@/components/cicad/CICADSummaryCards";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import QRCode from 'qrcode';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function CICAD() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { hasNewDenuncias, checkNewDenuncias } = useCICADAlerts();
  
  // Estado para gerenciar denúncias
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  
  const [showFormulario, setShowFormulario] = useState(false);
  const [showResolucaoModal, setShowResolucaoModal] = useState(false);
  const [denunciaSelecionada, setDenunciaSelecionada] = useState<Denuncia | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  const formularioUrl = `${window.location.origin}/cicad-formulario`;

  // Carregar denúncias do Supabase
  const carregarDenuncias = async () => {
    try {
      const { data, error } = await supabase
        .from('denuncias')
        .select('*')
        .order('data_envio', { ascending: false });

      if (error) {
        console.error('Erro ao carregar denúncias:', error);
        return;
      }

      // Converter dados do Supabase para o formato esperado
      const denunciasFormatadas: Denuncia[] = data.map(item => {
        // Mapear status do Supabase para os tipos corretos da aplicação
        let status: Denuncia['status'] = 'em_investigacao';
        if (item.status === 'resolvido') {
          status = 'encerrado';
        } else if (item.status === 'pendente') {
          status = 'em_investigacao';
        } else if (item.status === 'arquivado') {
          status = 'arquivado';
        }

        return {
          id: item.id,
          tipo: item.tipo as Denuncia['tipo'],
          assunto: item.assunto,
          setor: item.setor || "",
          dataOcorrencia: item.data_ocorrencia || "",
          nomeEnvolvido: item.nome_envolvido || undefined,
          testemunhas: item.testemunhas || undefined,
          descricao: item.descricao,
          consequencias: item.consequencias || undefined,
          dataSubmissao: item.data_envio.split('T')[0],
          status,
          resolucao: item.resolucao || undefined,
          urgencia: 'media' as const // Default para compatibilidade
        };
      });

      setDenuncias(denunciasFormatadas);
      checkNewDenuncias();
    } catch (error) {
      console.error('Erro inesperado ao carregar denúncias:', error);
    }
  };

  useEffect(() => {
    carregarDenuncias();

    // Configurar real-time updates
    const channel = supabase
      .channel('denuncias-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'denuncias'
        },
        () => {
          // Recarregar denúncias quando houver mudanças
          carregarDenuncias();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [checkNewDenuncias]);

  const handleNovaDenuncia = (formulario: FormularioCICAD) => {
    // Não precisa fazer nada aqui, pois o FormularioCICADComponent
    // já salva diretamente no Supabase e o real-time atualiza a lista
    setShowFormulario(false);
  };

  const handleResolverCaso = (denuncia: Denuncia) => {
    setDenunciaSelecionada(denuncia);
    setShowResolucaoModal(true);
  };

  const handleSubmitResolucao = async (denunciaId: string, status: Denuncia['status'], resolucao: string) => {
    try {
      // Mapear status da aplicação para o formato do Supabase
      let supabaseStatus: string = status;
      if (status === 'encerrado') {
        supabaseStatus = 'resolvido';
      }

      const { error } = await supabase
        .from('denuncias')
        .update({ 
          status: supabaseStatus, 
          resolucao,
          updated_at: new Date().toISOString()
        })
        .eq('id', denunciaId);

      if (error) {
        console.error('Erro ao atualizar denúncia:', error);
        toast({
          title: "Erro ao atualizar",
          description: "Ocorreu um erro ao atualizar o caso. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      setShowResolucaoModal(false);
      setDenunciaSelecionada(null);
      
      toast({
        title: "Caso atualizado",
        description: "O status do caso foi atualizado com sucesso."
      });
    } catch (error) {
      console.error('Erro inesperado ao atualizar:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const generateQRCode = async () => {
    if (canvasRef.current) {
      try {
        await QRCode.toCanvas(canvasRef.current, formularioUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });
      } catch (error) {
        console.error('Erro ao gerar QR Code:', error);
      }
    }
  };

  const downloadQRCode = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'qr-code-cicad-formulario.png';
      link.href = canvasRef.current.toDataURL();
      link.click();
      
      toast({
        title: "QR Code baixado",
        description: "O QR Code foi salvo com sucesso!"
      });
    }
  };

  const denunciasOrdenadas = [...denuncias].sort((a, b) => {
    // Priorizar urgentes primeiro
    if (a.urgencia === 'alta' && b.urgencia !== 'alta') return -1;
    if (b.urgencia === 'alta' && a.urgencia !== 'alta') return 1;
    
    // Depois por status (em investigação primeiro)
    if (a.status === 'em_investigacao' && b.status !== 'em_investigacao') return -1;
    if (b.status === 'em_investigacao' && a.status !== 'em_investigacao') return 1;
    
    // Por último, por data (mais recente primeiro)
    return new Date(b.dataSubmissao).getTime() - new Date(a.dataSubmissao).getTime();
  });

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="content-wrapper animate-fade-in bg-blue-100/40 rounded-lg shadow-lg p-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>

        {/* Header */}
        <div className="page-header-centered">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Shield size={32} className="text-white" />
          </div>
          <div>
            <h1 className="page-title mb-0">CICAD</h1>
            <p className="text-description">Canal Interno de Comunicação Anônima Direta - Um espaço seguro para denúncias e comunicações internas</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="relative">
          {hasNewDenuncias && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-pulse border-2 border-white flex items-center justify-center z-10">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          )}
          <CICADSummaryCards denuncias={denuncias} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 animate-slide-up">
          <Button 
            className="primary-btn flex items-center gap-2"
            onClick={() => setShowFormulario(true)}
          >
            <Plus size={20} />
            Nova Denúncia
          </Button>
          
          <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => {
                  setShowQRModal(true);
                  setTimeout(generateQRCode, 100);
                }}
              >
                <QrCode size={20} />
                QR Code do Formulário
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>QR Code - Formulário CICAD</DialogTitle>
                <DialogDescription>
                  Compartilhe este QR Code para acesso direto ao formulário anônimo
                </DialogDescription>
              </DialogHeader>
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Escaneie o código ou use o link para acesso direto
                </p>
                <div className="flex justify-center">
                  <canvas ref={canvasRef} className="border rounded-lg" />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={downloadQRCode}
                    className="primary-btn flex items-center gap-2 flex-1"
                  >
                    <Download size={16} />
                    Baixar QR Code
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  URL: {formularioUrl}
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Form Dialog */}
        <Dialog open={showFormulario} onOpenChange={setShowFormulario}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nova Denúncia CICAD</DialogTitle>
              <DialogDescription>
                Preencha o formulário abaixo para registrar uma nova denúncia no sistema CICAD.
              </DialogDescription>
            </DialogHeader>
            <FormularioCICADComponent 
              onSubmit={handleNovaDenuncia}
              isFormularioPublico={false}
            />
          </DialogContent>
        </Dialog>

        {/* Denuncias List */}
        <div className="space-y-6 animate-slide-up">
          {denunciasOrdenadas.length === 0 ? (
            <Card className="modern-card">
              <CardContent className="card-content text-center py-12">
                <Shield size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  Nenhuma denúncia registrada
                </h3>
                <p className="text-muted-foreground">
                  Quando houver denúncias, elas aparecerão aqui para acompanhamento.
                </p>
              </CardContent>
            </Card>
          ) : (
            denunciasOrdenadas.map((denuncia) => (
              <DenunciaCard 
                key={denuncia.id}
                denuncia={denuncia}
                onResolverCaso={handleResolverCaso}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 animate-fade-in">
          <p className="text-description">
            © 2024 Grupo Athos. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Resolution Modal */}
      {denunciaSelecionada && (
        <ResolucaoCasoModal
          isOpen={showResolucaoModal}
          onClose={() => {
            setShowResolucaoModal(false);
            setDenunciaSelecionada(null);
          }}
          denuncia={denunciaSelecionada}
          onSubmit={handleSubmitResolucao}
        />
      )}
    </div>
  );
}