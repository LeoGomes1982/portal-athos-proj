import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  const handleBack = () => {
    // Try to go back in browser history first
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback to RH page if no history
      navigate('/rh');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold text-blue-600">📦 Arquivo de RH</h1>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-3xl mb-2">📦</div>
            <div className="text-2xl font-bold text-gray-600">{funcionariosInativos.length}</div>
            <div className="text-sm text-gray-600">Funcionários Inativos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-3xl mb-2">✋</div>
            <div className="text-2xl font-bold text-blue-600">
              {funcionariosInativos.filter(f => f.motivo === 'Pedido de Demissão').length}
            </div>
            <div className="text-sm text-gray-600">Pedido Demissão</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-3xl mb-2">⚠️</div>
            <div className="text-2xl font-bold text-orange-600">
              {funcionariosInativos.filter(f => f.motivo === 'Demissão sem Justa Causa').length}
            </div>
            <div className="text-sm text-gray-600">Sem Justa Causa</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-3xl mb-2">🎖️</div>
            <div className="text-2xl font-bold text-purple-600">
              {funcionariosInativos.filter(f => f.motivo === 'Aposentadoria').length}
            </div>
            <div className="text-sm text-gray-600">Aposentadorias</div>
          </CardContent>
        </Card>
      </div>

      {/* Busca */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar no arquivo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista Minimalista */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Funcionários Inativos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            {filteredFuncionarios.map((funcionario, index) => (
              <div
                key={funcionario.id}
                className={`flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer ${
                  index !== filteredFuncionarios.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
                    📁
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{funcionario.nome}</div>
                    <div className="text-sm text-gray-500">{funcionario.cargo}</div>
                    <div className="text-xs text-gray-400">
                      Tempo na empresa: {calcularTempoEmpresa(funcionario.dataAdmissao, funcionario.dataDemissao)}
                    </div>
                  </div>
                </div>
                
                <div className="text-right flex items-center gap-3">
                  <div>
                    <div className="text-sm font-medium text-gray-700">
                      {new Date(funcionario.dataDemissao).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="text-xs text-gray-500">Data de Saída</div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getMotivoColor(funcionario.motivo)}`}>
                    <span>{getMotivoIcon(funcionario.motivo)}</span>
                    <span className="hidden sm:inline">{funcionario.motivo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {filteredFuncionarios.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-600 mb-2">Nenhum registro encontrado</h3>
          <p className="text-gray-500">Tente ajustar os filtros de busca</p>
        </div>
      )}
    </div>
  );
}
