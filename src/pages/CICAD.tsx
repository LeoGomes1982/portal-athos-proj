import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Plus, QrCode, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Denuncia, FormularioCICAD } from "@/types/cicad";
import { denunciasIniciais } from "@/data/cicad";
import { FormularioCICADComponent } from "@/components/cicad/FormularioCICAD";
import { DenunciaCard } from "@/components/cicad/DenunciaCard";
import { ResolucaoCasoModal } from "@/components/cicad/ResolucaoCasoModal";
import { CICADSummaryCards } from "@/components/cicad/CICADSummaryCards";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import QRCode from 'qrcode';
import { useToast } from "@/hooks/use-toast";

export default function CICAD() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [denuncias, setDenuncias] = useState<Denuncia[]>(denunciasIniciais);
  const [showFormulario, setShowFormulario] = useState(false);
  const [showResolucaoModal, setShowResolucaoModal] = useState(false);
  const [denunciaSelecionada, setDenunciaSelecionada] = useState<Denuncia | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  const formularioUrl = `${window.location.origin}/cicad-formulario`;

  const handleNovaDenuncia = (formulario: FormularioCICAD) => {
    const novaDenuncia: Denuncia = {
      ...formulario,
      id: Date.now().toString(),
      status: "em_investigacao",
      dataSubmissao: new Date().toISOString().split('T')[0]
    };
    setDenuncias([novaDenuncia, ...denuncias]);
    setShowFormulario(false);
  };

  const handleResolverCaso = (denuncia: Denuncia) => {
    setDenunciaSelecionada(denuncia);
    setShowResolucaoModal(true);
  };

  const handleSubmitResolucao = (denunciaId: string, status: Denuncia['status'], resolucao: string) => {
    setDenuncias(denuncias.map(d => 
      d.id === denunciaId 
        ? { ...d, status, resolucao }
        : d
    ));
    setShowResolucaoModal(false);
    setDenunciaSelecionada(null);
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
    <div className="app-container">
      <div className="content-wrapper">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          Voltar
        </Button>

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mb-6 shadow-lg">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="page-title text-center">CICAD</h1>
          <p className="text-description text-center max-w-2xl mx-auto">
            Canal Interno de Comunicação Anônima Direta - Um espaço seguro para denúncias e comunicações internas
          </p>
        </div>

        {/* Summary Cards */}
        <CICADSummaryCards denuncias={denuncias} />

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
              </DialogHeader>
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Compartilhe este QR Code para acesso direto ao formulário anônimo
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