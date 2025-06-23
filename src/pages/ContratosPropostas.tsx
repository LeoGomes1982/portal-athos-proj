
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, FileText, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NovaPropostaModal from "@/components/modals/NovaPropostaModal";
import NovoContratoModal from "@/components/modals/NovoContratoModal";
import VisualizacaoContratoPropostaModal from "@/components/modals/VisualizacaoContratoPropostaModal";

interface Proposta {
  id: string;
  cliente: string;
  empresa: string;
  servicos: Array<{
    descricao: string;
    valor: number;
  }>;
  valorTotal: number;
  status: 'ativa' | 'inativa';
  data: string;
  tipo: 'proposta';
}

interface Contrato {
  id: string;
  cliente: string;
  empresa: string;
  servicos: Array<{
    descricao: string;
    valor: number;
  }>;
  valorTotal: number;
  status: 'ativo' | 'inativo';
  data: string;
  tipo: 'contrato';
}

export default function ContratosPropostas() {
  const navigate = useNavigate();
  const [isNovaPropostaOpen, setIsNovaPropostaOpen] = useState(false);
  const [isNovoContratoOpen, setIsNovoContratoOpen] = useState(false);
  const [isVisualizacaoOpen, setIsVisualizacaoOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Proposta | Contrato | null>(null);

  // Mock data - em produção viria de uma API
  const [propostas, setPropostas] = useState<Proposta[]>([
    {
      id: "1",
      cliente: "Empresa ABC Ltda",
      empresa: "GA SERVIÇOS",
      servicos: [
        { descricao: "Consultoria em RH", valor: 5000 },
        { descricao: "Treinamento", valor: 2000 }
      ],
      valorTotal: 7000,
      status: 'ativa',
      data: "2024-01-15",
      tipo: 'proposta'
    }
  ]);

  const [contratos, setContratos] = useState<Contrato[]>([
    {
      id: "1",
      cliente: "Tech Solutions Ltd",
      empresa: "GOMES E GUIDOTTI",
      servicos: [
        { descricao: "Assessoria Jurídica", valor: 8000 },
        { descricao: "Consultoria Tributária", valor: 3000 }
      ],
      valorTotal: 11000,
      status: 'ativo',
      data: "2024-01-10",
      tipo: 'contrato'
    }
  ]);

  const totalContratos = contratos
    .filter(c => c.status === 'ativo')
    .reduce((sum, contrato) => sum + contrato.valorTotal, 0);

  const totalPropostas = propostas
    .filter(p => p.status === 'ativa')
    .reduce((sum, proposta) => sum + proposta.valorTotal, 0);

  const handleVisualizarItem = (item: Proposta | Contrato) => {
    setSelectedItem(item);
    setIsVisualizacaoOpen(true);
  };

  const handleNovaProposta = (novaProposta: Omit<Proposta, 'id' | 'data' | 'tipo'>) => {
    const proposta: Proposta = {
      ...novaProposta,
      id: Date.now().toString(),
      data: new Date().toISOString().split('T')[0],
      tipo: 'proposta'
    };
    setPropostas([...propostas, proposta]);
  };

  const handleNovoContrato = (novoContrato: Omit<Contrato, 'id' | 'data' | 'tipo'>) => {
    const contrato: Contrato = {
      ...novoContrato,
      id: Date.now().toString(),
      data: new Date().toISOString().split('T')[0],
      tipo: 'contrato'
    };
    setContratos([...contratos, contrato]);
  };

  const todosItens = [...propostas, ...contratos].sort((a, b) => {
    if (a.status === 'ativa' || a.status === 'ativo') return -1;
    if (b.status === 'ativa' || b.status === 'ativo') return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="container mx-auto px-6 py-12">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate("/comercial")}
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 shadow-lg">
            <FileText size={32} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Contratos e Propostas
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Gerencie propostas comerciais e contratos de clientes e fornecedores
          </p>
        </div>

        {/* Resumos Financeiros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Total Contratos</h3>
                <p className="text-2xl font-bold text-green-600">
                  R$ {totalContratos.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Total Propostas</h3>
                <p className="text-2xl font-bold text-blue-600">
                  R$ {totalPropostas.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
          <Button
            onClick={() => setIsNovaPropostaOpen(true)}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white h-12"
          >
            <Plus size={20} />
            Nova Proposta Comercial
          </Button>
          <Button
            onClick={() => setIsNovoContratoOpen(true)}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white h-12"
          >
            <Plus size={20} />
            Novo Contrato
          </Button>
        </div>

        {/* Lista de Contratos e Propostas */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Contratos e Propostas</h2>
          <div className="grid gap-4">
            {todosItens.map((item) => (
              <div
                key={`${item.tipo}-${item.id}`}
                className={`bg-white rounded-xl p-6 shadow-sm border border-orange-200 cursor-pointer transition-all hover:shadow-md ${
                  (item.status === 'inativa' || item.status === 'inativo') ? 'opacity-50 grayscale' : ''
                }`}
                onClick={() => handleVisualizarItem(item)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.tipo === 'proposta' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {item.tipo === 'proposta' ? 'Proposta' : 'Contrato'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        (item.status === 'ativa' || item.status === 'ativo')
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {item.status === 'ativa' || item.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">
                      {item.cliente}
                    </h3>
                    <p className="text-slate-600 mb-2">{item.empresa}</p>
                    <p className="text-sm text-slate-500">
                      {item.servicos.length} serviço(s) • {new Date(item.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-800">
                      R$ {item.valorTotal.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-sm text-slate-500">
            © 2024 Grupo Athos. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Modais */}
      <NovaPropostaModal
        isOpen={isNovaPropostaOpen}
        onClose={() => setIsNovaPropostaOpen(false)}
        onSubmit={handleNovaProposta}
      />

      <NovoContratoModal
        isOpen={isNovoContratoOpen}
        onClose={() => setIsNovoContratoOpen(false)}
        onSubmit={handleNovoContrato}
      />

      <VisualizacaoContratoPropostaModal
        isOpen={isVisualizacaoOpen}
        onClose={() => setIsVisualizacaoOpen(false)}
        item={selectedItem}
      />
    </div>
  );
}
