
import { useState } from "react";
import { Gavel, Plus, Search, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Decisao {
  id: string;
  titulo: string;
  descricao: string;
  responsavel: string;
  status: 'pendente' | 'aprovada' | 'rejeitada';
  dataDecisao: string;
  impacto: 'baixo' | 'medio' | 'alto';
}

const NossaDecisaoSubsection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [decisoes] = useState<Decisao[]>([
    {
      id: "1",
      titulo: "Implementação do Home Office",
      descricao: "Aprovação da política de trabalho remoto para todos os colaboradores",
      responsavel: "João Silva",
      status: "aprovada",
      dataDecisao: "2024-01-20",
      impacto: "alto"
    },
    {
      id: "2", 
      titulo: "Revisão da Política de Férias",
      descricao: "Análise e atualização das regras de concessão de férias",
      responsavel: "Maria Santos",
      status: "pendente",
      dataDecisao: "2024-01-25",
      impacto: "medio"
    }
  ]);

  const filteredDecisoes = decisoes.filter(decisao =>
    decisao.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    decisao.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovada': return 'bg-green-100 text-green-800';
      case 'rejeitada': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getImpactoColor = (impacto: string) => {
    switch (impacto) {
      case 'alto': return 'bg-red-100 text-red-800';
      case 'medio': return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const aprovadas = decisoes.filter(d => d.status === 'aprovada').length;
  const pendentes = decisoes.filter(d => d.status === 'pendente').length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
          <Gavel size={24} className="text-purple-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Nossa Decisão</h3>
          <p className="text-sm text-gray-600">Registro de decisões empresariais</p>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{decisoes.length}</div>
              <div className="text-sm text-gray-500">Decisões</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{aprovadas}</div>
              <div className="text-sm text-gray-500">Aprovadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{pendentes}</div>
              <div className="text-sm text-gray-500">Pendentes</div>
            </div>
          </div>
        </div>
      </div>

      {/* New Decision Button */}
      <Button className="mb-4 bg-purple-600 hover:bg-purple-700">
        <Plus size={16} className="mr-2" />
        Nova Decisão
      </Button>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input
          placeholder="Buscar decisões..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 text-sm"
        />
      </div>

      {/* Decisions List */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4">
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredDecisoes.map((decisao) => (
            <div key={decisao.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800 text-sm line-clamp-1">{decisao.titulo}</h4>
                <div className="flex gap-1">
                  <Badge className={`${getStatusColor(decisao.status)} text-xs`}>
                    {decisao.status}
                  </Badge>
                  <Badge className={`${getImpactoColor(decisao.impacto)} text-xs`}>
                    {decisao.impacto}
                  </Badge>
                </div>
              </div>
              
              <p className="text-gray-600 text-xs line-clamp-2 mb-2">{decisao.descricao}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <User size={12} />
                  <span>{decisao.responsavel}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{new Date(decisao.dataDecisao).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          ))}
          
          {filteredDecisoes.length === 0 && (
            <div className="text-center py-8">
              <Gavel size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm">
                {searchTerm ? "Nenhuma decisão encontrada" : "Nenhuma decisão cadastrada"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NossaDecisaoSubsection;
