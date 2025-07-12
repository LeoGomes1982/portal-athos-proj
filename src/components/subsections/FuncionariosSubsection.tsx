import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, Users } from "lucide-react";
import { FuncionarioDetalhesModal } from "@/components/modals/FuncionarioDetalhesModal";
import { FuncionarioCard } from "@/components/funcionarios/FuncionarioCard";
import { FuncionariosSummaryCards } from "@/components/funcionarios/FuncionariosSummaryCards";
import { Funcionario } from "@/types/funcionario";
import { funcionariosIniciais } from "@/data/funcionarios";
import { isProximoDoFim, dataJaPassou } from "@/utils/funcionarioUtils";

interface FuncionariosSubsectionProps {
  onBack: () => void;
}

export function FuncionariosSubsection({ onBack }: FuncionariosSubsectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [funcionariosList, setFuncionariosList] = useState(funcionariosIniciais);
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Verificar automaticamente as datas e atualizar status
  useEffect(() => {
    const verificarDatas = () => {
      setFuncionariosList(prev => prev.map(func => {
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
      }));
    };

    verificarDatas();
    const interval = setInterval(verificarDatas, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredFuncionarios = funcionariosList.filter(funcionario =>
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

  // Ordenar funcionários: documentos vencendo primeiro, depois destaque, depois os demais
  const funcionariosOrdenados = [...funcionariosAtivos].sort((a, b) => {
    const aTemDocVencendo = verificarDocumentosVencendo(a.id);
    const bTemDocVencendo = verificarDocumentosVencendo(b.id);
    const aEhDestaque = a.status === 'destaque';
    const bEhDestaque = b.status === 'destaque';

    // Prioridade 1: Documentos vencendo
    if (aTemDocVencendo && !bTemDocVencendo) return -1;
    if (!aTemDocVencendo && bTemDocVencendo) return 1;

    // Prioridade 2: Funcionários destaque (só se nenhum tem docs vencendo)
    if (!aTemDocVencendo && !bTemDocVencendo) {
      if (aEhDestaque && !bEhDestaque) return -1;
      if (!aEhDestaque && bEhDestaque) return 1;
    }

    // Ordem alfabética para os demais
    return a.nome.localeCompare(b.nome);
  });

  const handleFuncionarioClick = (funcionario: Funcionario) => {
    setSelectedFuncionario(funcionario);
    setIsModalOpen(true);
  };

  const handleStatusChange = (funcionarioId: number, novoStatus: Funcionario['status'], dataFim?: string) => {
    setFuncionariosList(prev => 
      prev.map(func => {
        if (func.id === funcionarioId) {
          const updatedFunc = { ...func, status: novoStatus };
          
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
          
          return updatedFunc;
        }
        return func;
      })
    );
  };

  const handleFuncionarioUpdate = (funcionarioAtualizado: Funcionario) => {
    setFuncionariosList(prev => 
      prev.map(func => 
        func.id === funcionarioAtualizado.id ? funcionarioAtualizado : func
      )
    );
    setSelectedFuncionario(funcionarioAtualizado);
  };

  const alertasExperiencia = funcionariosAtivos.filter(f => 
    f.status === 'experiencia' && f.dataFimExperiencia && isProximoDoFim(f.dataFimExperiencia)
  ).length;

  const alertasAvisoPrevio = funcionariosAtivos.filter(f => 
    f.status === 'aviso' && f.dataFimAvisoPrevio && isProximoDoFim(f.dataFimAvisoPrevio)
  ).length;

  return (
    <div className="app-container">
      <div className="content-wrapper">
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
        </div>

        <FuncionariosSummaryCards 
          funcionarios={funcionariosAtivos}
          alertasExperiencia={alertasExperiencia}
          alertasAvisoPrevio={alertasAvisoPrevio}
        />

        <div className="flex justify-center mb-8 animate-slide-up">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5" />
            <Input
              placeholder="Buscar funcionário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 bg-white border-primary/20 shadow-lg rounded-xl text-lg font-medium focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 animate-slide-up">
          {funcionariosOrdenados.map((funcionario) => (
            <FuncionarioCard 
              key={funcionario.id}
              funcionario={funcionario}
              onClick={handleFuncionarioClick}
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

        <div className="text-center mt-16 animate-fade-in">
          <p className="text-description">
            © 2024 Grupo Athos. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {selectedFuncionario && (
        <FuncionarioDetalhesModal
          funcionario={selectedFuncionario}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onStatusChange={handleStatusChange}
          onFuncionarioUpdate={handleFuncionarioUpdate}
        />
      )}
    </div>
  );
}