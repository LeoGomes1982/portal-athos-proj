import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ArrowLeft, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { FuncionarioDetalhesModal } from "@/components/modals/FuncionarioDetalhesModal";
import { InativacaoFuncionarioModal } from "@/components/modals/InativacaoFuncionarioModal";
import { FuncionarioCard } from "@/components/funcionarios/FuncionarioCard";
import { FuncionariosSummaryCards } from "@/components/funcionarios/FuncionariosSummaryCards";
import { FuncionariosFiltros } from "@/components/filtros/FuncionariosFiltros";
import { Funcionario } from "@/types/funcionario";
import { isProximoDoFim, dataJaPassou } from "@/utils/funcionarioUtils";
import { useFuncionarioSync } from "@/hooks/useFuncionarioSync";
import { useToast } from "@/hooks/use-toast";

interface FuncionariosSubsectionProps {
  onBack: () => void;
}

export function FuncionariosSubsection({ onBack }: FuncionariosSubsectionProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInativacaoModalOpen, setIsInativacaoModalOpen] = useState(false);
  const [funcionarioParaInativar, setFuncionarioParaInativar] = useState<Funcionario | null>(null);
  const [funcionariosFiltrados, setFuncionariosFiltrados] = useState<Funcionario[]>([]);
  
  // Estados para paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(30);
  
  // Usar o hook de sincronização
  const { funcionarios, setFuncionarios, updateFuncionario, migrarDadosLocalParaSupabase, isLoading } = useFuncionarioSync();
  const funcionariosList = funcionarios;

  // Verificar se existem dados no localStorage para migrar
  const [funcionariosImportados, setFuncionariosImportados] = useState(0);
  
  useEffect(() => {
    const funcionariosLocal = JSON.parse(localStorage.getItem('funcionarios') || '[]');
    setFuncionariosImportados(funcionariosLocal.length);
  }, []);

  const handleMigrarDados = async () => {
    if (window.confirm(`Deseja migrar ${funcionariosImportados} funcionários do arquivo importado para o banco de dados?`)) {
      await migrarDadosLocalParaSupabase();
      setFuncionariosImportados(0);
    }
  };

  // Verificar automaticamente as datas e atualizar status
  useEffect(() => {
    const verificarDatas = () => {
      setFuncionarios(prev => {
        const updated = prev.map(func => {
          let novoStatus = func.status;

          if (func.status === 'experiencia' && func.dataFimExperiencia) {
            if (dataJaPassou(func.dataFimExperiencia)) {
              novoStatus = 'ativo';
            }
          }

          if (func.status === 'aviso' && func.dataFimAvisoPrevio) {
            if (dataJaPassou(func.dataFimAvisoPrevio)) {
              novoStatus = 'inativo';
            }
          }

          return { ...func, status: novoStatus };
        });

        return updated;
      });
    };

    verificarDatas();
    const interval = setInterval(verificarDatas, 60000);
    return () => clearInterval(interval);
  }, [setFuncionarios]);

  // Usar funcionários filtrados ou todos se não há filtros ativos
  const baseList = funcionariosFiltrados.length > 0 ? funcionariosFiltrados : funcionariosList;
  
  const filteredFuncionarios = baseList.filter(funcionario =>
    funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.setor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const funcionariosAtivos = filteredFuncionarios.filter(f => f.status !== 'inativo');

  // Função para verificar se funcionário tem documentos vencendo
  const verificarDocumentosVencendo = (funcionarioId: number) => {
    const documentosKey = `documentos_funcionario_${funcionarioId}`;
    const savedDocumentos = localStorage.getItem(documentosKey);
    
    if (savedDocumentos) {
      const documentos = JSON.parse(savedDocumentos);
      const hoje = new Date();
      const doisDiasDepois = new Date();
      doisDiasDepois.setDate(hoje.getDate() + 2);
      
      return documentos.some((doc: any) => {
        if (!doc.temValidade || !doc.dataValidade || doc.visualizado) return false;
        const dataValidade = new Date(doc.dataValidade);
        return dataValidade <= doisDiasDepois && dataValidade >= hoje;
      });
    }
    
    return false;
  };

  // Função para verificar se período de experiência ou aviso prévio está vencendo
  const verificarPeriodosVencendo = (funcionario: Funcionario) => {
    const hoje = new Date();
    const doisDiasDepois = new Date();
    doisDiasDepois.setDate(hoje.getDate() + 2);

    if (funcionario.status === 'experiencia' && funcionario.dataFimExperiencia) {
      const dataFim = new Date(funcionario.dataFimExperiencia);
      return dataFim <= doisDiasDepois && dataFim >= hoje;
    }

    if (funcionario.status === 'aviso' && funcionario.dataFimAvisoPrevio) {
      const dataFim = new Date(funcionario.dataFimAvisoPrevio);
      return dataFim <= doisDiasDepois && dataFim >= hoje;
    }

    return false;
  };

  // Ordenar funcionários: alertas críticos primeiro (docs vencendo ou períodos terminando), depois destaque, depois os demais
  const funcionariosOrdenados = [...funcionariosAtivos].sort((a, b) => {
    const aTemDocVencendo = verificarDocumentosVencendo(a.id);
    const bTemDocVencendo = verificarDocumentosVencendo(b.id);
    const aPeriodoVencendo = verificarPeriodosVencendo(a);
    const bPeriodoVencendo = verificarPeriodosVencendo(b);
    const aTemAlertaCritico = aTemDocVencendo || aPeriodoVencendo;
    const bTemAlertaCritico = bTemDocVencendo || bPeriodoVencendo;
    const aEhDestaque = a.status === 'destaque';
    const bEhDestaque = b.status === 'destaque';

    // Prioridade 1: Alertas críticos (documentos vencendo ou períodos terminando)
    if (aTemAlertaCritico && !bTemAlertaCritico) return -1;
    if (!aTemAlertaCritico && bTemAlertaCritico) return 1;

    // Prioridade 2: Funcionários destaque (só se nenhum tem alertas críticos)
    if (!aTemAlertaCritico && !bTemAlertaCritico) {
      if (aEhDestaque && !bEhDestaque) return -1;
      if (!aEhDestaque && bEhDestaque) return 1;
    }

    // Ordem alfabética para os demais
    return a.nome.localeCompare(b.nome);
  });

  // Calcular funcionários para a página atual
  const totalFuncionarios = funcionariosOrdenados.length;
  const totalPaginas = itensPorPagina === -1 ? 1 : Math.ceil(totalFuncionarios / itensPorPagina);
  
  const funcionariosPaginados = itensPorPagina === -1 
    ? funcionariosOrdenados 
    : funcionariosOrdenados.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina);

  const handleFuncionarioClick = (funcionario: Funcionario) => {
    setSelectedFuncionario(funcionario);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (funcionarioId: number, novoStatus: Funcionario['status'], dataFim?: string) => {
    const funcionarioToUpdate = funcionarios.find(f => f.id === funcionarioId);
    if (!funcionarioToUpdate) return;

    // Se o status for "inativo", abrir modal de inativação
    if (novoStatus === 'inativo') {
      setFuncionarioParaInativar(funcionarioToUpdate);
      setIsInativacaoModalOpen(true);
      return;
    }

    const updatedFunc = { ...funcionarioToUpdate, status: novoStatus };
    
    if (novoStatus !== 'experiencia') {
      delete updatedFunc.dataFimExperiencia;
    }
    if (novoStatus !== 'aviso') {
      delete updatedFunc.dataFimAvisoPrevio;
    }
    
    if (dataFim) {
      if (novoStatus === 'experiencia') {
        updatedFunc.dataFimExperiencia = dataFim;
      } else if (novoStatus === 'aviso') {
        updatedFunc.dataFimAvisoPrevio = dataFim;
      }
    }

    // Atualizar no Supabase
    await updateFuncionario(updatedFunc);
    
    // Atualizar estado local
    setFuncionarios(prev => 
      prev.map(func => func.id === funcionarioId ? updatedFunc : func)
    );
  };

  const handleConfirmarInativacao = async (dataInativacao: string, motivo: string) => {
    if (!funcionarioParaInativar) return;

    const funcionarioInativado = {
      ...funcionarioParaInativar,
      status: 'inativo' as Funcionario['status'],
      dataInativacao,
      motivoInativacao: motivo
    };

    try {
      // Atualizar no Supabase
      await updateFuncionario(funcionarioInativado);
      
      // Atualizar estado local
      setFuncionarios(prev => 
        prev.map(func => func.id === funcionarioParaInativar.id ? funcionarioInativado : func)
      );

      // Fechar modal
      setFuncionarioParaInativar(null);
      
      // Forçar recarregamento para garantir sincronização
      setTimeout(() => {
        window.dispatchEvent(new Event('funcionariosUpdated'));
      }, 500);
      
      toast({
        title: "Funcionário Inativado",
        description: `${funcionarioParaInativar.nome} foi inativado e movido para o Arquivo de RH.`,
      });
      
    } catch (error) {
      console.error('Erro ao inativar funcionário:', error);
      toast({
        title: "Erro",
        description: "Erro ao inativar funcionário. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleFuncionarioUpdate = async (funcionarioAtualizado: Funcionario) => {
    console.log('handleFuncionarioUpdate chamado:', funcionarioAtualizado.nome, funcionarioAtualizado.id);
    console.log('updateFuncionario disponível?', !!updateFuncionario);
    
    // Atualizar no Supabase primeiro
    await updateFuncionario(funcionarioAtualizado);
    
    // Atualizar estado local
    setFuncionarios(prev => 
      prev.map(f => f.id === funcionarioAtualizado.id ? funcionarioAtualizado : f)
    );
    
    // REMOVIDO: setSelectedFuncionario(funcionarioAtualizado) que causava re-renders desnecessários
    // O modal já tem os dados atualizados através do useEffect que monitora funcionario.id
  };

  // Resetar página quando filtros ou busca mudam
  useEffect(() => {
    setPaginaAtual(1);
  }, [searchTerm, funcionariosFiltrados]);

  const alertasExperiencia = funcionariosAtivos.filter(f => 
    f.status === 'experiencia' && f.dataFimExperiencia && isProximoDoFim(f.dataFimExperiencia)
  ).length;

  const alertasAvisoPrevio = funcionariosAtivos.filter(f => 
    f.status === 'aviso' && f.dataFimAvisoPrevio && isProximoDoFim(f.dataFimAvisoPrevio)
  ).length;

  return (
    <div className="min-h-screen p-6" style={{ background: 'white', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto animate-fade-in bg-blue-100/40 rounded-lg shadow-lg p-8">
        <Button variant="ghost" className="mb-6" onClick={onBack}>
          <ArrowLeft size={16} />
          Voltar
        </Button>

        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mb-6 shadow-lg">
            <Users size={32} className="text-white" />
          </div>
          <h1 className="page-title text-center">Gestão de Funcionários</h1>
          <p className="text-description text-center max-w-2xl mx-auto">
            Controle completo da equipe e colaboradores
          </p>
          
          {funcionariosImportados > 0 && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 mb-3">
                📁 {funcionariosImportados} funcionários importados encontrados no arquivo local
              </p>
              <Button 
                onClick={handleMigrarDados}
                variant="outline"
                className="bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
              >
                Migrar para Banco de Dados
              </Button>
            </div>
          )}
        </div>

        <FuncionariosSummaryCards 
          funcionarios={funcionariosAtivos}
          alertasExperiencia={alertasExperiencia}
          alertasAvisoPrevio={alertasAvisoPrevio}
        />

        <div className="flex justify-center gap-4 mb-8 animate-slide-up">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5" />
            <Input
              placeholder="Buscar funcionário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 bg-white border-primary/20 shadow-lg rounded-xl text-lg font-medium focus:border-primary"
            />
          </div>
          <FuncionariosFiltros 
            funcionarios={funcionariosList}
            onFiltrosChange={setFuncionariosFiltrados}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl mb-4">⏳</div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">Carregando funcionários...</h3>
            <p className="text-gray-500">Sincronizando dados em tempo real</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 animate-slide-up">
              {funcionariosPaginados.map((funcionario) => (
              <FuncionarioCard
                key={funcionario.id}
                funcionario={funcionario}
                onClick={handleFuncionarioClick}
                onUpdateAvatar={async (funcionarioId, newAvatar) => {
                  const funcionarioAtualizado = { ...funcionario, foto: newAvatar };
                  await updateFuncionario(funcionarioAtualizado);
                  handleFuncionarioUpdate(funcionarioAtualizado);
                }}
              />
              ))}
            </div>

            {funcionariosOrdenados.length === 0 && (
              <div className="text-center py-16 animate-fade-in">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-600 mb-2">Nenhum funcionário encontrado</h3>
                <p className="text-gray-500">Tente ajustar os filtros de busca</p>
              </div>
            )}

            {/* Controles de Paginação */}
            {funcionariosOrdenados.length > 0 && (
              <div className="mt-8 flex flex-col items-center gap-4 animate-fade-in">
                {/* Seletor de itens por página */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Mostrar:</span>
                  <Select
                    value={itensPorPagina.toString()}
                    onValueChange={(value) => {
                      setItensPorPagina(value === "-1" ? -1 : parseInt(value));
                      setPaginaAtual(1);
                    }}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                      <SelectItem value="-1">Todos</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-600">
                    {itensPorPagina === -1 
                      ? `Mostrando todos os ${totalFuncionarios} funcionários`
                      : `Mostrando ${Math.min((paginaAtual - 1) * itensPorPagina + 1, totalFuncionarios)} - ${Math.min(paginaAtual * itensPorPagina, totalFuncionarios)} de ${totalFuncionarios} funcionários`
                    }
                  </span>
                </div>

                {/* Navegação de páginas */}
                {itensPorPagina !== -1 && totalPaginas > 1 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                      disabled={paginaAtual === 1}
                    >
                      <ChevronLeft size={16} />
                      Anterior
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                        let pageNumber;
                        if (totalPaginas <= 5) {
                          pageNumber = i + 1;
                        } else if (paginaAtual <= 3) {
                          pageNumber = i + 1;
                        } else if (paginaAtual >= totalPaginas - 2) {
                          pageNumber = totalPaginas - 4 + i;
                        } else {
                          pageNumber = paginaAtual - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNumber}
                            variant={paginaAtual === pageNumber ? "default" : "outline"}
                            size="sm"
                            className="w-8 h-8 p-0"
                            onClick={() => setPaginaAtual(pageNumber)}
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
                      disabled={paginaAtual === totalPaginas}
                    >
                      Próxima
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                )}

                {/* Botão Mostrar Mais (alternativa à paginação) */}
                {itensPorPagina !== -1 && paginaAtual < totalPaginas && (
                  <Button 
                    variant="outline" 
                    onClick={() => setPaginaAtual(prev => prev + 1)}
                    className="mt-4"
                  >
                    Mostrar Mais Funcionários
                  </Button>
                )}
              </div>
            )}
          </>
        )}

        <div className="text-center mt-16 animate-fade-in">
          <p className="text-description">
            © 2024 Grupo Athos. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {selectedFuncionario && (
        <FuncionarioDetalhesModal
          funcionario={funcionarios.find(f => f.id === selectedFuncionario.id) || selectedFuncionario}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedFuncionario(null);
          }}
          onStatusChange={handleStatusChange}
          onFuncionarioUpdate={handleFuncionarioUpdate}
        />
      )}

      <InativacaoFuncionarioModal
        isOpen={isInativacaoModalOpen}
        onClose={() => {
          setIsInativacaoModalOpen(false);
          setFuncionarioParaInativar(null);
        }}
        funcionario={funcionarioParaInativar ? {
          id: funcionarioParaInativar.id,
          nome: funcionarioParaInativar.nome,
          cargo: funcionarioParaInativar.cargo
        } : null}
        onConfirm={handleConfirmarInativacao}
      />
    </div>
  );
}