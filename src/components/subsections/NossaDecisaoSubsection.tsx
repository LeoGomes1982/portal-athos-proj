
import { useState } from "react";
import { Gavel, Plus, Search, Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="page-header-icon bg-gradient-to-br from-purple-100 to-purple-200">
            <Gavel size={20} className="text-purple-600" />
          </div>
          <div>
            <h2 className="section-title mb-0">Nossa Decisão</h2>
            <p className="text-description">Registro de decisões e aprovações da empresa</p>
          </div>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus size={16} className="mr-2" />
          Nova Decisão
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          placeholder="Buscar decisões por título ou responsável..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Decisions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDecisoes.map((decisao) => (
          <Card key={decisao.id} className="modern-card hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-4">
                <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-2 flex-1">
                  {decisao.titulo}
                </CardTitle>
                <Badge className={getStatusColor(decisao.status)}>
                  {decisao.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm line-clamp-3">
                {decisao.descricao}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User size={14} />
                  <span>{decisao.responsavel}</span>
                </div>
                <Badge className={getImpactoColor(decisao.impacto)}>
                  Impacto {decisao.impacto}
                </Badge>
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Calendar size={14} />
                <span>{new Date(decisao.dataDecisao).toLocaleDateString('pt-BR')}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Visualizar
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDecisoes.length === 0 && (
        <div className="text-center py-12">
          <Gavel size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Nenhuma decisão encontrada
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? "Tente outros termos de busca" : "Comece registrando sua primeira decisão"}
          </p>
          {!searchTerm && (
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus size={16} className="mr-2" />
              Registrar Primeira Decisão
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default NossaDecisaoSubsection;
