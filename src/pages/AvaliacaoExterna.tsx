import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, Clock, CheckCircle, XCircle } from "lucide-react";
import { 
  checkRateLimit, 
  validateEvaluationToken, 
  validateEvaluationData, 
  generateCSRFToken, 
  validateCSRFToken,
  detectSuspiciousActivity,
  logSecurityEvent 
} from '@/utils/securityValidations';

interface LinkInfo {
  id: string;
  token: string;
  funcionario_id: string;
  funcionario_nome: string;
  tipo_avaliacao: 'colega' | 'chefia' | 'responsavel';
  criado_por: string;
  data_expiracao: string;
  usado: boolean;
}

const PERGUNTAS_AVALIACAO = {
  colega: [
    "Como você avalia a comunicação do colega?",
    "O colega colabora bem em equipe?",
    "Demonstra pontualidade e assiduidade?",
    "Respeita prazos estabelecidos?",
    "Mantém bom relacionamento interpessoal?",
    "Demonstra iniciativa no trabalho?",
    "É receptivo a feedback?",
    "Compartilha conhecimentos com a equipe?",
    "Demonstra organização nas tarefas?",
    "Contribui para um ambiente de trabalho positivo?"
  ],
  chefia: [
    "Como você avalia a qualidade do trabalho entregue?",
    "Demonstra proatividade nas atividades?",
    "Segue procedimentos e normas da empresa?",
    "Gerencia bem o tempo e prioridades?",
    "Demonstra capacidade de resolver problemas?",
    "Aceita bem críticas construtivas?",
    "Busca crescimento profissional?",
    "Demonstra comprometimento com resultados?",
    "Trabalha bem sob pressão?",
    "Contribui para o alcance de metas da equipe?"
  ],
  responsavel: [
    "Demonstra conhecimento técnico adequado para a função?",
    "Apresenta soluções inovadoras?",
    "Mantém qualidade consistente no trabalho?",
    "Demonstra liderança quando necessário?",
    "Adapta-se bem a mudanças?",
    "Demonstra visão estratégica?",
    "Contribui para melhoria de processos?",
    "Demonstra ética profissional?",
    "Desenvolve bons relacionamentos externos?",
    "Representa bem a empresa?",
    "Demonstra potencial de crescimento?",
    "Alinha-se aos valores da empresa?",
    "Demonstra autonomia na tomada de decisões?",
    "Gerencia conflitos de forma eficaz?",
    "Demonstra capacidade de mentor?",
    "Contribui para clima organizacional positivo?",
    "Demonstra responsabilidade social?",
    "Busca constantemente aperfeiçoamento?",
    "Demonstra resiliência em situações adversas?",
    "Contribui para inovação na empresa?"
  ]
};

