import { useState, useEffect } from "react";
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

export default function ProcessoSeletivo() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Estado para os candidatos em cada coluna
  const [candidatosEntrevista, setCandidatosEntrevista] = useState<Candidato[]>([
    // Carrega candidatos do localStorage se existirem
  ]);
  
  const [candidatosTreinamento, setCandidatosTreinamento] = useState<Candidato[]>([]);
  const [candidatosAdmissao, setCandidatosAdmissao] = useState<Candidato[]>([]);

  // Carrega dados do processo seletivo do localStorage ao montar o componente
  useEffect(() => {
    const processoData = JSON.parse(localStorage.getItem('processoSeletivo') || '[]');
    const candidatosCarregados = processoData.map((item: any) => item.candidato);
    setCandidatosEntrevista(candidatosCarregados);
  }, []);

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

  // Estatísticas
  const totalCandidatos = candidatosEntrevista.length + candidatosTreinamento.length + candidatosAdmissao.length;

  return (
    <div className="min-h-screen p-6" style={{ background: 'white', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto animate-fade-in bg-blue-100/40 rounded-lg shadow-lg p-8">
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
          <Card className="modern-card bg-white border-gray-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-2xl font-bold text-gray-700">
                {totalCandidatos}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-white border-gray-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">💼</div>
              <div className="text-2xl font-bold text-gray-700">
                {candidatosEntrevista.length}
              </div>
              <div className="text-sm text-gray-600">Entrevista</div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-white border-gray-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">🎓</div>
              <div className="text-2xl font-bold text-gray-700">
                {candidatosTreinamento.length}
              </div>
              <div className="text-sm text-gray-600">Treinamento</div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-white border-gray-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">🏢</div>
              <div className="text-2xl font-bold text-gray-700">
                {candidatosAdmissao.length}
              </div>
              <div className="text-sm text-gray-600">Admissão</div>
            </CardContent>
          </Card>
        </div>

        {/* Kanban Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up">
          {/* Coluna Entrevista */}
          <Card className="modern-card">
            <CardHeader className="card-header bg-purple-50">
              <CardTitle className="section-title flex items-center gap-2 mb-0">
                <UserCheck size={20} className="text-purple-600" />
                Entrevista
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-medium">
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
            <CardHeader className="card-header bg-emerald-50">
              <CardTitle className="section-title flex items-center gap-2 mb-0">
                <Building size={20} className="text-emerald-600" />
                Admissão
                <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-sm font-medium">
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

        {/* Footer */}
        <div className="text-center mt-16 animate-fade-in">
          <p className="text-description">
            © 2024 Grupo Athos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}