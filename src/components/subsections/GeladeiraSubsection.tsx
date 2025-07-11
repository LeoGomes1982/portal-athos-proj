import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Refrigerator, User, Calendar, Briefcase, MessageSquare, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GeladeiraSubsectionProps {
  onBack: () => void;
}

interface CandidatoGeladeira {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  curriculo: File | null;
  sobreMim: string;
  experiencias: string;
  dataInscricao: string;
  classificacao?: number;
  vaga: string;
  vagaId: string;
  dataArquivamento: string;
  comentarios: string;
}

export function GeladeiraSubsection({ onBack }: GeladeiraSubsectionProps) {
  const { toast } = useToast();
  const [candidatos, setCandidatos] = useState<CandidatoGeladeira[]>([]);
  const [comentariosEditando, setComentariosEditando] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const saved = localStorage.getItem('candidatosGeladeira');
    if (saved) {
      setCandidatos(JSON.parse(saved));
    }
  }, []);

  const handleSalvarComentario = (candidatoId: string) => {
    const novoComentario = comentariosEditando[candidatoId] || '';
    
    const candidatosAtualizados = candidatos.map(candidato =>
      candidato.id === candidatoId
        ? { ...candidato, comentarios: novoComentario }
        : candidato
    );

    setCandidatos(candidatosAtualizados);
    localStorage.setItem('candidatosGeladeira', JSON.stringify(candidatosAtualizados));
    
    // Remove do estado de edição
    const novosComentarios = { ...comentariosEditando };
    delete novosComentarios[candidatoId];
    setComentariosEditando(novosComentarios);

    toast({
      title: "Comentário salvo",
      description: "Comentário atualizado com sucesso",
    });
  };

  const handleEditarComentario = (candidatoId: string, comentarioAtual: string) => {
    setComentariosEditando({
      ...comentariosEditando,
      [candidatoId]: comentarioAtual
    });
  };

  const handleRemoverCandidato = (candidatoId: string) => {
    const candidatosAtualizados = candidatos.filter(c => c.id !== candidatoId);
    setCandidatos(candidatosAtualizados);
    localStorage.setItem('candidatosGeladeira', JSON.stringify(candidatosAtualizados));
    
    toast({
      title: "Candidato removido",
      description: "Candidato removido da geladeira",
    });
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl mb-6 shadow-lg">
            <Refrigerator size={32} className="text-white" />
          </div>
          <h1 className="page-title text-center">Geladeira</h1>
          <p className="text-description text-center max-w-2xl mx-auto">
            Candidatos arquivados para futuras oportunidades
          </p>
        </div>

        {/* Summary Card */}
        <div className="flex justify-center mb-8 animate-slide-up">
          <Card className="modern-card bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
            <CardContent className="card-content text-center p-4">
              <div className="text-3xl mb-2">🧊</div>
              <div className="text-2xl font-bold text-teal-600">
                {candidatos.length}
              </div>
              <div className="text-sm text-teal-600/80">Candidatos Arquivados</div>
            </CardContent>
          </Card>
        </div>

        {/* Candidatos List */}
        <div className="space-y-4 animate-slide-up">
          {candidatos.length === 0 ? (
            <div className="text-center py-12">
              <Refrigerator size={48} className="text-slate-400 mx-auto mb-4" />
              <p className="text-description">Nenhum candidato arquivado ainda.</p>
            </div>
          ) : (
            candidatos.map((candidato) => (
              <Card key={candidato.id} className="modern-card">
                <CardContent className="card-content p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800 mb-1">{candidato.nome}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <div className="flex items-center gap-1">
                              <Briefcase size={14} />
                              {candidato.vaga}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              Arquivado em: {new Date(candidato.dataArquivamento).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoverCandidato(candidato.id)}
                        >
                          Remover
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Informações do Candidato */}
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-slate-800 mb-2">Informações de Contato:</h4>
                            <div className="space-y-1 text-sm text-slate-600">
                              <p><strong>Email:</strong> {candidato.email}</p>
                              <p><strong>Telefone:</strong> {candidato.telefone}</p>
                              <p><strong>Endereço:</strong> {candidato.endereco}</p>
                            </div>
                          </div>
                          
                          {candidato.sobreMim && (
                            <div>
                              <h4 className="font-medium text-slate-800 mb-1">Sobre:</h4>
                              <p className="text-sm text-slate-600">{candidato.sobreMim}</p>
                            </div>
                          )}
                          
                          {candidato.experiencias && (
                            <div>
                              <h4 className="font-medium text-slate-800 mb-1">Experiências:</h4>
                              <p className="text-sm text-slate-600">{candidato.experiencias}</p>
                            </div>
                          )}
                        </div>

                        {/* Comentários */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare size={16} className="text-slate-600" />
                            <h4 className="font-medium text-slate-800">Comentários:</h4>
                          </div>
                          
                          {comentariosEditando[candidato.id] !== undefined ? (
                            <div className="space-y-2">
                              <Textarea
                                value={comentariosEditando[candidato.id]}
                                onChange={(e) => setComentariosEditando({
                                  ...comentariosEditando,
                                  [candidato.id]: e.target.value
                                })}
                                placeholder="Adicione seus comentários sobre este candidato..."
                                className="min-h-[100px]"
                              />
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => handleSalvarComentario(candidato.id)}
                                  className="flex items-center gap-1"
                                >
                                  <Save size={14} />
                                  Salvar
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    const novosComentarios = { ...comentariosEditando };
                                    delete novosComentarios[candidato.id];
                                    setComentariosEditando(novosComentarios);
                                  }}
                                >
                                  Cancelar
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              {candidato.comentarios ? (
                                <div 
                                  className="p-3 bg-slate-50 rounded-lg text-sm text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                                  onClick={() => handleEditarComentario(candidato.id, candidato.comentarios)}
                                >
                                  {candidato.comentarios}
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditarComentario(candidato.id, '')}
                                  className="flex items-center gap-1"
                                >
                                  <MessageSquare size={14} />
                                  Adicionar comentário
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 animate-fade-in">
          <p className="text-description">
            © 2024 Grupo Athos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}