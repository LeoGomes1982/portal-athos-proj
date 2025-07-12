import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, AlertTriangle, FileX } from "lucide-react";
import { Funcionario } from "@/types/funcionario";
import { statusConfig } from "@/config/funcionarioStatus";
import { isProximoDoFim } from "@/utils/funcionarioUtils";

interface FuncionarioCardProps {
  funcionario: Funcionario;
  onClick: (funcionario: Funcionario) => void;
}

export function FuncionarioCard({ funcionario, onClick }: FuncionarioCardProps) {
  const statusInfo = statusConfig[funcionario.status];
  
  // Verificar se deve mostrar alerta de status
  const mostrarAlertaStatus = (
    (funcionario.status === 'experiencia' && funcionario.dataFimExperiencia && isProximoDoFim(funcionario.dataFimExperiencia)) ||
    (funcionario.status === 'aviso' && funcionario.dataFimAvisoPrevio && isProximoDoFim(funcionario.dataFimAvisoPrevio))
  );

  // Verificar se há documentos vencendo
  const verificarDocumentosVencendo = () => {
    const documentosKey = `documentos_funcionario_${funcionario.id}`;
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

  const temDocumentosVencendo = verificarDocumentosVencendo();

  return (
    <Card 
      className={`modern-card cursor-pointer transition-all duration-300 hover:shadow-lg ${temDocumentosVencendo ? 'border-red-300 bg-red-50/50' : ''}`}
      onClick={() => onClick(funcionario)}
    >
      <CardContent className="card-content p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Foto */}
            <div className="flex-shrink-0 relative">
              {funcionario.status === 'destaque' && (
                <div className="absolute -top-1 -right-1 animate-bounce z-10">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-400 drop-shadow-md" style={{
                    filter: 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.8)) brightness(1.2)'
                  }} />
                </div>
              )}
              {mostrarAlertaStatus && !temDocumentosVencendo && (
                <div className="absolute -top-1 -right-1 animate-bounce z-10">
                  <AlertTriangle className="w-5 h-5 text-red-500 fill-red-400 drop-shadow-md" />
                </div>
              )}
              {temDocumentosVencendo && (
                <div className="absolute -top-1 -right-1 animate-pulse z-10">
                  <div className="relative">
                    <FileX className="w-6 h-6 text-red-600 fill-red-500 drop-shadow-lg" style={{
                      filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.9)) brightness(1.2)'
                    }} />
                    <div className="absolute inset-0 w-6 h-6 bg-red-500 rounded-full opacity-30 animate-ping"></div>
                  </div>
                </div>
              )}
              <div className={`w-12 h-12 border-2 rounded-full flex items-center justify-center ${temDocumentosVencendo ? 'bg-red-100 border-red-300' : 'bg-primary/10 border-primary/20'}`}>
                <span className="text-2xl">{funcionario.foto}</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-semibold mb-1 ${temDocumentosVencendo ? 'text-red-700' : 'text-slate-800'}`}>{funcionario.nome}</h3>
                  <div className={`flex items-center gap-4 text-sm ${temDocumentosVencendo ? 'text-red-600' : 'text-slate-600'}`}>
                    <span>{funcionario.cargo}</span>
                    <span>{funcionario.setor}</span>
                    <span>{new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}</span>
                    {temDocumentosVencendo && (
                      <Badge variant="destructive" className="animate-pulse text-xs">
                        Documentos vencendo
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Status */}
                <div className="flex-shrink-0">
                  <Badge className={`${statusInfo.color} text-white text-xs font-medium px-3 py-1 rounded-full`}>
                    {statusInfo.label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}