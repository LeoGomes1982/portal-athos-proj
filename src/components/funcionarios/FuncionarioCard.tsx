import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, AlertTriangle, FileX, Hourglass, Sun } from "lucide-react";
import { Funcionario } from "@/types/funcionario";
import { statusConfig } from "@/config/funcionarioStatus";
import { isProximoDoFim } from "@/utils/funcionarioUtils";
import { AvatarSelector } from "@/components/AvatarSelector";
import { useState } from "react";

interface FuncionarioCardProps {
  funcionario: Funcionario;
  onClick: (funcionario: Funcionario) => void;
  onUpdateAvatar?: (funcionarioId: number, newAvatar: string) => void;
}

export function FuncionarioCard({ funcionario, onClick, onUpdateAvatar }: FuncionarioCardProps) {
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const statusInfo = statusConfig[funcionario.status];

  // Função para calcular pontos de atividade
  const calcularPontosAtividade = () => {
    const historicoKey = `historico_funcionario_${funcionario.id}`;
    const savedHistorico = localStorage.getItem(historicoKey);
    
    console.log('Calculando pontos para funcionário:', funcionario.nome, 'ID:', funcionario.id);
    console.log('Chave do localStorage:', historicoKey);
    console.log('Histórico encontrado:', savedHistorico);
    
    // Vamos verificar todas as chaves do localStorage que começam com "historico"
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('historico_funcionario_')) {
        console.log('Chave encontrada no localStorage:', key, '- Valor:', localStorage.getItem(key));
      }
    }
    
    let pontos = 0;
    let registrosNeutros = 0;

    if (savedHistorico) {
      try {
        const historico = JSON.parse(savedHistorico);
        console.log('Histórico parseado:', historico);
        
        historico.forEach((registro: any) => {
          console.log('Processando registro:', registro);
          switch (registro.tipo) {
            case "positivo":
              pontos += 10;
              console.log('Adicionado 10 pontos (positivo), total:', pontos);
              break;
            case "negativo":
              pontos -= 3;
              console.log('Subtraído 3 pontos (negativo), total:', pontos);
              break;
            case "neutro":
              registrosNeutros += 1;
              console.log('Registro neutro encontrado, total neutros:', registrosNeutros);
              break;
          }
        });
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
      }
    }

    // A cada 2 registros neutros, adiciona 1 ponto
    pontos += Math.floor(registrosNeutros / 2);

    console.log('Pontos calculados:', pontos, 'para', funcionario.nome);
    return pontos;
  };
  
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

  // Verificar se período de experiência ou aviso prévio está vencendo
  const verificarPeriodosVencendo = () => {
    const hoje = new Date();
    const doisDiasDepois = new Date();
    doisDiasDepois.setDate(hoje.getDate() + 2);

    if (funcionario.status === 'experiencia' && funcionario.dataFimExperiencia) {
      const dataFim = new Date(funcionario.dataFimExperiencia);
      if (dataFim <= doisDiasDepois && dataFim >= hoje) {
        return { tipo: 'experiencia', data: funcionario.dataFimExperiencia };
      }
    }

    if (funcionario.status === 'aviso' && funcionario.dataFimAvisoPrevio) {
      const dataFim = new Date(funcionario.dataFimAvisoPrevio);
      if (dataFim <= doisDiasDepois && dataFim >= hoje) {
        return { tipo: 'aviso', data: funcionario.dataFimAvisoPrevio };
      }
    }

    return null;
  };

  const temDocumentosVencendo = verificarDocumentosVencendo();
  const periodoVencendo = verificarPeriodosVencendo();
  const temAlertaCritico = temDocumentosVencendo || periodoVencendo;

  return (
    <Card 
      className={`modern-card cursor-pointer transition-all duration-300 hover:shadow-lg ${
        temAlertaCritico ? 'border-red-300 bg-red-50/50' : 
        funcionario.status === 'destaque' ? 'border-yellow-300 bg-yellow-50/50' : ''
      }`}
      onClick={() => onClick(funcionario)}
    >
      <CardContent className="card-content p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Foto */}
            <div className="flex-shrink-0 relative">
              {funcionario.status === 'destaque' && !temAlertaCritico && (
                <div className="absolute -top-1 -right-1 animate-pulse z-10">
                  <div className="relative">
                    <Star className="w-6 h-6 text-yellow-600 fill-yellow-500 drop-shadow-lg" style={{
                      filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.9)) brightness(1.3) saturate(1.2)'
                    }} />
                    <div className="absolute inset-0 w-6 h-6 bg-yellow-500 rounded-full opacity-30 animate-ping"></div>
                  </div>
                </div>
              )}
              {mostrarAlertaStatus && !temAlertaCritico && funcionario.status !== 'destaque' && (
                <div className="absolute -top-1 -right-1 animate-bounce z-10">
                  <AlertTriangle className="w-5 h-5 text-red-500 fill-red-400 drop-shadow-md" />
                </div>
              )}
              {temAlertaCritico && (
                <div className="absolute -top-1 -right-1 animate-pulse z-10">
                  <div className="relative">
                    {periodoVencendo?.tipo === 'aviso' ? (
                      <AlertTriangle className="w-6 h-6 text-red-600 fill-red-500 drop-shadow-lg" style={{
                        filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.9)) brightness(1.2)'
                      }} />
                    ) : periodoVencendo?.tipo === 'experiencia' ? (
                      <Hourglass className="w-6 h-6 text-orange-600 fill-orange-500 drop-shadow-lg" style={{
                        filter: 'drop-shadow(0 0 8px rgba(251, 146, 60, 0.9)) brightness(1.2)'
                      }} />
                    ) : (
                      <FileX className="w-6 h-6 text-red-600 fill-red-500 drop-shadow-lg" style={{
                        filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.9)) brightness(1.2)'
                      }} />
                    )}
                    <div className={`absolute inset-0 w-6 h-6 rounded-full opacity-30 animate-ping ${
                      periodoVencendo?.tipo === 'experiencia' ? 'bg-orange-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                </div>
              )}
              <div 
                className={`w-12 h-12 border-2 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform ${
                  temAlertaCritico ? 'bg-red-100 border-red-300' : 
                  funcionario.status === 'destaque' ? 'bg-yellow-100 border-yellow-300' : 
                  'bg-primary/10 border-primary/20'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAvatarSelector(true);
                }}
                title="Clique para alterar o avatar"
              >
                <span className="text-2xl">{funcionario.foto}</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-semibold mb-1 ${
                    temAlertaCritico ? 'text-red-700' : 
                    funcionario.status === 'destaque' ? 'text-yellow-700' : 
                    'text-slate-800'
                  }`}>{funcionario.nome}</h3>
                  <div className={`flex items-center gap-4 text-sm ${
                    temAlertaCritico ? 'text-red-600' : 
                    funcionario.status === 'destaque' ? 'text-yellow-600' : 
                    'text-slate-600'
                  }`}>
                    <span>{funcionario.cargo}</span>
                    <span>{funcionario.setor}</span>
                    <span>{new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}</span>
                    <span className="text-blue-700 font-semibold">
                      {calcularPontosAtividade()} pts
                    </span>
                    {temDocumentosVencendo && (
                      <Badge variant="destructive" className="animate-pulse text-xs">
                        Documentos vencendo
                      </Badge>
                    )}
                    {periodoVencendo && (
                      <Badge variant="destructive" className="animate-pulse text-xs">
                        {periodoVencendo.tipo === 'experiencia' ? 'Experiência terminando' : 'Aviso prévio terminando'}
                      </Badge>
                    )}
                    {funcionario.status === 'destaque' && !temAlertaCritico && (
                      <Badge className="bg-yellow-500 text-white animate-pulse text-xs hover:bg-yellow-600">
                        Funcionário Destaque
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Status */}
                <div className="flex-shrink-0 text-right">
                  <Badge className={`${statusInfo.color} text-white text-xs font-medium px-3 py-1 rounded-full`}>
                    {statusInfo.label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <AvatarSelector
        open={showAvatarSelector}
        onOpenChange={setShowAvatarSelector}
        currentAvatar={funcionario.foto}
        onSelectAvatar={(newAvatar) => {
          if (onUpdateAvatar) {
            onUpdateAvatar(funcionario.id, newAvatar);
          }
        }}
      />
    </Card>
  );
}