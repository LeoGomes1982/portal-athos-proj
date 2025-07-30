import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link, ExternalLink, User, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EscolhaTipoAvaliacaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelecionarTipo: (tipo: 'responder_aqui' | 'enviar_para_responder') => void;
}

export function EscolhaTipoAvaliacaoModal({ open, onOpenChange, onSelecionarTipo }: EscolhaTipoAvaliacaoModalProps) {
  const [etapa, setEtapa] = useState<'escolha' | 'configurar_link'>('escolha');
  const [funcionarios, setFuncionarios] = useState<{id: string, nome: string}[]>([]);
  const [formData, setFormData] = useState({
    funcionario_id: '',
    funcionario_nome: '',
    tipo_avaliacao: 'colega' as 'colega' | 'chefia' | 'responsavel',
    criado_por: ''
  });
  const [linkGerado, setLinkGerado] = useState('');
  const { toast } = useToast();

  // Buscar funcionários elegíveis
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
        nome: f.nome
      })) || []);
    };

    if (open) {
      buscarFuncionarios();
    }
  }, [open]);

  // Verificar se funcionário pode ser avaliado (regra de 3 meses)
  const verificarElegibilidade = async (funcionarioId: string, tipoAvaliacao: string) => {
    const treseMesesAtras = new Date();
    treseMesesAtras.setMonth(treseMesesAtras.getMonth() - 3);

    const { data, error } = await supabase
      .from('avaliacoes_desempenho')
      .select('id')
      .eq('funcionario_id', funcionarioId)
      .eq('tipo_avaliacao', tipoAvaliacao)
      .gte('data_avaliacao', treseMesesAtras.toISOString().split('T')[0])
      .limit(1);

    if (error) {
      console.error('Erro ao verificar elegibilidade:', error);
      return false;
    }

    return data.length === 0; // true se não há avaliações nos últimos 3 meses
  };

  const gerarLink = async () => {
    if (!formData.funcionario_id || !formData.funcionario_nome || !formData.criado_por) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Verificar elegibilidade
    const podeAvaliar = await verificarElegibilidade(formData.funcionario_id, formData.tipo_avaliacao);
    if (!podeAvaliar) {
      toast({
        title: "Erro",
        description: "Este funcionário já foi avaliado neste tipo nos últimos 3 meses",
        variant: "destructive"
      });
      return;
    }

    try {
      // Gerar token único
      const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
      
      // Calcular data de expiração (7 dias)
      const dataExpiracao = new Date();
      dataExpiracao.setDate(dataExpiracao.getDate() + 7);

      // Salvar link no banco
      const { data, error } = await supabase
        .from('avaliacao_externa_links')
        .insert({
          funcionario_id: formData.funcionario_id,
          funcionario_nome: formData.funcionario_nome,
          tipo_avaliacao: formData.tipo_avaliacao,
          token,
          criado_por: formData.criado_por,
          data_expiracao: dataExpiracao.toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Gerar URL completa
      const baseUrl = window.location.origin;
      const linkCompleto = `${baseUrl}/avaliacao-externa/${token}`;
      setLinkGerado(linkCompleto);

      toast({
        title: "Sucesso",
        description: "Link de avaliação gerado com sucesso!",
      });

    } catch (error) {
      console.error('Erro ao gerar link:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o link de avaliação",
        variant: "destructive"
      });
    }
  };

  const copiarLink = () => {
    navigator.clipboard.writeText(linkGerado);
    toast({
      title: "Copiado!",
      description: "Link copiado para a área de transferência",
    });
  };

  const compartilharWhatsApp = () => {
    const mensagem = `Olá! Você foi convidado(a) a responder uma avaliação de desempenho para ${formData.funcionario_nome}. 
    
Tipo: ${formData.tipo_avaliacao === 'colega' ? 'Avaliação de Colega' : 
          formData.tipo_avaliacao === 'chefia' ? 'Avaliação de Chefia' : 
          'Avaliação do Responsável'}

Acesse o link abaixo para responder:
${linkGerado}

Este link expira em 7 dias.`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, '_blank');
  };

  const resetModal = () => {
    setEtapa('escolha');
    setFormData({
      funcionario_id: '',
      funcionario_nome: '',
      tipo_avaliacao: 'colega',
      criado_por: ''
    });
    setLinkGerado('');
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetModal();
    }
    onOpenChange(open);
  };

  const renderEscolha = () => (
    <div className="space-y-6">
      <p className="text-center text-slate-600 mb-6">
        Como você gostaria de realizar esta avaliação?
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-purple-300"
          onClick={() => {
            onSelecionarTipo('responder_aqui');
            handleClose(false);
          }}
        >
          <CardContent className="p-6 text-center">
            <User className="mx-auto mb-4 text-purple-600" size={48} />
            <h3 className="text-lg font-semibold mb-2">Responder Aqui</h3>
            <p className="text-sm text-slate-600">
              Preencher a avaliação diretamente nesta tela
            </p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300"
          onClick={() => setEtapa('configurar_link')}
        >
          <CardContent className="p-6 text-center">
            <ExternalLink className="mx-auto mb-4 text-blue-600" size={48} />
            <h3 className="text-lg font-semibold mb-2">Enviar para Responder</h3>
            <p className="text-sm text-slate-600">
              Gerar link para compartilhar via WhatsApp
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderConfigurarLink = () => (
    <div className="space-y-6">
      {!linkGerado ? (
        <>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Funcionário a ser Avaliado</Label>
              <Select
                value={formData.funcionario_id}
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
                      {funcionario.nome}
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

            <div className="space-y-2">
              <Label>Criado por</Label>
              <Input
                value={formData.criado_por}
                onChange={(e) => setFormData(prev => ({ ...prev, criado_por: e.target.value }))}
                placeholder="Seu nome"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setEtapa('escolha')}>
              Voltar
            </Button>
            <Button onClick={gerarLink} className="flex-1">
              <Link size={16} className="mr-2" />
              Gerar Link
            </Button>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Link className="text-green-600" size={32} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Link Gerado com Sucesso!</h3>
            <p className="text-sm text-slate-600">
              Compartilhe este link para que a avaliação seja respondida
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <Label className="text-sm font-medium">Link de Avaliação:</Label>
            <div className="mt-2 p-3 bg-white border rounded-md text-sm break-all">
              {linkGerado}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={copiarLink} className="flex-1">
              <Link size={16} className="mr-2" />
              Copiar Link
            </Button>
            <Button onClick={compartilharWhatsApp} className="flex-1 bg-green-600 hover:bg-green-700">
              <MessageCircle size={16} className="mr-2" />
              WhatsApp
            </Button>
          </div>

          <div className="text-center">
            <Button variant="ghost" onClick={() => handleClose(false)}>
              Fechar
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {etapa === 'escolha' ? 'Nova Avaliação' : 'Configurar Link de Avaliação'}
          </DialogTitle>
        </DialogHeader>

        {etapa === 'escolha' && renderEscolha()}
        {etapa === 'configurar_link' && renderConfigurarLink()}
      </DialogContent>
    </Dialog>
  );
}