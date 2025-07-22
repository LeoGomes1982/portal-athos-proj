
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Briefcase, Users, Plus, MapPin, Clock, Calendar, Edit, Eye, QrCode, Download } from "lucide-react";
import QRCode from 'qrcode';
import { NovaVagaModal } from "@/components/modals/NovaVagaModal";
import { EditarVagaModal } from "@/components/modals/EditarVagaModal";
import { CandidatosModal } from "@/components/modals/CandidatosModal";
import { useVagas } from "@/hooks/useVagas";
import { useCandidaturas } from "@/hooks/useCandidaturas";

interface VagasTalentosSubsectionProps {
  onBack: () => void;
}

interface Vaga {
  id: string;
  titulo: string;
  departamento: string;
  cidade: string;
  cargaHoraria: string;
  jornada: string;
  descricao: string;
  requisitos: string;
  salario: string;
  status: "ativa" | "pausada" | "encerrada";
  dataPublicacao: string;
  candidatos: number;
}

interface Candidato {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  curriculo: File | null;
  sobreMim: string;
  experiencias: string;
  dataInscricao: string;
  classificacao?: number;
}

export function VagasTalentosSubsection({ onBack }: VagasTalentosSubsectionProps) {
  const [showNovaVagaModal, setShowNovaVagaModal] = useState(false);
  const [showEditarVagaModal, setShowEditarVagaModal] = useState(false);
  const [showCandidatosModal, setShowCandidatosModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [vagaSelecionada, setVagaSelecionada] = useState<any>(null);
  const [candidatosPorVaga, setCandidatosPorVaga] = useState<{ [vagaId: string]: any[] }>({});
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { vagas, loading: vagasLoading, criarVaga, atualizarVaga, excluirVaga } = useVagas();
  const { candidaturas, loading: candidaturasLoading, carregarCandidaturasPorVaga } = useCandidaturas();

  const portalUrl = `${window.location.origin}/portal-vagas`;

  // Gerar QR Code para o Portal de Vagas
  const generateQRCode = async () => {
    if (canvasRef.current) {
      await QRCode.toCanvas(canvasRef.current, portalUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#3b82f6',
          light: '#ffffff'
        }
      });
    }
  };

  const downloadQRCode = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'portal-vagas-qr.png';
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  // Cargar candidaturas quando as vagas mudarem
  useEffect(() => {
    const carregarTodosCandidatos = async () => {
      const candidatosPorVagaMap: { [vagaId: string]: any[] } = {};
      
      for (const vaga of vagas) {
        const candidatos = await carregarCandidaturasPorVaga(vaga.id);
        candidatosPorVagaMap[vaga.id] = candidatos.map(c => ({
          id: c.id,
          nome: c.nome,
          endereco: c.endereco,
          telefone: c.telefone,
          email: c.email,
          curriculo: null,
          sobreMim: c.sobre_mim || '',
          experiencias: c.experiencias || '',
          dataInscricao: c.created_at,
          classificacao: 0
        }));
      }
      
      setCandidatosPorVaga(candidatosPorVagaMap);
    };

    if (vagas.length > 0) {
      carregarTodosCandidatos();
    }
  }, [vagas]);

  const vagasComCandidatos = vagas.map(vaga => ({
    ...vaga,
    candidatos: candidatosPorVaga[vaga.id]?.length || 0,
    cargaHoraria: "40h semanais", // Campo obrigatório da interface
    jornada: vaga.tipo || "integral", // Usando tipo como jornada
    dataPublicacao: vaga.created_at ? new Date(vaga.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  }));

  const vagasAtivas = vagasComCandidatos.filter(v => v.status === "ativa").length;
  const totalCandidatos = vagasComCandidatos.reduce((sum, vaga) => sum + vaga.candidatos, 0);

  const handleNovaVaga = async (dadosVaga: Omit<Vaga, "id" | "candidatos" | "dataPublicacao">) => {
    await criarVaga({
      titulo: dadosVaga.titulo,
      departamento: dadosVaga.departamento,
      cidade: dadosVaga.cidade,
      tipo: dadosVaga.jornada,
      salario: dadosVaga.salario,
      descricao: dadosVaga.descricao,
      requisitos: dadosVaga.requisitos,
      beneficios: '',
      status: dadosVaga.status,
      criado_por: 'sistema' // Por enquanto, depois podemos pegar do usuário logado
    });
  };

  const handleEditarVaga = (vaga: any) => {
    setVagaSelecionada(vaga);
    setShowEditarVagaModal(true);
  };

  const handleSubmitEdicao = async (dadosVaga: Vaga) => {
    await atualizarVaga(dadosVaga.id, {
      titulo: dadosVaga.titulo,
      departamento: dadosVaga.departamento,
      cidade: dadosVaga.cidade,
      tipo: dadosVaga.jornada,
      salario: dadosVaga.salario,
      descricao: dadosVaga.descricao,
      requisitos: dadosVaga.requisitos,
      status: dadosVaga.status
    });
  };

  const handleVerCandidatos = (vaga: any) => {
    setVagaSelecionada(vaga);
    setShowCandidatosModal(true);
  };

  const handleToggleStatus = async (vagaId: string) => {
    const vaga = vagas.find(v => v.id === vagaId);
    if (vaga) {
      await atualizarVaga(vagaId, { 
        status: vaga.status === "ativa" ? "pausada" : "ativa" 
      });
    }
  };

  const handleClassificarCandidato = (candidatoId: string, classificacao: number) => {
    setCandidatosPorVaga(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(vagaId => {
        updated[vagaId] = updated[vagaId].map(candidato =>
          candidato.id === candidatoId ? { ...candidato, classificacao } : candidato
        );
      });
      return updated;
    });
  };

  const handleEnviarParaProcessoSeletivo = (candidato: Candidato) => {
    // Remove o candidato da lista de candidatos de vagas
    setCandidatosPorVaga(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(vagaId => {
        updated[vagaId] = updated[vagaId].filter(c => c.id !== candidato.id);
      });
      return updated;
    });

    // Salva no localStorage para simular envio para processo seletivo
    const processoSeletivoData = {
      candidato: {
        ...candidato,
        vaga: vagaSelecionada?.titulo || '',
        vagaId: vagaSelecionada?.id || ''
      },
      etapa: 'entrevista',
      dataEnvio: new Date().toISOString()
    };
    
    const processoAtual = JSON.parse(localStorage.getItem('processoSeletivo') || '[]');
    localStorage.setItem('processoSeletivo', JSON.stringify([...processoAtual, processoSeletivoData]));
  };

  const handleEnviarParaGeladeira = (candidato: Candidato) => {
    // Remove o candidato da lista de candidatos de vagas
    setCandidatosPorVaga(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(vagaId => {
        updated[vagaId] = updated[vagaId].filter(c => c.id !== candidato.id);
      });
      return updated;
    });

    // Salva na geladeira através do localStorage (por enquanto)
    const candidatoComVaga = {
      ...candidato,
      vaga: vagaSelecionada?.titulo || '',
      vagaId: vagaSelecionada?.id || '',
      dataArquivamento: new Date().toISOString(),
      comentarios: ''
    };

    const geladeiraAtual = JSON.parse(localStorage.getItem('candidatosGeladeira') || '[]');
    localStorage.setItem('candidatosGeladeira', JSON.stringify([...geladeiraAtual, candidatoComVaga]));
  };

  const getJornadaLabel = (jornada: string) => {
    switch (jornada) {
      case 'integral': return 'Integral';
      case 'meio-periodo': return 'Meio Período';
      case 'flexivel': return 'Flexível';
      case 'home-office': return 'Home Office';
      case 'hibrido': return 'Híbrido';
      default: return jornada;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="content-wrapper animate-fade-in bg-blue-100/80 rounded-lg shadow-lg m-6 p-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" onClick={onBack}>
          <ArrowLeft size={16} />
          Voltar
        </Button>

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mb-6 shadow-lg">
            <Briefcase size={32} className="text-white" />
          </div>
          <h1 className="page-title text-center">Vagas e Talentos</h1>
          <p className="text-description text-center max-w-2xl mx-auto">
            Gestão completa de vagas e processos seletivos
          </p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-8 animate-slide-up">
          <Dialog>
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
                QR Code das Vagas
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>QR Code - Portal de Vagas</DialogTitle>
                <DialogDescription>
                  Compartilhe este QR Code para acesso direto ao portal de vagas
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
                  URL: {portalUrl}
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-slide-up">
          <Card className="modern-card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">💼</div>
              <div className="text-2xl font-bold text-green-600">
                {vagasAtivas}
              </div>
              <div className="text-sm text-green-600/80">Vagas Ativas</div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-2xl font-bold text-emerald-600">
                {totalCandidatos}
              </div>
              <div className="text-sm text-emerald-600/80">Candidatos Inscritos</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mb-8 animate-slide-up">
          <Button 
            className="primary-btn flex items-center gap-2"
            onClick={() => setShowNovaVagaModal(true)}
          >
            <Plus size={20} />
            Criar Nova Vaga
          </Button>
        </div>

        {/* Vagas List */}
        <div className="grid grid-cols-1 gap-4 animate-slide-up">
          {vagasComCandidatos.map((vaga) => (
            <Card 
              key={vaga.id} 
              className={`modern-card transition-all duration-300 ${
                vaga.status === 'pausada' ? 'grayscale opacity-60' : ''
              }`}
            >
              <CardContent className="card-content p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-1">{vaga.titulo}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            {vaga.cidade}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            {vaga.candidatos} candidatos
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditarVaga(vaga)}
                          className="flex items-center gap-1"
                          disabled={vaga.status === 'pausada' ? false : false}
                        >
                          <Edit size={14} />
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleVerCandidatos(vaga)}
                          className="flex items-center gap-1"
                        >
                          <Eye size={14} />
                          Candidatos
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-primary">{vaga.salario}</span>
                        <span className="text-slate-600">{vaga.departamento}</span>
                      </div>
                      <button
                        onClick={() => handleToggleStatus(vaga.id)}
                        className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                          vaga.status === 'ativa' 
                            ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {vaga.status === 'ativa' ? 'Ativa' : 'Pausada'}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 animate-fade-in">
          <p className="text-description">
            © 2024 Grupo Athos. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Modals */}
      <NovaVagaModal
        isOpen={showNovaVagaModal}
        onClose={() => setShowNovaVagaModal(false)}
        onSubmit={handleNovaVaga}
      />

      {vagaSelecionada && (
        <>
          <EditarVagaModal
            isOpen={showEditarVagaModal}
            onClose={() => {
              setShowEditarVagaModal(false);
              setVagaSelecionada(null);
            }}
            vaga={vagaSelecionada}
            onSubmit={handleSubmitEdicao}
          />

          <CandidatosModal
            isOpen={showCandidatosModal}
            onClose={() => {
              setShowCandidatosModal(false);
              setVagaSelecionada(null);
            }}
            vaga={vagaSelecionada}
            candidatos={candidatosPorVaga[vagaSelecionada.id] || []}
            onClassificarCandidato={handleClassificarCandidato}
            onEnviarParaProcessoSeletivo={handleEnviarParaProcessoSeletivo}
            onEnviarParaGeladeira={handleEnviarParaGeladeira}
          />
        </>
      )}
    </div>
  );
}
