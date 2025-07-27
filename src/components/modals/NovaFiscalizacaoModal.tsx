import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NovaFiscalizacaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipo: 'posto_servico' | 'colaborador' | null;
  onFiscalizacaoAdicionada: () => void;
}

const PERGUNTAS_POSTO_SERVICO = [
  "O posto está limpo e organizado?",
  "Os equipamentos estão funcionando adequadamente?",
  "O colaborador está utilizando EPIs obrigatórios?",
  "Os procedimentos de segurança estão sendo seguidos?",
  "A documentação está atualizada e acessível?",
  "O atendimento ao cliente é adequado?",
  "Os recursos materiais estão disponíveis?",
  "O ambiente está em conformidade com as normas?"
];

const PERGUNTAS_COLABORADOR = [
  "Demonstra pontualidade e assiduidade?",
  "Utiliza corretamente os EPIs?",
  "Segue os procedimentos estabelecidos?",
  "Mantém boa apresentação pessoal?",
  "Demonstra conhecimento técnico adequado?",
  "Tem bom relacionamento com colegas e clientes?",
  "Mantém organização no posto de trabalho?",
  "Demonstra iniciativa e proatividade?",
  "Cumpre as normas da empresa?",
  "Demonstra responsabilidade nas tarefas?"
];

export function NovaFiscalizacaoModal({ open, onOpenChange, tipo, onFiscalizacaoAdicionada }: NovaFiscalizacaoModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [etapa, setEtapa] = useState(1);
  const [funcionarios, setFuncionarios] = useState<{id: string, nome: string}[]>([]);
  const [formData, setFormData] = useState({
    titulo: '',
    data_fiscalizacao: new Date().toISOString().split('T')[0],
    fiscalizador_nome: '',
    local: '',
    colaborador_nome: '',
    perguntas_marcadas: {} as Record<string, string>,
    perguntas_descritivas: {} as Record<string, string>,
    observacoes: ''
  });

  useEffect(() => {
    if (open && tipo === 'colaborador') {
      buscarFuncionarios();
    }
  }, [open, tipo]);

  useEffect(() => {
    if (tipo) {
      setFormData(prev => ({
        ...prev,
        titulo: tipo === 'posto_servico' ? 'Fiscalização de Posto de Serviço' : 'Fiscalização de Colaborador'
      }));
    }
  }, [tipo]);

  const buscarFuncionarios = async () => {
    try {
      const { data, error } = await supabase
        .from('funcionarios_sync')
        .select('funcionario_id, nome')
        .eq('status', 'ativo')
        .order('nome');
      
      if (error) throw error;
      
      setFuncionarios(data?.map(f => ({
        id: f.funcionario_id.toString(),
        nome: f.nome
      })) || []);
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
    }
  };

  const calcularResultado = (respostas: Record<string, string>) => {
    const valores = { 'Excelente': 5, 'Muito Bom': 4, 'Bom': 3, 'Regular': 2, 'Ruim': 1 };
    let pontuacaoTotal = 0;
    let totalPerguntas = 0;

    Object.values(respostas).forEach(resposta => {
      if (resposta && valores[resposta as keyof typeof valores]) {
        pontuacaoTotal += valores[resposta as keyof typeof valores];
        totalPerguntas++;
      }
    });

    if (totalPerguntas === 0) return { resultado: 'Sem Avaliação', pontuacao: 0 };

    const media = pontuacaoTotal / totalPerguntas;
    let resultado = '';

    if (media >= 4.5) resultado = 'Excelente';
    else if (media >= 3.5) resultado = 'Muito Bom';
    else if (media >= 2.5) resultado = 'Bom';
    else if (media >= 1.5) resultado = 'Regular';
    else resultado = 'Ruim';

    return { resultado, pontuacao: Math.round(pontuacaoTotal) };
  };

  const handleSubmit = async () => {
    if (!formData.titulo || !formData.fiscalizador_nome || !formData.data_fiscalizacao) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (tipo === 'posto_servico' && !formData.local) {
      toast({
        title: "Erro",
        description: "Informe o local para fiscalização de posto de serviço",
        variant: "destructive"
      });
      return;
    }

    if (tipo === 'colaborador' && !formData.colaborador_nome) {
      toast({
        title: "Erro",
        description: "Selecione o colaborador para fiscalização",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { resultado, pontuacao } = calcularResultado(formData.perguntas_marcadas);

      const { error } = await supabase
        .from('fiscalizacoes')
        .insert({
          tipo: tipo!,
          titulo: formData.titulo,
          data_fiscalizacao: formData.data_fiscalizacao,
          fiscalizador_nome: formData.fiscalizador_nome,
          local: tipo === 'posto_servico' ? formData.local : null,
          colaborador_nome: tipo === 'colaborador' ? formData.colaborador_nome : null,
          perguntas_marcadas: formData.perguntas_marcadas,
          perguntas_descritivas: formData.perguntas_descritivas,
          observacoes: formData.observacoes,
          resultado,
          pontuacao_total: pontuacao
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Fiscalização registrada com sucesso!"
      });

      // Reset form
      setEtapa(1);
      setFormData({
        titulo: '',
        data_fiscalizacao: new Date().toISOString().split('T')[0],
        fiscalizador_nome: '',
        local: '',
        colaborador_nome: '',
        perguntas_marcadas: {},
        perguntas_descritivas: {},
        observacoes: ''
      });

      onFiscalizacaoAdicionada();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao registrar fiscalização:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar fiscalização",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const perguntas = tipo === 'posto_servico' ? PERGUNTAS_POSTO_SERVICO : PERGUNTAS_COLABORADOR;

  const renderEtapa1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="titulo">Título da Fiscalização</Label>
        <Input
          id="titulo"
          value={formData.titulo}
          onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
          placeholder="Ex: Fiscalização Mensal - Janeiro/2024"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fiscalizador_nome">Nome do Fiscalizador</Label>
          <Input
            id="fiscalizador_nome"
            value={formData.fiscalizador_nome}
            onChange={(e) => setFormData(prev => ({ ...prev, fiscalizador_nome: e.target.value }))}
            placeholder="Seu nome"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="data_fiscalizacao">Data da Fiscalização</Label>
          <Input
            id="data_fiscalizacao"
            type="date"
            value={formData.data_fiscalizacao}
            onChange={(e) => setFormData(prev => ({ ...prev, data_fiscalizacao: e.target.value }))}
          />
        </div>
      </div>

      {tipo === 'posto_servico' && (
        <div className="space-y-2">
          <Label htmlFor="local">Local do Posto de Serviço</Label>
          <Input
            id="local"
            value={formData.local}
            onChange={(e) => setFormData(prev => ({ ...prev, local: e.target.value }))}
            placeholder="Ex: Portaria Principal, Guarita 02, etc."
          />
        </div>
      )}

      {tipo === 'colaborador' && (
        <div className="space-y-2">
          <Label>Colaborador a ser Fiscalizado</Label>
          <Select
            value={formData.colaborador_nome}
            onValueChange={(value) => setFormData(prev => ({ ...prev, colaborador_nome: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o colaborador" />
            </SelectTrigger>
            <SelectContent>
              {funcionarios.map((funcionario) => (
                <SelectItem key={funcionario.id} value={funcionario.nome}>
                  {funcionario.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );

  const renderEtapa2 = () => (
    <div className="space-y-6 max-h-96 overflow-y-auto">
      <h3 className="text-lg font-semibold">Perguntas de Avaliação</h3>
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
  );

  const renderEtapa3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Observações Complementares</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="observacao_geral">Observação Geral</Label>
          <Textarea
            id="observacao_geral"
            value={formData.perguntas_descritivas.observacao_geral || ''}
            onChange={(e) => 
              setFormData(prev => ({
                ...prev,
                perguntas_descritivas: {
                  ...prev.perguntas_descritivas,
                  observacao_geral: e.target.value
                }
              }))
            }
            placeholder="Descreva aspectos gerais observados durante a fiscalização..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pontos_positivos">Pontos Positivos</Label>
          <Textarea
            id="pontos_positivos"
            value={formData.perguntas_descritivas.pontos_positivos || ''}
            onChange={(e) => 
              setFormData(prev => ({
                ...prev,
                perguntas_descritivas: {
                  ...prev.perguntas_descritivas,
                  pontos_positivos: e.target.value
                }
              }))
            }
            placeholder="Liste os pontos positivos identificados..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pontos_melhoria">Pontos para Melhoria</Label>
          <Textarea
            id="pontos_melhoria"
            value={formData.perguntas_descritivas.pontos_melhoria || ''}
            onChange={(e) => 
              setFormData(prev => ({
                ...prev,
                perguntas_descritivas: {
                  ...prev.perguntas_descritivas,
                  pontos_melhoria: e.target.value
                }
              }))
            }
            placeholder="Liste os pontos que necessitam melhoria..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="observacoes">Observações Finais</Label>
          <Textarea
            id="observacoes"
            value={formData.observacoes}
            onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
            placeholder="Adicione observações finais, recomendações ou ações necessárias..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  if (!tipo) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {tipo === 'posto_servico' ? 'Nova Fiscalização de Posto de Serviço' : 'Nova Fiscalização de Colaborador'} - Etapa {etapa}/3
          </DialogTitle>
        </DialogHeader>

        {etapa === 1 && renderEtapa1()}
        {etapa === 2 && renderEtapa2()}
        {etapa === 3 && renderEtapa3()}

        <div className="flex justify-between pt-4">
          {etapa > 1 && (
            <Button variant="outline" onClick={() => setEtapa(etapa - 1)}>
              Anterior
            </Button>
          )}
          {etapa < 3 ? (
            <Button onClick={() => setEtapa(etapa + 1)} className="ml-auto">
              Próximo
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading} className="ml-auto">
              {loading ? "Salvando..." : "Finalizar Fiscalização"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}