import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, UserCheck, GraduationCap, Building, Plus, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
  vaga: string;
  vagaId: string;
}

interface ProcessoSeletivoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProcessoSeletivoModal = ({ isOpen, onClose }: ProcessoSeletivoModalProps) => {
  const { toast } = useToast();
  
  // Estado para os candidatos em cada coluna
  const [candidatosEntrevista, setCandidatosEntrevista] = useState<Candidato[]>([
    // Candidatos de exemplo que virão do processo de vagas
  ]);
  
  const [candidatosTreinamento, setCandidatosTreinamento] = useState<Candidato[]>([]);
  const [candidatosAdmissao, setCandidatosAdmissao] = useState<Candidato[]>([]);

  const moverCandidato = (candidato: Candidato, origem: string, destino: string) => {
    // Remove da origem
    if (origem === 'entrevista') {
      setCandidatosEntrevista(prev => prev.filter(c => c.id !== candidato.id));
    } else if (origem === 'treinamento') {
      setCandidatosTreinamento(prev => prev.filter(c => c.id !== candidato.id));
    }

    // Adiciona ao destino
    if (destino === 'treinamento') {
      setCandidatosTreinamento(prev => [...prev, candidato]);
    } else if (destino === 'admissao') {
      setCandidatosAdmissao(prev => [...prev, candidato]);
    }

    toast({
      title: "Candidato movido",
      description: `${candidato.nome} foi movido para ${destino}`,
    });
  };

  const CandidatoCard = ({ candidato, etapa }: { candidato: Candidato; etapa: string }) => (
    <Card className="modern-card mb-3">
      <CardContent className="p-4">
        <h4 className="font-semibold text-slate-800 mb-1">{candidato.nome}</h4>
        <p className="text-sm text-slate-600 mb-2">{candidato.vaga}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {candidato.classificacao ? `${candidato.classificacao}/5 ⭐` : 'Sem classificação'}
          </span>
          {etapa !== 'admissao' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (etapa === 'entrevista') {
                  moverCandidato(candidato, 'entrevista', 'treinamento');
                } else if (etapa === 'treinamento') {
                  moverCandidato(candidato, 'treinamento', 'admissao');
                }
              }}
              className="flex items-center gap-1"
            >
              <ArrowRight size={12} />
              Avançar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-7xl" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users size={24} className="text-blue-600" />
              </div>
              <div>
                <h2 className="modal-title">Processo Seletivo</h2>
                <p className="text-description">Kanban de candidatos em processo</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="secondary-btn p-2 h-auto"
            >
              <ArrowLeft size={20} />
            </Button>
          </div>
        </div>

        <div className="modal-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Coluna Entrevista */}
            <Card className="modern-card">
              <CardHeader className="card-header bg-blue-50">
                <CardTitle className="section-title flex items-center gap-2 mb-0">
                  <UserCheck size={20} className="text-blue-600" />
                  Entrevista
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                    {candidatosEntrevista.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="card-content p-4 min-h-96">
                {candidatosEntrevista.length === 0 ? (
                  <div className="text-center py-8">
                    <UserCheck size={32} className="text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">Nenhum candidato em entrevista</p>
                  </div>
                ) : (
                  candidatosEntrevista.map(candidato => (
                    <CandidatoCard key={candidato.id} candidato={candidato} etapa="entrevista" />
                  ))
                )}
              </CardContent>
            </Card>

            {/* Coluna Treinamento */}
            <Card className="modern-card">
              <CardHeader className="card-header bg-yellow-50">
                <CardTitle className="section-title flex items-center gap-2 mb-0">
                  <GraduationCap size={20} className="text-yellow-600" />
                  Treinamento
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                    {candidatosTreinamento.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="card-content p-4 min-h-96">
                {candidatosTreinamento.length === 0 ? (
                  <div className="text-center py-8">
                    <GraduationCap size={32} className="text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">Nenhum candidato em treinamento</p>
                  </div>
                ) : (
                  candidatosTreinamento.map(candidato => (
                    <CandidatoCard key={candidato.id} candidato={candidato} etapa="treinamento" />
                  ))
                )}
              </CardContent>
            </Card>

            {/* Coluna Admissão */}
            <Card className="modern-card">
              <CardHeader className="card-header bg-green-50">
                <CardTitle className="section-title flex items-center gap-2 mb-0">
                  <Building size={20} className="text-green-600" />
                  Admissão
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                    {candidatosAdmissao.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="card-content p-4 min-h-96">
                {candidatosAdmissao.length === 0 ? (
                  <div className="text-center py-8">
                    <Building size={32} className="text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">Nenhum candidato para admissão</p>
                  </div>
                ) : (
                  candidatosAdmissao.map(candidato => (
                    <CandidatoCard key={candidato.id} candidato={candidato} etapa="admissao" />
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProcessoSeletivo() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // Estatísticas globais
  const totalCandidatos = 0; // Será atualizado conforme candidatos chegam
  const candidatosEntrevista = 0;
  const candidatosTreinamento = 0;
  const candidatosAdmissao = 0;

  return (
    <div className="app-container">
      <div className="content-wrapper">
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
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
            <Users size={32} className="text-white" />
          </div>
          <h1 className="page-title text-center">
            Processo Seletivo
          </h1>
          <p className="text-description text-center max-w-2xl mx-auto">
            Gerencie candidatos através do funil de processo seletivo
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <Card className="modern-card bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
            <CardHeader className="card-header">
              <CardTitle className="section-title flex items-center gap-2 mb-0">
                <Users size={20} className="text-primary" />
                Total
              </CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <div className="text-4xl font-bold text-primary mb-2">{totalCandidatos}</div>
              <p className="text-primary/80">candidatos</p>
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="card-header">
              <CardTitle className="section-title flex items-center gap-2 mb-0">
                <UserCheck size={20} className="text-blue-600" />
                Entrevista
              </CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <div className="text-4xl font-bold text-blue-600 mb-2">{candidatosEntrevista}</div>
              <p className="text-blue-600/80">candidatos</p>
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="card-header">
              <CardTitle className="section-title flex items-center gap-2 mb-0">
                <GraduationCap size={20} className="text-yellow-600" />
                Treinamento
              </CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <div className="text-4xl font-bold text-yellow-600 mb-2">{candidatosTreinamento}</div>
              <p className="text-yellow-600/80">candidatos</p>
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="card-header">
              <CardTitle className="section-title flex items-center gap-2 mb-0">
                <Building size={20} className="text-green-600" />
                Admissão
              </CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <div className="text-4xl font-bold text-green-600 mb-2">{candidatosAdmissao}</div>
              <p className="text-green-600/80">candidatos</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mb-8 animate-slide-up">
          <Button 
            className="primary-btn flex items-center gap-2"
            onClick={() => setShowModal(true)}
          >
            <Plus size={20} />
            Gerenciar Processo Seletivo
          </Button>
        </div>

        {/* Info Section */}
        <div className="text-center py-16 animate-fade-in">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-gray-600 mb-2">Processo Seletivo Kanban</h3>
          <p className="text-gray-500 mb-6">
            Acompanhe o progresso dos candidatos através das etapas: Entrevista → Treinamento → Admissão
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 animate-fade-in">
          <p className="text-description">
            © 2024 Grupo Athos. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Modal */}
      <ProcessoSeletivoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}