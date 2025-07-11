
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase, Users, Plus, MapPin, Clock, Calendar, Edit, Eye } from "lucide-react";
import { NovaVagaModal } from "@/components/modals/NovaVagaModal";
import { EditarVagaModal } from "@/components/modals/EditarVagaModal";
import { CandidatosModal } from "@/components/modals/CandidatosModal";

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
  const [vagaSelecionada, setVagaSelecionada] = useState<Vaga | null>(null);
  const [vagas, setVagas] = useState<Vaga[]>([
    {
      id: "1",
      titulo: "Desenvolvedor Frontend",
      departamento: "Tecnologia",
      cidade: "São Paulo - SP",
      cargaHoraria: "40h semanais",
      jornada: "hibrido",
      descricao: "Desenvolvimento de interfaces web",
      requisitos: "React, TypeScript, CSS",
      salario: "R$ 5.000 - R$ 7.000",
      status: "ativa",
      dataPublicacao: "2024-01-15",
      candidatos: 8
    },
    {
      id: "2", 
      titulo: "Analista de Marketing",
      departamento: "Marketing",
      cidade: "Rio de Janeiro - RJ",
      cargaHoraria: "44h semanais",
      jornada: "integral",
      descricao: "Gestão de campanhas digitais",
      requisitos: "Marketing Digital, Google Ads",
      salario: "R$ 3.500 - R$ 5.000",
      status: "ativa",
      dataPublicacao: "2024-01-10",
      candidatos: 12
    }
  ]);

  // Simulando candidatos para demonstração
  const [candidatos, setCandidatos] = useState<{ [vagaId: string]: Candidato[] }>({
    "1": [
      {
        id: "1",
        nome: "João Silva",
        endereco: "Rua das Flores, 123 - São Paulo, SP",
        telefone: "(11) 99999-9999",
        email: "joao@email.com",
        curriculo: null,
        sobreMim: "Desenvolvedor com 3 anos de experiência em React",
        experiencias: "Trabalhei em startup de tecnologia desenvolvendo interfaces web",
        dataInscricao: "2024-01-16",
        classificacao: 0
      }
    ],
    "2": [
      {
        id: "2",
        nome: "Maria Santos",
        endereco: "Av. Copacabana, 456 - Rio de Janeiro, RJ",
        telefone: "(21) 88888-8888",
        email: "maria@email.com",
        curriculo: null,
        sobreMim: "Analista de marketing com foco em digital",
        experiencias: "5 anos de experiência em campanhas digitais e análise de dados",
        dataInscricao: "2024-01-12",
        classificacao: 0
      }
    ]
  });

  const vagasAtivas = vagas.filter(v => v.status === "ativa").length;
  const totalCandidatos = vagas.reduce((sum, vaga) => sum + vaga.candidatos, 0);

  const handleNovaVaga = (dadosVaga: Omit<Vaga, "id" | "candidatos" | "dataPublicacao">) => {
    const novaVaga: Vaga = {
      ...dadosVaga,
      id: Date.now().toString(),
      candidatos: 0,
      dataPublicacao: new Date().toISOString().split('T')[0]
    };
    setVagas([...vagas, novaVaga]);
  };

  const handleEditarVaga = (vaga: Vaga) => {
    setVagaSelecionada(vaga);
    setShowEditarVagaModal(true);
  };

  const handleSubmitEdicao = (dadosVaga: Vaga) => {
    setVagas(vagas.map(v => v.id === dadosVaga.id ? dadosVaga : v));
  };

  const handleVerCandidatos = (vaga: Vaga) => {
    setVagaSelecionada(vaga);
    setShowCandidatosModal(true);
  };

  const handleToggleStatus = (vagaId: string) => {
    setVagas(vagas.map(v => 
      v.id === vagaId 
        ? { ...v, status: v.status === "ativa" ? "pausada" : "ativa" }
        : v
    ));
  };

  const handleClassificarCandidato = (candidatoId: string, classificacao: number) => {
    setCandidatos(prev => {
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
    setCandidatos(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(vagaId => {
        updated[vagaId] = updated[vagaId].filter(c => c.id !== candidato.id);
      });
      return updated;
    });

    // Aqui você pode adicionar lógica para enviar o candidato para o processo seletivo
    // Por exemplo, salvar em localStorage ou enviar para uma API
    const processoSeletivoData = {
      candidato: {
        ...candidato,
        vaga: vagaSelecionada?.titulo || '',
        vagaId: vagaSelecionada?.id || ''
      },
      etapa: 'entrevista',
      dataEnvio: new Date().toISOString()
    };
    
    // Salva no localStorage para simular envio para processo seletivo
    const processoAtual = JSON.parse(localStorage.getItem('processoSeletivo') || '[]');
    localStorage.setItem('processoSeletivo', JSON.stringify([...processoAtual, processoSeletivoData]));
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
    <div className="app-container">
      <div className="content-wrapper">
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-slide-up">
          <Card className="modern-card bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
            <CardHeader className="card-header">
              <CardTitle className="section-title flex items-center gap-2 mb-0">
                <Briefcase size={20} className="text-primary" />
                Vagas Ativas
              </CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <div className="text-4xl font-bold text-primary mb-2">{vagasAtivas}</div>
              <p className="text-primary/80">vagas disponíveis</p>
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
            <CardHeader className="card-header">
              <CardTitle className="section-title flex items-center gap-2 mb-0">
                <Users size={20} className="text-primary" />
                Candidatos Inscritos
              </CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <div className="text-4xl font-bold text-primary mb-2">{totalCandidatos}</div>
              <p className="text-primary/80">candidatos totais</p>
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
          {vagas.map((vaga) => (
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
            candidatos={candidatos[vagaSelecionada.id] || []}
            onClassificarCandidato={handleClassificarCandidato}
            onEnviarParaProcessoSeletivo={handleEnviarParaProcessoSeletivo}
          />
        </>
      )}
    </div>
  );
}