export function AvaliacaoExterna() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [linkInfo, setLinkInfo] = useState<LinkInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [etapa, setEtapa] = useState(1);
  const [enviando, setEnviando] = useState(false);
  const [csrfToken] = useState(generateCSRFToken());
  
  const [formData, setFormData] = useState({
    avaliador_nome: '',
    perguntas_marcadas: {} as Record<string, string>,
    perguntas_descritivas: {} as Record<string, string>,
    feedback: ''
  });

  // Carregar informações do link
  useEffect(() => {
    const carregarLinkInfo = async () => {
      if (!token) {
        logSecurityEvent('INVALID_TOKEN_ACCESS', { token: 'missing' });
        setError('Token inválido');
        setLoading(false);
        return;
      }

      // Validação do formato do token
      if (!validateEvaluationToken(token)) {
        logSecurityEvent('INVALID_TOKEN_FORMAT', { token });
        setError('Token com formato inválido');
        setLoading(false);
        return;
      }

      // Rate limiting por IP/sessão
      const clientId = `${window.location.hostname}-${token}`;
      if (!checkRateLimit(clientId)) {
        logSecurityEvent('RATE_LIMIT_EXCEEDED', { token, clientId });
        setError('Muitas tentativas. Tente novamente em 1 hora.');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('avaliacao_externa_links')
          .select('*')
          .eq('token', token)
          .single();

        if (error) throw error;

        if (!data) {
          logSecurityEvent('TOKEN_NOT_FOUND', { token });
          setError('Link não encontrado');
          setLoading(false);
          return;
        }

        // Verificar se o link expirou
        if (new Date(data.data_expiracao) < new Date()) {
          logSecurityEvent('EXPIRED_TOKEN_ACCESS', { token, expiration: data.data_expiracao });
          setError('Este link expirou');
          setLoading(false);
          return;
        }

        // Verificar se já foi usado
        if (data.usado) {
          logSecurityEvent('USED_TOKEN_ACCESS', { token });
          setError('Este link já foi utilizado');
          setLoading(false);
          return;
        }

        setLinkInfo(data as LinkInfo);
        setLoading(false);

      } catch (error) {
        console.error('Erro ao carregar link:', error);
        logSecurityEvent('LINK_LOAD_ERROR', { token, error: error.message });
        setError('Erro ao carregar informações');
        setLoading(false);
      }
    };

    carregarLinkInfo();
  }, [token]);

  // Calcular resultado baseado nas respostas
  const calcularResultado = (perguntas_marcadas: Record<string, string>): 'POSITIVO' | 'NEGATIVO' | 'NEUTRO' => {
    const respostas = Object.values(perguntas_marcadas);
    const positivas = respostas.filter(resp => resp === 'Excelente' || resp === 'Muito Bom').length;
    const negativas = respostas.filter(resp => resp === 'Ruim' || resp === 'Muito Ruim').length;
    const neutras = respostas.filter(resp => resp === 'Regular' || resp === 'Bom').length;

    if (positivas > negativas && positivas > neutras) {
      return 'POSITIVO';
    } else if (negativas > positivas) {
      return 'NEGATIVO';
    } else {
      return 'NEUTRO';
    }
  };

  const handleSubmit = async () => {
    if (!linkInfo) return;

    // Validação CSRF
    if (!validateCSRFToken(csrfToken)) {
      logSecurityEvent('CSRF_TOKEN_INVALID', { token: linkInfo.token });
      toast({
        title: "Erro de segurança",
        description: "Sessão expirada. Recarregue a página.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.avaliador_nome) {
      toast({
        title: "Erro",
        description: "Por favor, informe seu nome",
        variant: "destructive"
      });
      return;
    }

    // Verificar se todas as perguntas foram respondidas
    const perguntas = PERGUNTAS_AVALIACAO[linkInfo.tipo_avaliacao];
    const perguntasRespondidas = Object.keys(formData.perguntas_marcadas).length;
    
    if (perguntasRespondidas < perguntas.length) {
      toast({
        title: "Erro",
        description: "Por favor, responda todas as perguntas",
        variant: "destructive"
      });
      return;
    }

    // Validação de dados
    const evaluationData = {
      funcionario_id: linkInfo.funcionario_id,
      funcionario_nome: linkInfo.funcionario_nome,
      tipo_avaliacao: linkInfo.tipo_avaliacao,
      perguntas_marcadas: formData.perguntas_marcadas,
      perguntas_descritivas: formData.perguntas_descritivas,
      feedback: formData.feedback
    };

    const validation = validateEvaluationData(evaluationData);
    if (!validation.isValid) {
      logSecurityEvent('INVALID_EVALUATION_DATA', { 
        token: linkInfo.token, 
        errors: validation.errors 
      });
      toast({
        title: "Dados inválidos",
        description: validation.errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    // Detecção de atividade suspeita
    if (detectSuspiciousActivity(formData)) {
      logSecurityEvent('SUSPICIOUS_ACTIVITY_DETECTED', { 
        token: linkInfo.token,
        formData: formData 
      });
      toast({
        title: "Atividade suspeita detectada",
        description: "Sua submissão será revisada manualmente.",
        variant: "destructive"
      });
      return;
    }

    setEnviando(true);

    try {
      const resultado = calcularResultado(formData.perguntas_marcadas);

      // Salvar a avaliação
      const { data: avaliacao, error: avaliacaoError } = await supabase
        .from('avaliacoes_desempenho')
        .insert({
          funcionario_id: linkInfo.funcionario_id,
          funcionario_nome: linkInfo.funcionario_nome,
          tipo_avaliacao: linkInfo.tipo_avaliacao,
          avaliador_nome: formData.avaliador_nome,
          data_avaliacao: new Date().toISOString().split('T')[0],
          perguntas_marcadas: formData.perguntas_marcadas,
          perguntas_descritivas: formData.perguntas_descritivas,
          feedback: formData.feedback,
          pontuacao_total: 0,
          resultado
        })
        .select()
        .single();

      if (avaliacaoError) throw avaliacaoError;

      // Marcar o link como usado e associar à avaliação
      const { error: linkError } = await supabase
        .from('avaliacao_externa_links')
        .update({ 
          usado: true, 
          avaliacao_id: avaliacao.id 
        })
        .eq('id', linkInfo.id);

      if (linkError) throw linkError;

      // Adicionar registro ao histórico do funcionário
      await supabase
        .from('funcionario_historico')
        .insert({
          funcionario_id: parseInt(linkInfo.funcionario_id),
          titulo: `Avaliação de Desempenho - ${linkInfo.tipo_avaliacao.charAt(0).toUpperCase() + linkInfo.tipo_avaliacao.slice(1)}`,
          descricao: `Avaliação externa realizada com resultado: ${resultado}. Avaliador: ${formData.avaliador_nome}`,
          tipo: resultado === 'POSITIVO' ? 'positivo' : resultado === 'NEGATIVO' ? 'negativo' : 'neutro',
          usuario: formData.avaliador_nome,
          arquivo_url: `/resultados-pessoais?avaliacao=${avaliacao.id}`
        });

      logSecurityEvent('EVALUATION_SUBMITTED_SUCCESS', { 
        token: linkInfo.token,
        avaliacao_id: avaliacao.id,
        resultado 
      });

      toast({
        title: "Sucesso",
        description: "Avaliação enviada com sucesso!",
      });

      // Redirecionar para página de sucesso
      setEtapa(3);

    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      logSecurityEvent('EVALUATION_SUBMISSION_ERROR', { 
        token: linkInfo.token,
        error: error.message 
      });
      toast({
        title: "Erro",
        description: "Não foi possível enviar a avaliação",
        variant: "destructive"
      });
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando avaliação...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <XCircle className="mx-auto mb-4 text-red-500" size={64} />
            <h2 className="text-xl font-semibold mb-2">Avaliação Indisponível</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/')} variant="outline">
              Ir para Página Inicial
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (etapa === 3) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
            <h2 className="text-xl font-semibold mb-2">Avaliação Enviada!</h2>
            <p className="text-gray-600 mb-4">
              Sua avaliação foi enviada com sucesso. Obrigado pela participação!
            </p>
            <Button onClick={() => navigate('/')} variant="outline">
              Ir para Página Inicial
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const perguntas = PERGUNTAS_AVALIACAO[linkInfo!.tipo_avaliacao];
  const numPerguntasDescritivas = linkInfo!.tipo_avaliacao === 'colega' ? 1 : 
                                 linkInfo!.tipo_avaliacao === 'chefia' ? 4 : 5;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <ExternalLink className="text-purple-600" size={24} />
              <div>
                <CardTitle>Avaliação de Desempenho</CardTitle>
                <p className="text-sm text-gray-600">
                  Funcionário: <span className="font-medium">{linkInfo!.funcionario_nome}</span> • 
                  Tipo: <span className="font-medium capitalize">{linkInfo!.tipo_avaliacao}</span>
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={16} />
              <span>
                Expira em: {new Date(linkInfo!.data_expiracao).toLocaleDateString('pt-BR')} às {new Date(linkInfo!.data_expiracao).toLocaleTimeString('pt-BR')}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle>
              {etapa === 1 ? 'Informações do Avaliador' : 'Perguntas da Avaliação'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {etapa === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Seu Nome Completo</Label>
                  <Input
                    value={formData.avaliador_nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, avaliador_nome: e.target.value }))}
                    placeholder="Digite seu nome completo"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={() => setEtapa(2)}
                    disabled={!formData.avaliador_nome}
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            )}

            {etapa === 2 && (
              <div className="space-y-6">
                {/* Perguntas de Múltipla Escolha */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Perguntas de Múltipla Escolha</h3>
                  <div className="max-h-96 overflow-y-auto space-y-4">
                    {perguntas.map((pergunta, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">{pergunta}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <RadioGroup
                            value={formData.perguntas_marcadas[`pergunta_${index}`] || ''}
                            onValueChange={(value) => 
                              setFormData(prev => ({
                                ...prev,
                                perguntas_marcadas: {
                                  ...prev.perguntas_marcadas,
                                  [`pergunta_${index}`]: value
                                }
                              }))
                            }
                          >
                            {['Excelente', 'Muito Bom', 'Bom', 'Regular', 'Ruim'].map((opcao) => (
                              <div key={opcao} className="flex items-center space-x-2">
                                <RadioGroupItem value={opcao} id={`${opcao}_${index}`} />
                                <Label htmlFor={`${opcao}_${index}`}>{opcao}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Perguntas Descritivas */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Perguntas Descritivas (Opcional)</h3>
                  {Array.from({ length: numPerguntasDescritivas }, (_, index) => (
                    <div key={index} className="space-y-4 p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Label>Pergunta {index + 1}</Label>
                        <Textarea
                          value={formData.perguntas_descritivas[`pergunta_${index}`] || ''}
                          onChange={(e) => 
                            setFormData(prev => ({
                              ...prev,
                              perguntas_descritivas: {
                                ...prev.perguntas_descritivas,
                                [`pergunta_${index}`]: e.target.value
                              }
                            }))
                          }
                          placeholder="Digite uma pergunta..."
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Resposta</Label>
                        <Textarea
                          value={formData.perguntas_descritivas[`resposta_${index}`] || ''}
                          onChange={(e) => 
                            setFormData(prev => ({
                              ...prev,
                              perguntas_descritivas: {
                                ...prev.perguntas_descritivas,
                                [`resposta_${index}`]: e.target.value
                              }
                            }))
                          }
                          placeholder="Digite sua resposta..."
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Feedback Geral */}
                <div className="space-y-2">
                  <Label>Feedback Geral (Opcional)</Label>
                  <Textarea
                    value={formData.feedback}
                    onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                    placeholder="Comentários adicionais sobre o funcionário..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setEtapa(1)}>
                    Voltar
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={enviando}
                  >
                    {enviando ? 'Enviando...' : 'Enviar Avaliação'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}