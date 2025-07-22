import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Archive, Settings, User, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GerenciarArquivoModal } from "@/components/modals/GerenciarArquivoModal";
import { FuncionarioDetalhesModal } from "@/components/modals/FuncionarioDetalhesModal";
import { useFuncionarioSync } from "@/hooks/useFuncionarioSync";
import { Funcionario } from "@/types/funcionario";

interface ArquivoRHSubsectionProps {
  onBack: () => void;
}



export function ArquivoRHSubsection({ onBack }: ArquivoRHSubsectionProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showGerenciarModal, setShowGerenciarModal] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Usar o hook de sincronização para pegar funcionários inativos
  const { funcionarios } = useFuncionarioSync();
  
  // Filtrar apenas funcionários inativos
  const funcionariosInativos = funcionarios.filter(f => f.status === 'inativo');

  const filteredFuncionarios = funcionariosInativos.filter(funcionario =>
    funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.setor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calcularTempoEmpresa = (dataAdmissao: string) => {
    if (!dataAdmissao) return 'Não informado';
    
    const admissao = new Date(dataAdmissao);
    const hoje = new Date();
    const diffTime = Math.abs(hoje.getTime() - admissao.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const anos = Math.floor(diffDays / 365);
    const meses = Math.floor((diffDays % 365) / 30);
    
    if (anos > 0) {
      return `${anos} ano${anos > 1 ? 's' : ''} e ${meses} mês${meses > 1 ? 'es' : ''}`;
    }
    return `${meses} mês${meses > 1 ? 'es' : ''}`;
  };

  const handleFuncionarioClick = (funcionario: Funcionario) => {
    setSelectedFuncionario(funcionario);
    setIsModalOpen(true);
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
          <Card className="modern-card bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">📁</div>
              <div className="text-2xl font-bold text-slate-600">
                {funcionariosInativos.length}
              </div>
              <div className="text-sm text-slate-600/80">Total de Inativos</div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">⏳</div>
              <div className="text-2xl font-bold text-orange-600">
                {funcionarios.filter(f => f.status === 'experiencia').length}
              </div>
              <div className="text-sm text-orange-600/80">Final de contrato 1º período</div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-2xl font-bold text-blue-600">
                {funcionarios.filter(f => f.status === 'ativo').length}
              </div>
              <div className="text-sm text-blue-600/80">Final de contrato 2º período</div>
            </CardContent>
          </Card>

          <Card className="modern-card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">⚠️</div>
              <div className="text-2xl font-bold text-purple-600">
                {funcionarios.filter(f => f.status === 'aviso').length}
              </div>
              <div className="text-sm text-purple-600/80">Demissão normal após aviso prévio</div>
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
          {filteredFuncionarios.map((funcionario) => (
            <Card 
              key={funcionario.id} 
              className="modern-card cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleFuncionarioClick(funcionario)}
            >
              <CardContent className="card-content p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center text-slate-600 overflow-hidden">
                      {funcionario.foto ? (
                        <img 
                          src={funcionario.foto} 
                          alt={funcionario.nome}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={20} />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{funcionario.nome}</div>
                      <div className="text-sm text-slate-600">{funcionario.cargo}</div>
                      <div className="text-xs text-slate-500">
                        Tempo na empresa: {calcularTempoEmpresa(funcionario.dataAdmissao)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <div className="text-sm font-medium text-slate-700">
                        {funcionario.dataAdmissao ? new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR') : 'N/A'}
                      </div>
                      <div className="text-xs text-slate-500">Data de Admissão</div>
                    </div>
                    
                    <div className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 bg-red-100 text-red-700">
                      <span>📋</span>
                      <span className="hidden sm:inline">Inativo</span>
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
      
      {/* Modal de Detalhes do Funcionário - somente leitura para inativos */}
      {selectedFuncionario && (
        <FuncionarioDetalhesModal
          funcionario={selectedFuncionario}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onStatusChange={() => {}} // Não permite mudança de status para inativos
          onFuncionarioUpdate={() => {}} // Não permite edição para inativos
        />
      )}
    </div>
  );
}
