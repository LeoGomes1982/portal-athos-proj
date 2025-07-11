import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Archive, Settings, User, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GerenciarArquivoModal } from "@/components/modals/GerenciarArquivoModal";

interface ArquivoRHSubsectionProps {
  onBack: () => void;
}

// Funcionários inativos mockados
const funcionariosInativos = [
  {
    id: 1,
    nome: "Pedro Almeida",
    cargo: "Analista de Marketing",
    dataAdmissao: "2022-03-15",
    dataDemissao: "2024-05-20",
    motivo: "Pedido de Demissão"
  },
  {
    id: 2,
    nome: "Luciana Costa",
    cargo: "Assistente Administrativo",
    dataAdmissao: "2021-08-10",
    dataDemissao: "2024-04-15",
    motivo: "Fim de Contrato"
  },
  {
    id: 3,
    nome: "Rafael Santos",
    cargo: "Desenvolvedor Junior",
    dataAdmissao: "2023-01-20",
    dataDemissao: "2024-03-30",
    motivo: "Demissão sem Justa Causa"
  },
  {
    id: 4,
    nome: "Carolina Silva",
    cargo: "Gerente de Vendas",
    dataAdmissao: "2020-05-05",
    dataDemissao: "2024-02-28",
    motivo: "Aposentadoria"
  },
  {
    id: 5,
    nome: "Thiago Oliveira",
    cargo: "Técnico em TI",
    dataAdmissao: "2022-11-12",
    dataDemissao: "2024-01-15",
    motivo: "Pedido de Demissão"
  }
];

const getMotivoColor = (motivo: string) => {
  switch (motivo) {
    case 'Pedido de Demissão':
      return 'bg-blue-100 text-blue-700';
    case 'Fim de Contrato':
      return 'bg-green-100 text-green-700';
    case 'Demissão sem Justa Causa':
      return 'bg-orange-100 text-orange-700';
    case 'Aposentadoria':
      return 'bg-purple-100 text-purple-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getMotivoIcon = (motivo: string) => {
  switch (motivo) {
    case 'Pedido de Demissão':
      return '✋';
    case 'Fim de Contrato':
      return '📅';
    case 'Demissão sem Justa Causa':
      return '⚠️';
    case 'Aposentadoria':
      return '🎖️';
    default:
      return '📝';
  }
};

export function ArquivoRHSubsection({ onBack }: ArquivoRHSubsectionProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showGerenciarModal, setShowGerenciarModal] = useState(false);

  const filteredFuncionarios = funcionariosInativos.filter(funcionario =>
    funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.motivo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calcularTempoEmpresa = (dataAdmissao: string, dataDemissao: string) => {
    const admissao = new Date(dataAdmissao);
    const demissao = new Date(dataDemissao);
    const diffTime = Math.abs(demissao.getTime() - admissao.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const anos = Math.floor(diffDays / 365);
    const meses = Math.floor((diffDays % 365) / 30);
    
    if (anos > 0) {
      return `${anos} ano${anos > 1 ? 's' : ''} e ${meses} mês${meses > 1 ? 'es' : ''}`;
    }
    return `${meses} mês${meses > 1 ? 'es' : ''}`;
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
            <Archive size={32} className="text-white" />
          </div>
          <h1 className="page-title text-center">Arquivo de RH</h1>
          <p className="text-description text-center max-w-2xl mx-auto">
            Gestão de registros de funcionários inativos e histórico da empresa
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <Card className="modern-card bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
            <CardHeader className="card-header">
              <CardTitle className="section-title flex items-center gap-2 mb-0">
                <Archive size={20} className="text-primary" />
                Total Inativos
              </CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <div className="text-4xl font-bold text-primary mb-2">{funcionariosInativos.length}</div>
              <p className="text-primary/80">funcionários arquivados</p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">✋</div>
              <div className="text-2xl font-bold text-blue-600">
                {funcionariosInativos.filter(f => f.motivo === 'Pedido de Demissão').length}
              </div>
              <div className="text-sm text-slate-600">Pedido Demissão</div>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">⚠️</div>
              <div className="text-2xl font-bold text-orange-600">
                {funcionariosInativos.filter(f => f.motivo === 'Demissão sem Justa Causa').length}
              </div>
              <div className="text-sm text-slate-600">Sem Justa Causa</div>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">🎖️</div>
              <div className="text-2xl font-bold text-purple-600">
                {funcionariosInativos.filter(f => f.motivo === 'Aposentadoria').length}
              </div>
              <div className="text-sm text-slate-600">Aposentadorias</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mb-8 animate-slide-up">
          <Button 
            className="primary-btn flex items-center gap-2"
            onClick={() => setShowGerenciarModal(true)}
          >
            <Settings size={20} />
            Gerenciar Arquivo de RH
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-8 animate-slide-up">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Buscar funcionário arquivado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Employee List */}
        <div className="grid grid-cols-1 gap-4 animate-slide-up">
          {filteredFuncionarios.map((funcionario, index) => (
            <Card key={funcionario.id} className="modern-card">
              <CardContent className="card-content p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center text-slate-600">
                      <User size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{funcionario.nome}</div>
                      <div className="text-sm text-slate-600">{funcionario.cargo}</div>
                      <div className="text-xs text-slate-500">
                        Tempo na empresa: {calcularTempoEmpresa(funcionario.dataAdmissao, funcionario.dataDemissao)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <div className="text-sm font-medium text-slate-700">
                        {new Date(funcionario.dataDemissao).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-xs text-slate-500">Data de Saída</div>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getMotivoColor(funcionario.motivo)}`}>
                      <span>{getMotivoIcon(funcionario.motivo)}</span>
                      <span className="hidden sm:inline">{funcionario.motivo}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFuncionarios.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-600 mb-2">Nenhum registro encontrado</h3>
            <p className="text-slate-500">Tente ajustar os filtros de busca</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 animate-fade-in">
          <p className="text-description">
            © 2024 Grupo Athos. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Modal */}
      <GerenciarArquivoModal
        isOpen={showGerenciarModal}
        onClose={() => setShowGerenciarModal(false)}
      />
    </div>
  );
}
