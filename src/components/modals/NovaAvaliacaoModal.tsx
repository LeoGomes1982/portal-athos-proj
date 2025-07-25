import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAvaliacoes, AvaliacaoFormData } from "@/hooks/useAvaliacoes";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NovaAvaliacaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function NovaAvaliacaoModal({ open, onOpenChange }: NovaAvaliacaoModalProps) {
  const { adicionarAvaliacao } = useAvaliacoes();
  const { toast } = useToast();
  const [etapa, setEtapa] = useState(1);
  const [funcionarios, setFuncionarios] = useState<{id: string, nome: string, status: string}[]>([]);
  const [formData, setFormData] = useState<Partial<AvaliacaoFormData>>({
    tipo_avaliacao: 'colega',
    data_avaliacao: new Date().toISOString().split('T')[0],
    perguntas_marcadas: {},
    perguntas_descritivas: {},
    recomendacoes: {},
    sugestoes: {}
  });

  const handleSubmit = async () => {
    if (!formData.funcionario_id || !formData.funcionario_nome || !formData.avaliador_nome) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const success = await adicionarAvaliacao(formData as AvaliacaoFormData);
    if (success) {
      onOpenChange(false);
      setEtapa(1);
      setFormData({
        tipo_avaliacao: 'colega',
        data_avaliacao: new Date().toISOString().split('T')[0],
        perguntas_marcadas: {},
        perguntas_descritivas: {},
        recomendacoes: {},
        sugestoes: {}
      });
    }
  };

  // Buscar funcionários elegíveis para avaliação
  useEffect(() => {
    const buscarFuncionarios = async () => {
      const { data, error } = await supabase
        .from('funcionarios_sync')
        .select('funcionario_id, nome, status')
        .in('status', ['ativo', 'experiencia', 'aviso_previo', 'ferias'])
        .order('nome');
      
      if (error) {
        console.error('Erro ao buscar funcionários:', error);
        return;
      }
      
      setFuncionarios(data?.map(f => ({
        id: f.funcionario_id.toString(),
        nome: f.nome,
        status: f.status
      })) || []);
    };

    if (open) {
      buscarFuncionarios();
    }
  }, [open]);

  const renderEtapa1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Nome do Funcionário</Label>
        <Select
          value={formData.funcionario_id || ''}
          onValueChange={(value) => {
            const funcionario = funcionarios.find(f => f.id === value);
            setFormData(prev => ({ 
              ...prev, 
              funcionario_id: value,
              funcionario_nome: funcionario?.nome || ''
            }));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o funcionário" />
          </SelectTrigger>
          <SelectContent>
            {funcionarios.map((funcionario) => (
              <SelectItem key={funcionario.id} value={funcionario.id}>
                {funcionario.nome} ({funcionario.status})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Tipo de Avaliação</Label>
        <Select
          value={formData.tipo_avaliacao}
          onValueChange={(value: 'colega' | 'chefia' | 'responsavel') => 
            setFormData(prev => ({ ...prev, tipo_avaliacao: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="colega">Avaliação de Colega</SelectItem>
            <SelectItem value="chefia">Avaliação de Chefia</SelectItem>
            <SelectItem value="responsavel">Avaliação do Responsável</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nome do Avaliador</Label>
          <Input
            value={formData.avaliador_nome || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, avaliador_nome: e.target.value }))}
            placeholder="Seu nome"
          />
        </div>
        <div className="space-y-2">
          <Label>Data da Avaliação</Label>
          <Input
            type="date"
            value={formData.data_avaliacao || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, data_avaliacao: e.target.value }))}
          />
        </div>
      </div>
    </div>
  );

  const renderEtapa2 = () => {
    const perguntas = PERGUNTAS_AVALIACAO[formData.tipo_avaliacao || 'colega'];
    
    return (
      <div className="space-y-6 max-h-96 overflow-y-auto">
        <h3 className="text-lg font-semibold">Perguntas de Múltipla Escolha</h3>
        {perguntas.map((pergunta, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{pergunta}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.perguntas_marcadas?.[`pergunta_${index}`] || ''}
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
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Excelente" id={`excelente_${index}`} />
                  <Label htmlFor={`excelente_${index}`}>Excelente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Muito Bom" id={`muito_bom_${index}`} />
                  <Label htmlFor={`muito_bom_${index}`}>Muito Bom</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Bom" id={`bom_${index}`} />
                  <Label htmlFor={`bom_${index}`}>Bom</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Regular" id={`regular_${index}`} />
                  <Label htmlFor={`regular_${index}`}>Regular</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Ruim" id={`ruim_${index}`} />
                  <Label htmlFor={`ruim_${index}`}>Ruim</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderEtapa3 = () => {
    const numPerguntasDescritivas = formData.tipo_avaliacao === 'colega' ? 1 : 
                                   formData.tipo_avaliacao === 'chefia' ? 4 : 5;
    
    return (
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <h3 className="text-lg font-semibold">Perguntas Descritivas</h3>
        {Array.from({ length: numPerguntasDescritivas }, (_, index) => (
          <div key={index} className="space-y-2">
            <Label>Pergunta Descritiva {index + 1}</Label>
            <Textarea
              value={formData.perguntas_descritivas?.[`descritiva_${index}`] || ''}
              onChange={(e) => 
                setFormData(prev => ({
                  ...prev,
                  perguntas_descritivas: {
                    ...prev.perguntas_descritivas,
                    [`descritiva_${index}`]: e.target.value
                  }
                }))
              }
              placeholder="Digite sua resposta..."
              rows={3}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Avaliação de Desempenho - Etapa {etapa}/3</DialogTitle>
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
            <Button onClick={handleSubmit} className="ml-auto">
              Finalizar Avaliação
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}